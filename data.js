const workouts = [
  {
    day: '📅 Lunes — Core + Caderas',
    exercises: [
      { name: 'Cat-Cow',          sets: '2×10',   video: 'https://www.youtube.com/watch?v=kqnua4rHVVA' },
      { name: 'Pelvic Tilts',     sets: '2×15',   video: 'https://www.youtube.com/watch?v=44ScXWFaVBs' },
      { name: 'Dead Bug',         sets: '2×10',   video: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws' },
      { name: '90/90 Switches',   sets: '3×10',   video: 'https://www.youtube.com/watch?v=2uWQ4YxU4VQ' },
      { name: 'Deep Squat Hold',  sets: '3×30 s', video: 'https://www.youtube.com/watch?v=ZFCDMXtKAhA' },
      { name: 'Cossack Squat',    sets: '3×8',    video: 'https://www.youtube.com/watch?v=tpczTeSkHz0' },
      { name: 'Hollow Hold',      sets: '3×20 s', video: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' },
    ],
  },
  {
    day: '📅 Martes — Natación + Hombro',
    exercises: [
      { name: 'Thoracic Extension',  sets: '2 min', video: 'https://www.youtube.com/watch?v=SdQhQZlO2ys' },
      { name: 'Wall Slides',         sets: '3×10',  video: 'https://www.youtube.com/watch?v=ywYi4rBhRBQ' },
      { name: 'External Rotations',  sets: '3×15',  video: 'https://www.youtube.com/watch?v=5pR0egEr8L0' },
      { name: 'Scapular Push-ups',   sets: '3×12',  video: 'https://www.youtube.com/watch?v=1v9e8PdmqEI' },
    ],
  },
  {
    day: '📅 Miércoles — Hombros + Postura',
    exercises: [
      { name: 'Band Pull Aparts', sets: '3×15', video: 'https://www.youtube.com/watch?v=JObYtU7Y7ag' },
      { name: 'Shoulder CARs',    sets: '2×5',  video: 'https://www.youtube.com/watch?v=HiCnRk1_z5Q' },
      { name: 'Open Books',       sets: '2×10', video: 'https://www.youtube.com/watch?v=k0q1t7lZb6M' },
      { name: 'Bird Dog',         sets: '3×10', video: 'https://www.youtube.com/watch?v=wiFNA3sqjCA' },
    ],
  },
  {
    day: '📅 Jueves — Tenis + Recovery',
    exercises: [
      { name: 'World Greatest Stretch', sets: '2×5',   video: 'https://www.youtube.com/watch?v=oVOnXIiPgM8' },
      { name: 'Deep Squat Hold',        sets: '3×30 s', video: 'https://www.youtube.com/watch?v=ZFCDMXtKAhA' },
    ],
  },
  {
    day: '📅 Viernes — Core + Flexibilidad',
    exercises: [
      { name: 'Jefferson Curl',      sets: '3×8',  video: 'https://www.youtube.com/watch?v=y_APeWo643w' },
      { name: 'Frog Stretch',        sets: '2 min', video: 'https://www.youtube.com/watch?v=0Z9J5WogtWo' },
      { name: 'Compression Pulses',  sets: '3×15', video: 'https://www.youtube.com/watch?v=Qk7b0H0sQuc' },
    ],
  },
  {
    day: '📅 Sábado — Natación + Movilidad',
    exercises: [
      { name: 'Bear Crawl',        sets: '2×20 m', video: 'https://www.youtube.com/watch?v=2-4r6Z1N0nI' },
      { name: 'Crab Reach',        sets: '2×10',   video: 'https://www.youtube.com/watch?v=4BOTvaRaDjI' },
      { name: 'Down Dog to Cobra', sets: '2×10',   video: 'https://www.youtube.com/watch?v=8lDc4Ri9zAQ' },
    ],
  },
  {
    day: '😴 Domingo — Descanso activo',
    rest: true,
    tip: 'Camina, estira suavemente o haz respiración diafragmática.',
  },
];
