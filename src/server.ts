import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

interface ServerTask {
  id: string;
  title: string;
  course: string;
  type: 'assignment' | 'exam';
  dueDate: string; // YYYY-MM-DD
  time?: string;
  completed: boolean;
  completedAt?: string | null;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  estimatedHours?: number;
  createdAt: string;
}

// In-memory task repository with realistic initial student tasks
let tasksStore: ServerTask[] = [
  {
    id: 'task-1',
    title: 'Examen Parcial de Cálculo Diferencial e Integral',
    course: 'Cálculo II',
    type: 'exam',
    dueDate: '2026-10-12',
    time: '09:00',
    completed: false,
    priority: 'high',
    notes: 'Temas: Series de Taylor, Integrales dobles y cambio de variable en polares. Traer calculadora no programable.',
    estimatedHours: 8,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Entrega de Taller 3: Estructuras de Datos Avanzadas',
    course: 'Algoritmos y Estructuras',
    type: 'assignment',
    dueDate: '2026-10-09',
    time: '23:59',
    completed: false,
    priority: 'high',
    notes: 'Implementación de Árboles AVL y Grafos con pruebas unitarias en TypeScript.',
    estimatedHours: 5,
    createdAt: '2026-10-02T14:30:00Z',
  },
  {
    id: 'task-3',
    title: 'Ensayo Crítico sobre Arquitectura de Software Limpia',
    course: 'Ingeniería de Software',
    type: 'assignment',
    dueDate: '2026-10-15',
    time: '18:00',
    completed: false,
    priority: 'medium',
    notes: 'Mínimo 2000 palabras analizando desacoplamiento de capas y puertos/adaptadores en sistemas web.',
    estimatedHours: 4,
    createdAt: '2026-10-03T11:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Examen Teórico de Bases de Datos Relacionales',
    course: 'Bases de Datos',
    type: 'exam',
    dueDate: '2026-10-19',
    time: '11:00',
    completed: false,
    priority: 'high',
    notes: 'Normalización 3FN/Boyce-Codd, álgebra relacional y diseño de índices B-Tree.',
    estimatedHours: 6,
    createdAt: '2026-10-04T09:15:00Z',
  },
  {
    id: 'task-5',
    title: 'Laboratorio 2: Configuración de Redes y Subnetting',
    course: 'Redes de Computadores',
    type: 'assignment',
    dueDate: '2026-10-08',
    time: '16:00',
    completed: true,
    completedAt: '2026-10-07T20:10:00Z',
    priority: 'medium',
    notes: 'Topología con router Cisco Packet Tracer y enrutamiento OSPF configurado.',
    estimatedHours: 3,
    createdAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Presentación Oral: Inteligencia Artificial Ética',
    course: 'Ética y Sociedad',
    type: 'assignment',
    dueDate: '2026-10-23',
    time: '10:30',
    completed: false,
    priority: 'low',
    notes: 'Diapositivas de 10 minutos sobre sesgos algorítmicos y responsabilidad en modelos generativos.',
    estimatedHours: 3,
    createdAt: '2026-10-05T12:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Examen Final de Física: Electromagnetismo',
    course: 'Física II',
    type: 'exam',
    dueDate: '2026-10-27',
    time: '08:00',
    completed: false,
    priority: 'high',
    notes: 'Leyes de Maxwell, ondas electromagnéticas e inducción de Faraday. Fórmulas permitidas en 1 hoja.',
    estimatedHours: 10,
    createdAt: '2026-10-06T08:00:00Z',
  },
];

/**
 * Task API Endpoints
 */
app.get('/api/tasks', (req, res) => {
  const { type, completed, course } = req.query;
  let filtered = [...tasksStore];

  if (type && (type === 'assignment' || type === 'exam')) {
    filtered = filtered.filter((t) => t.type === type);
  }

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filtered = filtered.filter((t) => t.completed === isCompleted);
  }

  if (course && typeof course === 'string') {
    filtered = filtered.filter(
      (t) => t.course.toLowerCase() === course.toLowerCase()
    );
  }

  // Sort by dueDate ascending, then priority
  filtered.sort((a, b) => {
    const dateComp = a.dueDate.localeCompare(b.dueDate);
    if (dateComp !== 0) return dateComp;
    return (a.time || '').localeCompare(b.time || '');
  });

  res.json(filtered);
});

app.post('/api/tasks', (req, res) => {
  const { title, course, type, dueDate, time, priority, notes, estimatedHours } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'El título es obligatorio.' });
    return;
  }

  if (!type || (type !== 'assignment' && type !== 'exam')) {
    res.status(400).json({ error: 'El tipo debe ser estrictamente "assignment" o "exam".' });
    return;
  }

  if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    res.status(400).json({ error: 'La fecha de entrega debe tener formato YYYY-MM-DD.' });
    return;
  }

  const newTask: ServerTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim(),
    course: (course || 'General').trim(),
    type,
    dueDate,
    time: time || undefined,
    completed: false,
    priority: priority === 'high' || priority === 'low' ? priority : 'medium',
    notes: notes?.trim() || undefined,
    estimatedHours: Number(estimatedHours) > 0 ? Number(estimatedHours) : undefined,
    createdAt: new Date().toISOString(),
  };

  tasksStore.push(newTask);
  res.status(201).json(newTask);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasksStore.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Tarea no encontrada.' });
    return;
  }
  res.json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const index = tasksStore.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Tarea no encontrada.' });
    return;
  }

  const existing = tasksStore[index];
  const updates = req.body;

  if (updates.type && updates.type !== 'assignment' && updates.type !== 'exam') {
    res.status(400).json({ error: 'Tipo inválido.' });
    return;
  }

  if (updates.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(updates.dueDate)) {
    res.status(400).json({ error: 'Formato de fecha inválido.' });
    return;
  }

  const updatedTask: ServerTask = {
    ...existing,
    ...updates,
    id: existing.id, // prevent ID change
  };

  if (updates.completed === true && !existing.completed) {
    updatedTask.completedAt = new Date().toISOString();
  } else if (updates.completed === false) {
    updatedTask.completedAt = null;
  }

  tasksStore[index] = updatedTask;
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const initialLength = tasksStore.length;
  tasksStore = tasksStore.filter((t) => t.id !== req.params.id);

  if (tasksStore.length === initialLength) {
    res.status(404).json({ error: 'Tarea no encontrada.' });
    return;
  }

  res.status(204).send();
});

app.post('/api/tasks/seed', (_req, res) => {
  // Reset to initial sample tasks
  res.json({ message: 'Datos restaurados con éxito.', count: tasksStore.length });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
