
import { toast } from '@/components/ui/use-toast';

// Define interfaces for the API responses
export interface Team {
  position: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorer {
  position: number;
  name: string;
  team: string;
  goals: number;
}

export interface Warning {
  position: number;
  name: string;
  team: string;
  warnings: number;
}

export interface Expulsion {
  position: number;
  name: string;
  team: string;
  expulsions: number;
}

export interface TournamentData {
  title: string;
  season: string;
  lastUpdated: string;
  teams: Team[];
  topScorers: TopScorer[];
  warnings: Warning[];
  expulsions: Expulsion[];
}

export interface Tournament {
  id: string;
  title: string;
  type: string;
  season: string;
  teams: number;
  source: string;
  featured: boolean;
}

// Функция для получения данных с сайта МОО СФФ "Сибирь"
export const getSffSiberiaData = async (tournamentId: string): Promise<TournamentData> => {
  console.log(`Fetching data from SFF-Siberia for tournament ID: ${tournamentId}`);
  
  // В реальном приложении здесь был бы API-запрос к прокси-серверу, который парсит данные с sff-siberia.ru
  // Для демонстрации используем моковые данные с указанием реального источника
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Кубок МОО СФФ «Сибирь» сезона 2024 года",
        season: "2024",
        lastUpdated: new Date().toLocaleDateString('ru-RU'),
        teams: [
          { position: 1, name: "«Енисей» (Красноярск)", played: 7, won: 6, drawn: 1, lost: 0, goalsFor: 18, goalsAgainst: 4, goalDifference: 14, points: 19 },
          { position: 2, name: "«Бурятия» (Улан-Удэ)", played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 15, goalsAgainst: 8, goalDifference: 7, points: 16 },
          { position: 3, name: "«Распадская» (Междуреченск)", played: 7, won: 4, drawn: 0, lost: 3, goalsFor: 9, goalsAgainst: 5, goalDifference: 4, points: 12 },
          { position: 4, name: "«Темп» (Барнаул)", played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 11, goalsAgainst: 8, goalDifference: 3, points: 11 },
          { position: 5, name: "«Рассвет» (Красноярск)", played: 7, won: 2, drawn: 3, lost: 2, goalsFor: 9, goalsAgainst: 7, goalDifference: 2, points: 9 },
          { position: 6, name: "«Енисей-М» (Красноярск)", played: 7, won: 1, drawn: 3, lost: 3, goalsFor: 7, goalsAgainst: 9, goalDifference: -2, points: 6 },
          { position: 7, name: "«Байкал» (Иркутск)", played: 7, won: 1, drawn: 0, lost: 6, goalsFor: 5, goalsAgainst: 16, goalDifference: -11, points: 3 },
          { position: 8, name: "«Новокузнецк» (Новокузнецк)", played: 7, won: 0, drawn: 2, lost: 5, goalsFor: 4, goalsAgainst: 15, goalDifference: -11, points: 2 },
        ],
        topScorers: [
          { position: 1, name: "Исаев Максим", team: "Енисей", goals: 6 },
          { position: 2, name: "Рыбованов Алексей", team: "Бурятия", goals: 5 },
          { position: 3, name: "Бекеровский Андрей", team: "Темп", goals: 4 },
          { position: 4, name: "Винтер Даниил", team: "Рассвет", goals: 3 },
          { position: 5, name: "Савченко Борис", team: "Енисей-М", goals: 3 },
        ],
        warnings: [
          { position: 1, name: "Рыбованов Алексей", team: "Бурятия", warnings: 4 },
          { position: 2, name: "Голополобов Евгений", team: "Распадская", warnings: 4 },
          { position: 3, name: "Чуриков Даниил", team: "Енисей-М", warnings: 3 },
          { position: 4, name: "Жариков Роман", team: "Темп", warnings: 2 },
          { position: 5, name: "Голышев Александр", team: "Новокузнецк", warnings: 2 },
        ],
        expulsions: [
          { position: 1, name: "Абдуллаев Степан", team: "Енисей-М", expulsions: 1 },
          { position: 2, name: "Воропаев Кирилл", team: "Распадская", expulsions: 1 },
          { position: 3, name: "Яковлев Егор", team: "Темп", expulsions: 1 },
          { position: 4, name: "Пальму Ян", team: "Байкал", expulsions: 1 },
          { position: 5, name: "Шориков Даниил", team: "Новокузнецк", expulsions: 1 },
        ]
      });
    }, 1000);
  });
};

// Функция для получения данных с сайта ФФНСО
export const getFfnsoData = async (tournamentId: string): Promise<TournamentData> => {
  console.log(`Fetching data from FFNSO for tournament ID: ${tournamentId}`);
  
  // В реальном приложении здесь был бы API-запрос к прокси-серверу, который парсит данные с ffnso.ru
  // Для демонстрации используем моковые данные с указанием реального источника
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Чемпионат города Новосибирска",
        season: "2024",
        lastUpdated: new Date().toLocaleDateString('ru-RU'),
        teams: [
          { position: 1, name: "«Спартак» (Новосибирск)", played: 8, won: 7, drawn: 1, lost: 0, goalsFor: 22, goalsAgainst: 5, goalDifference: 17, points: 22 },
          { position: 2, name: "«Локомотив» (Новосибирск)", played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 18, goalsAgainst: 7, goalDifference: 11, points: 18 },
          { position: 3, name: "«НГТУ» (Новосибирск)", played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 15, goalsAgainst: 8, goalDifference: 7, points: 17 },
          { position: 4, name: "«Сибирь-М» (Новосибирск)", played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 14, goalsAgainst: 10, goalDifference: 4, points: 13 },
          { position: 5, name: "«Заря» (Новосибирск)", played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 12, goalsAgainst: 11, goalDifference: 1, points: 11 },
          { position: 6, name: "«Академия» (Новосибирск)", played: 8, won: 3, drawn: 1, lost: 4, goalsFor: 10, goalsAgainst: 13, goalDifference: -3, points: 10 },
          { position: 7, name: "«Динамо» (Новосибирск)", played: 8, won: 2, drawn: 1, lost: 5, goalsFor: 8, goalsAgainst: 15, goalDifference: -7, points: 7 },
          { position: 8, name: "«Металлург» (Новосибирск)", played: 8, won: 0, drawn: 2, lost: 6, goalsFor: 4, goalsAgainst: 19, goalDifference: -15, points: 2 },
          { position: 9, name: "«Новосибирск-М» (Новосибирск)", played: 8, won: 0, drawn: 0, lost: 8, goalsFor: 3, goalsAgainst: 18, goalDifference: -15, points: 0 },
        ],
        topScorers: [
          { position: 1, name: "Смирнов Илья", team: "Спартак", goals: 8 },
          { position: 2, name: "Кузнецов Дмитрий", team: "Локомотив", goals: 7 },
          { position: 3, name: "Соколов Артем", team: "НГТУ", goals: 6 },
          { position: 4, name: "Новиков Кирилл", team: "Сибирь-М", goals: 5 },
          { position: 5, name: "Морозов Александр", team: "Заря", goals: 4 },
        ],
        warnings: [
          { position: 1, name: "Попов Сергей", team: "Локомотив", warnings: 5 },
          { position: 2, name: "Лебедев Андрей", team: "Динамо", warnings: 4 },
          { position: 3, name: "Козлов Максим", team: "Металлург", warnings: 4 },
          { position: 4, name: "Новиков Кирилл", team: "Сибирь-М", warnings: 3 },
          { position: 5, name: "Смирнов Илья", team: "Спартак", warnings: 3 },
        ],
        expulsions: [
          { position: 1, name: "Козлов Максим", team: "Металлург", expulsions: 2 },
          { position: 2, name: "Кузнецов Дмитрий", team: "Локомотив", expulsions: 1 },
          { position: 3, name: "Соколов Артем", team: "НГТУ", expulsions: 1 },
          { position: 4, name: "Лебедев Андрей", team: "Динамо", expulsions: 1 },
          { position: 5, name: "Новиков Кирилл", team: "Сибирь-М", expulsions: 1 },
        ]
      });
    }, 1000);
  });
};

// This would be a real API call in production
export const getTournamentTable = async (tournamentId: string, source: string): Promise<TournamentData> => {
  console.log(`Fetching tournament data for ID: ${tournamentId} from source: ${source}`);
  
  try {
    if (source === "sff-siberia.ru") {
      return await getSffSiberiaData(tournamentId);
    } else if (source === "ffnso.ru") {
      return await getFfnsoData(tournamentId);
    } else {
      throw new Error(`Unknown data source: ${source}`);
    }
  } catch (error) {
    console.error("Failed to fetch tournament data:", error);
    throw error;
  }
};

export const getTournamentsList = async (): Promise<Tournament[]> => {
  console.log("Fetching tournaments list");
  
  // В реальном приложении здесь был бы API-запрос
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      // This is placeholder data - in a real app, this would come from the API
      resolve([
        {
          id: "siberia-cup-2024",
          title: "Кубок МОО СФФ «Сибирь» 2024",
          type: "Кубковый турнир",
          season: "2024",
          teams: 16,
          source: "sff-siberia.ru",
          featured: true,
        },
        {
          id: "siberia-league-2024",
          title: "Первенство МОО СФФ «Сибирь»",
          type: "Регулярный чемпионат",
          season: "2024",
          teams: 8,
          source: "sff-siberia.ru",
          featured: false,
        },
        {
          id: "novosibirsk-championship-2024",
          title: "Чемпионат города Новосибирска",
          type: "Городской чемпионат",
          season: "2024",
          teams: 12,
          source: "ffnso.ru",
          featured: true,
        },
        {
          id: "novosibirsk-cup-2024",
          title: "Кубок города Новосибирска",
          type: "Кубковый турнир",
          season: "2024",
          teams: 16,
          source: "ffnso.ru",
          featured: false,
        },
        {
          id: "novosibirsk-region-cup-2024",
          title: "Кубок Новосибирской области",
          type: "Региональный кубок",
          season: "2024",
          teams: 18,
          source: "ffnso.ru",
          featured: false,
        },
      ]);
    }, 1000);
  });
};

// Функция для получения данных турнира
export const fetchTournamentData = async (tournamentId: string): Promise<TournamentData> => {
  console.log(`Fetching data for tournament ID: ${tournamentId}`);
  
  // Определяем источник данных по ID турнира
  let source = "sff-siberia.ru";
  if (["novosibirsk-championship-2024", "novosibirsk-cup-2024", "novosibirsk-region-cup-2024"].includes(tournamentId)) {
    source = "ffnso.ru";
  }
  
  try {
    const data = await getTournamentTable(tournamentId, source);
    return data;
  } catch (error) {
    console.error("Error fetching tournament data:", error);
    toast({
      variant: "destructive",
      title: "Ошибка загрузки",
      description: "Не удалось загрузить данные турнира",
    });
    throw error;
  }
};
