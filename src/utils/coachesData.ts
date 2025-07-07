
import { Coach } from '@/types/coach';

// Initial sample coaches data
const initialCoaches: Coach[] = [
  {
    id: 'coach1',
    name: 'Александр Иванов',
    role: 'Главный тренер',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3',
    since: '2018',
    experience: 15,
    biography: 'Александр Иванов - опытный тренер с богатым опытом в профессиональном футболе. Под его руководством команда добилась значительных успехов на региональных соревнованиях.',
    teamId: 'gudauta'
  },
  {
    id: 'coach2',
    name: 'Сергей Петров',
    role: 'Тренер вратарей',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3',
    since: '2019',
    experience: 12,
    biography: 'Сергей Петров специализируется на подготовке вратарей. Ранее выступал за профессиональные клубы России и имеет богатый опыт работы с молодыми спортсменами.',
    teamId: 'gudauta'
  },
  {
    id: 'coach3',
    name: 'Дмитрий Александрович Сидоров',
    role: 'Руководитель спортивной школы',
    image: 'https://images.unsplash.com/photo-1571512599940-7dfed49b7e00?ixlib=rb-4.0.3',
    since: '2015',
    experience: 18,
    biography: 'Дмитрий Александрович руководит спортивной школой Гудаута с момента её основания. Под его руководством была разработана уникальная методика подготовки молодых футболистов.',
    teamId: 'gudauta-school'
  },
  {
    id: 'coach4',
    name: 'Андрей Кузнецов',
    role: 'Тренер юношеских команд',
    image: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-4.0.3',
    since: '2020',
    experience: 8,
    biography: 'Андрей Кузнецов работает с юношескими командами различных возрастных категорий. Специализируется на начальной подготовке и развитии основных футбольных навыков.',
    teamId: 'gudauta-school'
  }
];

// Try to load coaches from localStorage, or use initialCoaches if not found
const loadCoaches = (): Coach[] => {
  try {
    const savedCoaches = localStorage.getItem('coaches');
    if (savedCoaches) {
      return JSON.parse(savedCoaches);
    }
  } catch (error) {
    console.error('Failed to load coaches from localStorage:', error);
  }
  
  // Save initial coaches to localStorage on first load
  try {
    localStorage.setItem('coaches', JSON.stringify(initialCoaches));
  } catch (error) {
    console.error('Failed to save initial coaches to localStorage:', error);
  }
  
  return initialCoaches;
};

// Initialize coaches array
let coaches: Coach[] = loadCoaches();

// Save coaches to localStorage
const saveCoaches = () => {
  try {
    localStorage.setItem('coaches', JSON.stringify(coaches));
  } catch (error) {
    console.error('Failed to save coaches to localStorage:', error);
  }
};

// Get all coaches
export const getCoachesData = (): Coach[] => {
  return [...coaches];
};

// Get coaches for a specific team
export const getCoachesByTeam = (teamId: string): Coach[] => {
  return coaches.filter(coach => coach.teamId === teamId);
};

// Get a specific coach by ID
export const getCoachById = (id: string): Coach | undefined => {
  return coaches.find(coach => coach.id === id);
};

// Update a coach
export const updateCoach = (updatedCoach: Coach): void => {
  coaches = coaches.map(coach => 
    coach.id === updatedCoach.id ? updatedCoach : coach
  );
  
  // Save changes to localStorage
  saveCoaches();
};

// Add a new coach
export const createCoach = (newCoach: Coach): void => {
  coaches.push(newCoach);
  
  // Save changes to localStorage
  saveCoaches();
};

// Delete a coach
export const deleteCoach = (id: string): void => {
  coaches = coaches.filter(coach => coach.id !== id);
  
  // Save changes to localStorage
  saveCoaches();
};
