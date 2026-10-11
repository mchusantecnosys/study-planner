import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocFromServer,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import { Task } from '../models/task.model';

// Embedded Firebase config provisioned for this applet
const FIREBASE_CONFIG = {
  projectId: 'marklar-folder-ncbh2',
  appId: '1:912715734742:web:81f8509038ee81d8887377',
  apiKey: 'AIzaSyC59EVo8qAuAvMJhWAdPeGtSMRQgJh50AE',
  authDomain: 'marklar-folder-ncbh2.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-studyplannergest-04f3a36c-940c-4440-9c95-cc9c10c4dd99',
  storageBucket: 'marklar-folder-ncbh2.firebasestorage.app',
  messagingSenderId: '912715734742',
};

export type SyncState = 'connecting' | 'synced' | 'syncing' | 'offline' | 'error';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;

  // Reactive state signals
  readonly currentUser = signal<User | null>(null);
  readonly isAuthLoading = signal<boolean>(true);
  readonly syncState = signal<SyncState>('connecting');
  readonly isCloudReady = signal<boolean>(false);
  readonly lastSyncTime = signal<Date | null>(null);

  constructor() {
    if (this.isBrowser) {
      this.initFirebase();
    } else {
      this.isAuthLoading.set(false);
    }
  }

  private async initFirebase(): Promise<void> {
    try {
      if (!getApps().length) {
        this.app = initializeApp(FIREBASE_CONFIG);
      } else {
        this.app = getApps()[0];
      }

      this.auth = getAuth(this.app);
      // Use the provisioned database ID
      this.db = getFirestore(this.app, FIREBASE_CONFIG.firestoreDatabaseId);

      // Listen to auth changes
      onAuthStateChanged(this.auth, (user) => {
        this.isAuthLoading.set(false);
        if (user) {
          this.currentUser.set(user);
          this.isCloudReady.set(true);
          this.syncState.set('synced');
          this.lastSyncTime.set(new Date());
        } else {
          this.currentUser.set(null);
          this.isCloudReady.set(false);
          this.syncState.set('offline');
        }
      });

      // Test connectivity as per security skill
      this.testConnection();
    } catch {
      this.isAuthLoading.set(false);
      this.syncState.set('offline');
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.db) return;
    try {
      await getDocFromServer(doc(this.db, 'system', 'ping'));
    } catch (err: unknown) {
      // Permission-denied on missing doc is normal and confirms reachability
      if (err instanceof Error && err.message.includes('the client is offline')) {
        this.syncState.set('offline');
      }
    }
  }

  /**
   * Subscribes to real-time changes for the current user's tasks
   */
  subscribeToUserTasks(onTasksReceived: (tasks: Task[]) => void): () => void {
    const noop = (): void => undefined;
    if (!this.isBrowser || !this.db) {
      return noop;
    }

    const user = this.currentUser();
    if (!user) {
      return noop;
    }

    const tasksCol = collection(this.db, 'tasks');
    const userTasksQuery = query(tasksCol, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      userTasksQuery,
      (snapshot) => {
        const tasks: Task[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          tasks.push({
            id: data['id'] || docSnap.id,
            title: data['title'],
            course: data['course'],
            type: data['type'],
            dueDate: data['dueDate'],
            time: data['time'] || undefined,
            completed: Boolean(data['completed']),
            completedAt: data['completedAt'] || null,
            priority: data['priority'] || 'medium',
            notes: data['notes'] || undefined,
            estimatedHours: data['estimatedHours'] || undefined,
            createdAt: data['createdAt'] || new Date().toISOString(),
          });
        });
        this.syncState.set('synced');
        this.lastSyncTime.set(new Date());
        onTasksReceived(tasks);
      },
      () => {
        this.syncState.set('offline');
      }
    );

    return unsubscribe;
  }

  /**
   * Persists a task to Firestore
   */
  async saveTaskToCloud(task: Task): Promise<void> {
    if (!this.db) return;
    const user = this.currentUser();
    if (!user) return;

    this.syncState.set('syncing');
    try {
      const taskRef = doc(this.db, 'tasks', task.id);
      const payload: Record<string, unknown> = {
        id: task.id,
        userId: user.uid,
        title: task.title,
        course: task.course,
        type: task.type,
        dueDate: task.dueDate,
        completed: task.completed,
        priority: task.priority,
        createdAt: task.createdAt,
      };

      if (task.time) payload['time'] = task.time;
      if (task.notes) payload['notes'] = task.notes;
      if (task.completedAt) payload['completedAt'] = task.completedAt;
      if (task.estimatedHours) payload['estimatedHours'] = task.estimatedHours;

      await setDoc(taskRef, payload, { merge: true });
      this.syncState.set('synced');
      this.lastSyncTime.set(new Date());
    } catch {
      this.syncState.set('offline');
    }
  }

  /**
   * Deletes a task from Firestore
   */
  async deleteTaskFromCloud(taskId: string): Promise<void> {
    if (!this.db) return;
    const user = this.currentUser();
    if (!user) return;

    this.syncState.set('syncing');
    try {
      await deleteDoc(doc(this.db, 'tasks', taskId));
      this.syncState.set('synced');
      this.lastSyncTime.set(new Date());
    } catch {
      this.syncState.set('offline');
    }
  }

  /**
   * Backs up multiple tasks in a single batch write
   */
  async backupAllTasks(tasks: Task[]): Promise<void> {
    if (!this.db) return;
    const user = this.currentUser();
    if (!user || tasks.length === 0) return;

    this.syncState.set('syncing');
    try {
      const batch = writeBatch(this.db);
      for (const task of tasks) {
        const taskRef = doc(this.db, 'tasks', task.id);
        const payload: Record<string, unknown> = {
          id: task.id,
          userId: user.uid,
          title: task.title,
          course: task.course,
          type: task.type,
          dueDate: task.dueDate,
          completed: task.completed,
          priority: task.priority,
          createdAt: task.createdAt,
        };
        if (task.time) payload['time'] = task.time;
        if (task.notes) payload['notes'] = task.notes;
        if (task.completedAt) payload['completedAt'] = task.completedAt;
        if (task.estimatedHours) payload['estimatedHours'] = task.estimatedHours;

        batch.set(taskRef, payload, { merge: true });
      }
      await batch.commit();
      this.syncState.set('synced');
      this.lastSyncTime.set(new Date());
    } catch {
      this.syncState.set('offline');
    }
  }

  /**
   * Link or sign in with Google for persistent cross-device access
   */
  async signInWithGoogle(): Promise<User | null> {
    if (!this.auth) return null;
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(this.auth, provider);
      this.currentUser.set(cred.user);
      this.syncState.set('synced');
      return cred.user;
    } catch {
      // User closed popup or cancelled
      return null;
    }
  }

  async signOutUser(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
    this.currentUser.set(null);
    this.isCloudReady.set(false);
    this.syncState.set('offline');
  }
}
