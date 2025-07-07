
import { Team } from '@/types/team';

// Initial teams data
const initialTeams: Team[] = [
  {
    id: 'gudauta',
    name: 'ФК Гудаута',
    shortName: 'Гудаута',
    logo: '/lovable-uploads/9fd0afcb-f7b9-4726-ad0c-9637c412c9e9.png',
    primaryColor: '#2e7d32',
    secondaryColor: '#ffeb3b',
    description: 'Команда «Гудаута» Новосибирск создана в 2008 г.р. Наша команда успешно участвует в региональных и городских турнирах, воспитывая молодых футболистов и показывая высокий уровень игры.',
    foundedYear: 2008,
    stadium: 'Стадион имени А.П. Соколова',
    achievements: [
      '«Бронзовый» призёр Первенства России среди любительских команд 3 дивизиона. Зона «Сибирь». 1 лига',
      'Чемпион города Новосибирска',
      'Обладатель Кубка города Новосибирска',
      'Обладатель Кубка Федерации футбола',
      'Обладатель Кубка Победы',
      'Неоднократный призёр Чемпионатов города Новосибирска и Новосибирской области'
    ],
    coach: 'Александр Иванов',
    address: 'г. Новосибирск, ул. Спортивная, 15',
    socialLinks: {
      website: 'https://fcgudauta.example.com',
      instagram: 'https://instagram.com/fcgudauta',
      facebook: 'https://facebook.com/fcgudauta'
    },
    backgroundImage: '/lovable-uploads/70205a26-8439-4152-8d6c-5c0c4d23ec34.png'
  },
  {
    id: 'gudauta-school',
    name: 'СШ Гудаута',
    shortName: 'СШ Гудаута',
    logo: '/lovable-uploads/9fd0afcb-f7b9-4726-ad0c-9637c412c9e9.png',
    primaryColor: '#2e7d32',
    secondaryColor: '#ffeb3b',
    description: 'Спортивная школа Гудаута - кузница молодых футбольных талантов, где юные спортсмены получают качественное футбольное образование. Наша миссия - выявлять и развивать молодых футболистов, прививая им не только спортивные навыки, но и важные жизненные ценности: трудолюбие, командный дух и стремление к самосовершенствованию.',
    foundedYear: 2008,
    stadium: 'Тренировочный центр "Молодёжный"',
    achievements: [
      'Победитель юношеского первенства 2022',
      'Лауреат премии "Лучшая спортивная школа" 2021',
      'Участник международного юношеского турнира 2023'
    ],
    coach: 'Дмитрий Александрович Сидоров',
    address: 'г. Новосибирск, ул. Молодёжная, 8',
    socialLinks: {
      website: 'https://schoolgudauta.example.com',
      instagram: 'https://instagram.com/schoolgudauta'
    },
    backgroundImage: '/lovable-uploads/70205a26-8439-4152-8d6c-5c0c4d23ec34.png'
  }
];

// Try to load teams from localStorage, or use initialTeams if not found
const loadTeams = (): Team[] => {
  try {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      return JSON.parse(savedTeams);
    }
  } catch (error) {
    console.error('Failed to load teams from localStorage:', error);
  }
  
  // Save initial teams to localStorage on first load
  try {
    localStorage.setItem('teams', JSON.stringify(initialTeams));
  } catch (error) {
    console.error('Failed to save initial teams to localStorage:', error);
  }
  
  return initialTeams;
};

// Initialize teams array
let teams: Team[] = loadTeams();

// Save teams to localStorage
const saveTeams = () => {
  try {
    localStorage.setItem('teams', JSON.stringify(teams));
  } catch (error) {
    console.error('Failed to save teams to localStorage:', error);
  }
};

// Get all teams
export const getTeamsData = (): Team[] => {
  return [...teams];
};

// Get a specific team by ID
export const getTeamById = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};

// Update a team
export const updateTeam = (updatedTeam: Team): void => {
  teams = teams.map(team => 
    team.id === updatedTeam.id ? updatedTeam : team
  );
  
  // Save changes to localStorage
  saveTeams();
};

// Add a new team
export const addTeam = (newTeam: Team): void => {
  teams.push(newTeam);
  
  // Save changes to localStorage
  saveTeams();
};

// Delete a team
export const deleteTeam = (id: string): void => {
  teams = teams.filter(team => team.id !== id);
  
  // Save changes to localStorage
  saveTeams();
};
