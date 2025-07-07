import { Team as TeamModel, Match, News, Media } from '@/types/models';
import { Team as FrontendTeam } from '@/types/team';
import { Player as FrontendPlayer } from '@/types/models';
import { Coach } from '@/types/coach';

const API_BASE_URL = 'http://192.168.68.102:8080/api';

// Helper function for API calls
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorMessage
    });
    throw new Error(errorMessage);
  }

  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Failed to parse server response');
  }
};

// Default headers for all API requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': window.location.origin,
  'X-Requested-With': 'XMLHttpRequest'
};

// Map backend Team model to frontend Team type
const mapBackendTeamToFrontend = (backendTeam: TeamModel): FrontendTeam => {
  return {
    id: backendTeam.id,
    name: backendTeam.name,
    shortName: backendTeam.shortName || '',
    logo: backendTeam.logo || '',
    primaryColor: backendTeam.primaryColor || '#000000',
    secondaryColor: backendTeam.secondaryColor || '#ffffff',
    founded: backendTeam.foundedYear?.toString() || '',
    city: backendTeam.city || '',
    country: backendTeam.country || '',
    website: backendTeam.website || '',
    description: backendTeam.description || '',
    venue: backendTeam.stadium || '',
    created_at: (backendTeam as any).created_at,
    updated_at: (backendTeam as any).updated_at
  };
};

// Local type definitions for backend API
interface BackendPlayerModel {
  id: string;
  team_id: string;
  team_name: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  height: number;
  weight: number;
  photo: string;
  stats: {
    games: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  created_at?: string;
  updated_at?: string;
}

// Map backend Player model to frontend Player type
const mapBackendPlayerToFrontend = (backendPlayer: BackendPlayerModel): FrontendPlayer => {
  return {
    id: backendPlayer.id,
    team_id: backendPlayer.team_id,
    team_name: backendPlayer.team_name || '',
    name: backendPlayer.name,
    number: backendPlayer.number || 0,
    position: backendPlayer.position,
    nationality: backendPlayer.nationality || '',
    age: backendPlayer.age || 0,
    height: backendPlayer.height || 0,
    weight: backendPlayer.weight || 0,
    photo: backendPlayer.photo || '',
    stats: {
      games: backendPlayer.stats.games,
      goals: backendPlayer.stats.goals,
      assists: backendPlayer.stats.assists,
      yellowCards: backendPlayer.stats.yellowCards,
      redCards: backendPlayer.stats.redCards
    },
    created_at: backendPlayer.created_at,
    updated_at: backendPlayer.updated_at
  };
};

// Teams API
export const teamsApi = {
  getAll: async (): Promise<FrontendTeam[]> => {
    try {
      console.log('Fetching teams from:', `${API_BASE_URL}/teams`);
      const res = await fetch(`${API_BASE_URL}/teams`, {
        method: 'GET',
        headers: defaultHeaders
      });
      const backendTeams: TeamModel[] = await handleResponse(res);
      return backendTeams.map(mapBackendTeamToFrontend);
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams. Please check if the server is running.');
    }
  },
  
  getById: async (id: string): Promise<FrontendTeam> => {
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${id}`, {
        headers: defaultHeaders
      });
      const backendTeam: TeamModel = await handleResponse(res);
      return mapBackendTeamToFrontend(backendTeam);
    } catch (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team. Please check if the server is running.');
    }
  },
  
  create: async (team: Omit<FrontendTeam, 'id'>): Promise<FrontendTeam> => {
    const backendTeamModel: Omit<TeamModel, 'id'> = {
      ...(team as any)
    };
    try {
      const res = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(backendTeamModel)
      });
      const backendResponse: TeamModel = await handleResponse(res);
      return mapBackendTeamToFrontend(backendResponse);
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team. Please check if the server is running.');
    }
  },
  
  update: async (id: string, team: Partial<Omit<FrontendTeam, 'id'>>): Promise<FrontendTeam> => {
    const backendTeamModel: Partial<Omit<TeamModel, 'id'>> = {
      ...(team as any)
    };
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(backendTeamModel)
      });
      const backendResponse: TeamModel = await handleResponse(res);
      return mapBackendTeamToFrontend(backendResponse);
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team. Please check if the server is running.');
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders
      });
      return handleResponse(res);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team. Please check if the server is running.');
    }
  }
};

// Players API
export const playersApi = {
  getByTeam: async (teamId: string): Promise<FrontendPlayer[]> => {
    try {
      console.log('API: Fetching players for team:', teamId);
      const url = `${API_BASE_URL}/players${teamId ? `?team_id=${teamId}` : ''}`;
      console.log('API: Request URL:', url);
      
      const res = await fetch(url, {
        headers: defaultHeaders
      });
      
      console.log('API: Response status:', res.status);
      const backendPlayers: BackendPlayerModel[] = await handleResponse(res);
      console.log('API: Received players from backend:', backendPlayers);
      
      const mappedPlayers = backendPlayers.map(mapBackendPlayerToFrontend);
      console.log('API: Mapped players:', mappedPlayers);
      
      return mappedPlayers;
    } catch (error) {
      console.error('API: Error fetching players:', error);
      throw new Error('Failed to fetch players. Please check if the server is running.');
    }
  },

  create: async (player: Omit<FrontendPlayer, 'id'>): Promise<FrontendPlayer> => {
    console.log('Creating player with data:', player);
    const backendPlayerModel: Omit<BackendPlayerModel, 'id'> = {
      name: player.name,
      position: player.position,
      number: player.number,
      team_id: player.team_id,
      team_name: player.team_name,
      photo: player.photo,
      nationality: player.nationality,
      age: player.age,
      height: player.height,
      weight: player.weight,
      stats: {
        games: player.stats?.games || 0,
        goals: player.stats?.goals || 0,
        assists: player.stats?.assists || 0,
        yellowCards: player.stats?.yellowCards || 0,
        redCards: player.stats?.redCards || 0
      }
    };

    console.log('Sending to backend:', backendPlayerModel);

    try {
      const res = await fetch(`${API_BASE_URL}/players`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(backendPlayerModel)
      });
      const backendResponse: BackendPlayerModel = await handleResponse(res);
      console.log('Received response from backend:', backendResponse);
      return mapBackendPlayerToFrontend(backendResponse);
    } catch (error) {
      console.error('Error creating player:', error);
      throw new Error('Failed to create player. Please check if the server is running.');
    }
  },

  update: async (id: string, player: Partial<Omit<FrontendPlayer, 'id'>>): Promise<FrontendPlayer> => {
    console.log('Updating player with ID:', id, 'and data:', player);
    const backendPlayerModel: Partial<Omit<BackendPlayerModel, 'id'>> = {
      name: player.name,
      position: player.position,
      number: player.number,
      team_id: player.team_id,
      team_name: player.team_name,
      photo: player.photo,
      nationality: player.nationality,
      age: player.age,
      height: player.height,
      weight: player.weight,
      stats: player.stats ? {
        games: player.stats.games || 0,
        goals: player.stats.goals || 0,
        assists: player.stats.assists || 0,
        yellowCards: player.stats.yellowCards || 0,
        redCards: player.stats.redCards || 0
      } : undefined
    };

    console.log('Sending to backend:', backendPlayerModel);

    try {
      const res = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(backendPlayerModel)
      });
      const backendResponse: BackendPlayerModel = await handleResponse(res);
      console.log('Received response from backend:', backendResponse);
      return mapBackendPlayerToFrontend(backendResponse);
    } catch (error) {
      console.error('Error updating player:', error);
      throw new Error('Failed to update player. Please check if the server is running.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders
      });
      return handleResponse(res);
    } catch (error) {
      console.error('Error deleting player:', error);
      throw new Error('Failed to delete player. Please check if the server is running.');
    }
  }
};

// Matches API
export const matchesApi = {
  getAll: async (): Promise<Match[]> => {
    try {
    const res = await fetch(`${API_BASE_URL}/matches`, {
      headers: defaultHeaders
    });
      return await handleResponse(res);
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw new Error('Failed to fetch matches. Please check if the server is running.');
    }
  },
  
  getById: async (id: string): Promise<Match> => {
    try {
    const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
      headers: defaultHeaders
    });
      return await handleResponse(res);
    } catch (error) {
      console.error('Error fetching match:', error);
      throw new Error('Failed to fetch match. Please check if the server is running.');
    }
  },
  
  create: async (match: Omit<Match, 'id'>): Promise<Match> => {
    try {
    const res = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: defaultHeaders,
        body: JSON.stringify(match)
      });
      return await handleResponse(res);
    } catch (error) {
      console.error('Error creating match:', error);
      throw new Error('Failed to create match. Please check if the server is running.');
    }
  },
  
  update: async (id: string, match: Partial<Omit<Match, 'id'>>): Promise<Match> => {
    try {
    const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
        body: JSON.stringify(match)
      });
      return await handleResponse(res);
    } catch (error) {
      console.error('Error updating match:', error);
      throw new Error('Failed to update match. Please check if the server is running.');
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders
    });
      await handleResponse(res);
    } catch (error) {
      console.error('Error deleting match:', error);
      throw new Error('Failed to delete match. Please check if the server is running.');
    }
  }
};

// News API
export const newsApi = {
  getAll: async (): Promise<News[]> => {
    const res = await fetch(`${API_BASE_URL}/news`, {
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },
  
  getById: async (id: string): Promise<News> => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to fetch news item');
    return res.json();
  },
  
  create: async (news: Omit<News, 'id'>): Promise<News> => {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(news)
    });
    if (!res.ok) throw new Error('Failed to create news');
    return res.json();
  },
  
  update: async (id: string, news: Partial<Omit<News, 'id'>>): Promise<News> => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(news)
    });
    if (!res.ok) throw new Error('Failed to update news');
    return res.json();
  },
  
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to delete news');
  }
};

// Media API
export const mediaApi = {
  getAll: async (): Promise<Media[]> => {
    const res = await fetch(`${API_BASE_URL}/media`, {
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },
  
  getById: async (id: string): Promise<Media> => {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to fetch media item');
    return res.json();
  },
  
  create: async (media: Omit<Media, 'id'>): Promise<Media> => {
    const res = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(media)
    });
    if (!res.ok) throw new Error('Failed to create media');
    return res.json();
  },
  
  update: async (id: string, media: Partial<Omit<Media, 'id'>>): Promise<Media> => {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(media)
    });
    if (!res.ok) throw new Error('Failed to update media');
    return res.json();
  },
  
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error('Failed to delete media');
  }
};

// Coaches API
export const getCoaches = async (): Promise<Coach[]> => {
  const res = await fetch(`${API_BASE_URL}/coaches`, {
    headers: defaultHeaders
  });
  if (!res.ok) {
    throw new Error('Failed to fetch coaches');
  }
  return res.json();
};

export const getCoach = async (id: string): Promise<Coach> => {
  const res = await fetch(`${API_BASE_URL}/coaches/${id}`, {
    headers: defaultHeaders
  });
  if (!res.ok) {
    throw new Error('Failed to fetch coach');
  }
  return res.json();
};

export const createCoach = async (coach: Omit<Coach, 'id'>): Promise<Coach> => {
  const res = await fetch(`${API_BASE_URL}/coaches`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(coach),
  });
  if (!res.ok) {
    throw new Error('Failed to create coach');
  }
  return res.json();
};

export const updateCoach = async (id: string, coach: Partial<Coach>): Promise<Coach> => {
  const res = await fetch(`${API_BASE_URL}/coaches/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(coach),
  });
  if (!res.ok) {
    throw new Error('Failed to update coach');
  }
  return res.json();
};

export const deleteCoach = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/coaches/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders
  });
  if (!res.ok) {
    throw new Error('Failed to delete coach');
  }
};

// Teams API
export const getTeams = async (): Promise<TeamModel[]> => {
  const res = await fetch(`${API_BASE_URL}/teams`, {
    headers: defaultHeaders
  });
  if (!res.ok) {
    throw new Error('Failed to fetch teams');
  }
  return res.json();
}; 