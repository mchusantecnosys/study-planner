export type Language = 'es' | 'en';

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    today: string;
    tomorrow: string;
    yesterday: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    days: string;
    day: string;
    hours: string;
    tasks: string;
    task: string;
    or: string;
    assignment: string;
    exam: string;
    general: string;
  };
  header: {
    syncActive: string;
    syncing: string;
    syncOffline: string;
    backupTooltip: string;
    backupBtn: string;
    exportTooltip: string;
    exportBtn: string;
    newActivity: string;
    signInGoogle: string;
    signOut: string;
    languageAria: string;
  };
  authGate: {
    kicker: string;
    title: string;
    description: string;
    highlight1Title: string;
    highlight1Desc: string;
    highlight2Title: string;
    highlight2Desc: string;
    highlight3Title: string;
    highlight3Desc: string;
    connecting: string;
    loginWithGoogle: string;
    privacyNote: string;
  };
  mainLead: {
    kicker: string;
    question: string;
    viewList: string;
    viewWeek: string;
    viewMonth: string;
    viewsAria: string;
  };
  taskList: {
    overdue: string;
    today: string;
    thisWeek: string;
    later: string;
    completed: string;
    emptyToday: string;
  };
  taskRow: {
    markComplete: string;
    markPending: string;
    examBadge: string;
    overdueYesterday: string;
    overduePrefix: string;
    editTooltip: string;
    deleteTooltip: string;
    confirmDelete: string;
  };
  quickAdd: {
    typeExam: string;
    typeAssignment: string;
    tooltipExam: string;
    tooltipAssignment: string;
    placeholder: string;
    ariaLabel: string;
    courseAriaLabel: string;
    addBtn: string;
  };
  taskModal: {
    createTitle: string;
    editTitle: string;
    subtitle: string;
    typeLabel: string;
    typeAssignment: string;
    typeExam: string;
    titleLabel: string;
    titlePlaceholder: string;
    titleError: string;
    courseLabel: string;
    coursePlaceholder: string;
    courseError: string;
    priorityLabel: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    dueDateLabel: string;
    shortcutToday: string;
    shortcutTomorrow: string;
    shortcut3Days: string;
    shortcut1Week: string;
    timeLabel: string;
    hoursLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveChanges: string;
    createTask: string;
    closeAria: string;
  };
  calendar: {
    prevMonthAria: string;
    nextMonthAria: string;
    prevWeekAria: string;
    nextWeekAria: string;
    todayBtn: string;
    selectedDayTitle: string;
    addForThisDay: string;
    emptyDayTasks: string;
    weekOf: string;
    addBtn: string;
    emptyWeekDayTasks: string;
    pendingCount: string;
  };
  sidebar: {
    nextExam: string;
    daySingular: string;
    dayPlural: string;
    weeklyWorkload: string;
    tasksCount: string;
    subjects: string;
    viewAll: string;
    filtering: string;
  };
  stats: {
    examsTitle: string;
    examsDesc: string;
    assignmentsTitle: string;
    assignmentsDesc: string;
    dueTitle: string;
    dueDescOverdue: string;
    dueDescAllGood: string;
    completedTitle: string;
    in7Days: string;
    late: string;
  };
  footer: {
    localFirstDesc: string;
    cloudReplicaDesc: string;
    restoreSample: string;
    signOut: string;
    confirmRestore: string;
  };
  toasts: {
    backupSynced: string;
    googleSignedIn: string;
    googleSignedOut: string;
    taskSaved: string;
    calendarExported: string;
    samplesRestored: string;
  };
  tour: {
    guideBtn: string;
    guideTooltip: string;
    stepOf: string;
    skip: string;
    next: string;
    prev: string;
    finish: string;
    welcome: {
      badge: string;
      title: string;
      desc: string;
    };
    quickAdd: {
      badge: string;
      title: string;
      desc: string;
    };
    views: {
      badge: string;
      title: string;
      desc: string;
    };
    sidebar: {
      badge: string;
      title: string;
      desc: string;
    };
    sync: {
      badge: string;
      title: string;
      desc: string;
    };
    lang: {
      badge: string;
      title: string;
      desc: string;
    };
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    common: {
      appName: 'StudyPlanner',
      tagline: 'El cuaderno de la tarde',
      loading: 'Abriendo tu cuaderno...',
      today: 'Hoy',
      tomorrow: 'Mañana',
      yesterday: 'Ayer',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Añadir',
      close: 'Cerrar',
      days: 'días',
      day: 'día',
      hours: 'horas',
      tasks: 'tareas',
      task: 'tarea',
      or: 'o',
      assignment: 'Deber / Trabajo',
      exam: 'Examen / Evaluación',
      general: 'General',
    },
    header: {
      syncActive: 'Local-First + Nube activa',
      syncing: 'Sincronizando',
      syncOffline: 'Dexie local (sin conexión)',
      backupTooltip: 'Forzar respaldo en Cloud Firestore',
      backupBtn: 'Respaldar',
      exportTooltip: 'Exportar a Google o Apple Calendar',
      exportBtn: 'Exportar .ICS',
      newActivity: '+ Nueva actividad',
      signInGoogle: 'Entrar con Google',
      signOut: 'Cerrar sesión',
      languageAria: 'Cambiar idioma',
    },
    authGate: {
      kicker: 'El cuaderno de la tarde',
      title: 'Tu cuaderno de estudio personal',
      description: 'Un espacio sereno para gestionar deberes y exámenes sin urgencias ficticias. Arquitectura local-first con réplica en la nube.',
      highlight1Title: '0 ms de Latencia',
      highlight1Desc: 'Lectura y escritura instantánea en tu navegador con IndexedDB.',
      highlight2Title: 'Sin Esperas de Red',
      highlight2Desc: 'Funciona sin internet. Sincroniza en segundo plano cuando te conectas.',
      highlight3Title: 'Aislamiento Seguro',
      highlight3Desc: 'Tus tareas pertenecen únicamente a tu cuenta de Google en Firestore.',
      connecting: 'Conectando...',
      loginWithGoogle: 'Entrar con Google',
      privacyNote: 'Acceso seguro. No almacenamos contraseñas.',
    },
    mainLead: {
      kicker: 'Jornada de Estudio',
      question: 'Un espacio de calma para responder a una sola pregunta: ¿qué preparo ahora?',
      viewList: 'Lista',
      viewWeek: 'Semana',
      viewMonth: 'Mes',
      viewsAria: 'Vistas del planificador',
    },
    taskList: {
      overdue: 'Atrasadas',
      today: 'Hoy',
      thisWeek: 'Esta Semana',
      later: 'Más Adelante',
      completed: 'Completadas',
      emptyToday: 'Sin tareas pendientes para hoy. Puedes capturar una arriba.',
    },
    taskRow: {
      markComplete: 'Marcar como completada',
      markPending: 'Marcar como pendiente',
      examBadge: 'Examen',
      overdueYesterday: 'Venció ayer',
      overduePrefix: 'Venció',
      editTooltip: 'Editar tarea',
      deleteTooltip: 'Eliminar tarea',
      confirmDelete: '¿Eliminar esta tarea?',
    },
    quickAdd: {
      typeExam: 'Examen',
      typeAssignment: 'Deber',
      tooltipExam: 'Crear como Examen',
      tooltipAssignment: 'Crear como Deber',
      placeholder: '¿Qué tienes que preparar hoy? Escribe y pulsa Añadir...',
      ariaLabel: 'Título de la tarea rápida para hoy',
      courseAriaLabel: 'Seleccionar materia',
      addBtn: 'Añadir',
    },
    taskModal: {
      createTitle: 'Nueva Tarea o Examen',
      editTitle: 'Editar Actividad',
      subtitle: 'Planificación académica en fecha pura sin desfase horario',
      typeLabel: 'Tipo de Actividad',
      typeAssignment: 'Deber / Trabajo',
      typeExam: 'Examen / Evaluación',
      titleLabel: 'Título de la actividad',
      titlePlaceholder: 'Ej: Examen Parcial de Álgebra Lineal',
      titleError: 'El título es obligatorio (mínimo 3 caracteres).',
      courseLabel: 'Materia',
      coursePlaceholder: 'Ej: Cálculo II',
      courseError: 'La materia es obligatoria.',
      priorityLabel: 'Prioridad',
      priorityLow: 'Baja',
      priorityMedium: 'Media',
      priorityHigh: 'Alta',
      dueDateLabel: 'Fecha de Entrega',
      shortcutToday: 'Hoy',
      shortcutTomorrow: 'Mañana',
      shortcut3Days: 'En 3 días',
      shortcut1Week: 'En 1 semana',
      timeLabel: 'Hora (Opcional)',
      hoursLabel: 'Horas Estimadas',
      notesLabel: 'Apuntes o Temario',
      notesPlaceholder: 'Ej: Capítulos 4 y 5. Llevar formulario impreso.',
      saveChanges: 'Guardar Cambios',
      createTask: 'Crear Tarea',
      closeAria: 'Cerrar modal',
    },
    calendar: {
      prevMonthAria: 'Mes anterior',
      nextMonthAria: 'Mes siguiente',
      prevWeekAria: 'Semana anterior',
      nextWeekAria: 'Semana siguiente',
      todayBtn: 'Hoy',
      selectedDayTitle: 'Jornada Elegida',
      addForThisDay: '+ Añadir para este día',
      emptyDayTasks: 'No hay entregas registradas para este día.',
      weekOf: 'Semana del',
      addBtn: '+ Añadir',
      emptyWeekDayTasks: 'Sin entregas programadas',
      pendingCount: 'pendientes',
    },
    sidebar: {
      nextExam: 'Próximo Examen',
      daySingular: 'DÍA',
      dayPlural: 'DÍAS',
      weeklyWorkload: 'Carga Semanal',
      tasksCount: 'tareas',
      subjects: 'Materias',
      viewAll: 'Ver todas',
      filtering: 'Filtrando',
    },
    stats: {
      examsTitle: 'Exámenes',
      examsDesc: 'Evaluaciones programadas',
      assignmentsTitle: 'Deberes',
      assignmentsDesc: 'Trabajos y talleres',
      dueTitle: 'Por Entregar',
      dueDescOverdue: 'Atención a vencidas',
      dueDescAllGood: 'Todo al día',
      completedTitle: 'Completadas',
      in7Days: 'en 7d',
      late: 'tarde',
    },
    footer: {
      localFirstDesc: 'Local-First (Dexie IndexedDB)',
      cloudReplicaDesc: 'Réplica en Cloud Firestore',
      restoreSample: 'Restaurar ejemplos',
      signOut: 'Cerrar sesión',
      confirmRestore: '¿Restaurar los apuntes y tareas de ejemplo?',
    },
    toasts: {
      backupSynced: 'Copia de respaldo sincronizada con Firebase',
      googleSignedIn: 'Sesión iniciada con Google en Firebase',
      googleSignedOut: 'Sesión de Google cerrada',
      taskSaved: 'Guardado',
      calendarExported: 'Calendario académico exportado (.ICS)',
      samplesRestored: 'Datos de ejemplo restaurados',
    },
    tour: {
      guideBtn: 'Tutorial',
      guideTooltip: 'Ver recorrido guiado por StudyPlanner',
      stepOf: 'Paso {current} de {total}',
      skip: 'Saltar tutorial',
      next: 'Siguiente',
      prev: 'Anterior',
      finish: '¡Comenzar a estudiar!',
      welcome: {
        badge: 'Bienvenida',
        title: '¡Te damos la bienvenida a StudyPlanner!',
        desc: 'Tu cuaderno académico con arquitectura Local-First. Todo carga de forma instantánea en tu dispositivo y se sincroniza en la nube de Google en segundo plano sin esperas.',
      },
      quickAdd: {
        badge: 'Acceso Rápido',
        title: 'Barra de captura rápida',
        desc: 'Escribe el nombre de tu tarea o examen y presiona Enter para crearla al instante. Puedes cambiar entre deber o examen con un clic.',
      },
      views: {
        badge: 'Vistas del Cuaderno',
        title: 'Lista, Semana y Mes',
        desc: 'Organiza tu tiempo según lo necesites: visualiza tus pendientes por plazos, revisa la semana en curso o consulta el calendario mensual completo.',
      },
      sidebar: {
        badge: 'Panel Editorial',
        title: 'Próximo examen y materias',
        desc: 'Ten siempre presente la cuenta regresiva de tu evaluación más cercana, la carga de actividades de los próximos 7 días y filtra tareas por asignatura.',
      },
      sync: {
        badge: 'Sincronización',
        title: 'Estado en la nube y respaldos',
        desc: 'Tus datos se guardan en Dexie IndexedDB al instante y se respaldan en Firebase Firestore cuando estás conectado. También puedes exportar tu calendario a .ICS.',
      },
      lang: {
        badge: 'Bilingüe',
        title: 'Español e Inglés',
        desc: 'Puedes alternar entre Español e Inglés en cualquier momento. Tu preferencia queda recordada en tu dispositivo.',
      },
    },
  },
  en: {
    common: {
      appName: 'StudyPlanner',
      tagline: 'The afternoon notebook',
      loading: 'Opening your notebook...',
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      days: 'days',
      day: 'day',
      hours: 'hours',
      tasks: 'tasks',
      task: 'task',
      or: 'or',
      assignment: 'Assignment / Coursework',
      exam: 'Exam / Evaluation',
      general: 'General',
    },
    header: {
      syncActive: 'Local-First + Cloud sync active',
      syncing: 'Syncing',
      syncOffline: 'Dexie local (offline)',
      backupTooltip: 'Force backup to Cloud Firestore',
      backupBtn: 'Backup',
      exportTooltip: 'Export to Google or Apple Calendar',
      exportBtn: 'Export .ICS',
      newActivity: '+ New activity',
      signInGoogle: 'Sign in with Google',
      signOut: 'Sign out',
      languageAria: 'Switch language',
    },
    authGate: {
      kicker: 'The afternoon notebook',
      title: 'Your personal study notebook',
      description: 'A serene space to manage assignments and exams without fabricated urgency. Local-first architecture with automatic cloud backup.',
      highlight1Title: '0 ms Latency',
      highlight1Desc: 'Instant read and write directly in your browser with IndexedDB.',
      highlight2Title: 'No Network Waiting',
      highlight2Desc: 'Works offline. Automatically syncs in the background when connected.',
      highlight3Title: 'Secure Isolation',
      highlight3Desc: 'Your tasks belong exclusively to your Google account in Firestore.',
      connecting: 'Connecting...',
      loginWithGoogle: 'Sign in with Google',
      privacyNote: 'Secure sign-in. We never store passwords.',
    },
    mainLead: {
      kicker: 'Study Day',
      question: 'A calm space designed to answer a single question: what should I prepare next?',
      viewList: 'List',
      viewWeek: 'Week',
      viewMonth: 'Month',
      viewsAria: 'Planner view switcher',
    },
    taskList: {
      overdue: 'Overdue',
      today: 'Today',
      thisWeek: 'This Week',
      later: 'Later',
      completed: 'Completed',
      emptyToday: 'No tasks scheduled for today. You can capture one above.',
    },
    taskRow: {
      markComplete: 'Mark as completed',
      markPending: 'Mark as pending',
      examBadge: 'Exam',
      overdueYesterday: 'Due yesterday',
      overduePrefix: 'Overdue',
      editTooltip: 'Edit task',
      deleteTooltip: 'Delete task',
      confirmDelete: 'Delete this task?',
    },
    quickAdd: {
      typeExam: 'Exam',
      typeAssignment: 'Assignment',
      tooltipExam: 'Create as Exam',
      tooltipAssignment: 'Create as Assignment',
      placeholder: 'What are you studying today? Type and press Add...',
      ariaLabel: 'Quick task title for today',
      courseAriaLabel: 'Select course',
      addBtn: 'Add',
    },
    taskModal: {
      createTitle: 'New Task or Exam',
      editTitle: 'Edit Activity',
      subtitle: 'Pure date academic planning with zero timezone offset',
      typeLabel: 'Activity Type',
      typeAssignment: 'Assignment / Coursework',
      typeExam: 'Exam / Evaluation',
      titleLabel: 'Activity Title',
      titlePlaceholder: 'e.g., Linear Algebra Midterm Exam',
      titleError: 'Title is required (at least 3 characters).',
      courseLabel: 'Course / Subject',
      coursePlaceholder: 'e.g., Calculus II',
      courseError: 'Course is required.',
      priorityLabel: 'Priority',
      priorityLow: 'Low',
      priorityMedium: 'Medium',
      priorityHigh: 'High',
      dueDateLabel: 'Due Date',
      shortcutToday: 'Today',
      shortcutTomorrow: 'Tomorrow',
      shortcut3Days: 'In 3 days',
      shortcut1Week: 'In 1 week',
      timeLabel: 'Time (Optional)',
      hoursLabel: 'Estimated Hours',
      notesLabel: 'Notes or Syllabus',
      notesPlaceholder: 'e.g., Chapters 4 & 5. Bring printed formula sheet.',
      saveChanges: 'Save Changes',
      createTask: 'Create Task',
      closeAria: 'Close modal',
    },
    calendar: {
      prevMonthAria: 'Previous month',
      nextMonthAria: 'Next month',
      prevWeekAria: 'Previous week',
      nextWeekAria: 'Next week',
      todayBtn: 'Today',
      selectedDayTitle: 'Selected Day',
      addForThisDay: '+ Add for this day',
      emptyDayTasks: 'No deadlines scheduled for this day.',
      weekOf: 'Week of',
      addBtn: '+ Add',
      emptyWeekDayTasks: 'No scheduled deadlines',
      pendingCount: 'pending',
    },
    sidebar: {
      nextExam: 'Next Exam',
      daySingular: 'DAY',
      dayPlural: 'DAYS',
      weeklyWorkload: 'Weekly Workload',
      tasksCount: 'tasks',
      subjects: 'Courses',
      viewAll: 'View all',
      filtering: 'Filtering',
    },
    stats: {
      examsTitle: 'Exams',
      examsDesc: 'Scheduled evaluations',
      assignmentsTitle: 'Assignments',
      assignmentsDesc: 'Homework and labs',
      dueTitle: 'Pending',
      dueDescOverdue: 'Attention needed for overdue',
      dueDescAllGood: 'Everything on schedule',
      completedTitle: 'Completed',
      in7Days: 'in 7d',
      late: 'late',
    },
    footer: {
      localFirstDesc: 'Local-First (Dexie IndexedDB)',
      cloudReplicaDesc: 'Cloud Firestore Replica',
      restoreSample: 'Restore sample data',
      signOut: 'Sign out',
      confirmRestore: 'Restore sample notes and tasks?',
    },
    toasts: {
      backupSynced: 'Backup snapshot synced with Firebase',
      googleSignedIn: 'Signed in with Google on Firebase',
      googleSignedOut: 'Google session signed out',
      taskSaved: 'Saved',
      calendarExported: 'Academic calendar exported (.ICS)',
      samplesRestored: 'Sample data restored',
    },
    tour: {
      guideBtn: 'Tour',
      guideTooltip: 'Take an interactive tour of StudyPlanner',
      stepOf: 'Step {current} of {total}',
      skip: 'Skip tour',
      next: 'Next',
      prev: 'Previous',
      finish: 'Start studying!',
      welcome: {
        badge: 'Welcome',
        title: 'Welcome to StudyPlanner!',
        desc: 'Your academic notebook built with Local-First architecture. Everything opens instantly on your device and replicates to Google Cloud in the background without lag.',
      },
      quickAdd: {
        badge: 'Quick Add',
        title: 'Fast capture bar',
        desc: 'Type your assignment or exam title and press Enter to save immediately. Toggle between assignment and exam with a single click.',
      },
      views: {
        badge: 'Notebook Views',
        title: 'List, Week & Month',
        desc: 'Organize your schedule your way: view pending tasks grouped by urgency, review your current week, or inspect the full monthly calendar.',
      },
      sidebar: {
        badge: 'Editorial Panel',
        title: 'Upcoming exam & courses',
        desc: 'Keep track of your countdown to the nearest exam, evaluate 7-day workload distribution, and filter tasks by course.',
      },
      sync: {
        badge: 'Cloud Sync',
        title: 'Cloud status & backups',
        desc: 'Your entries are saved in Dexie IndexedDB instantly and backed up to Firebase Firestore when connected. You can also export your schedule to .ICS.',
      },
      lang: {
        badge: 'Bilingual',
        title: 'Spanish & English',
        desc: 'Switch between Spanish and English anytime with seamless persistence across your visits.',
      },
    },
  },
};
