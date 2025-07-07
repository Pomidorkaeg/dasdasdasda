import { Team, Player, Match, News, Media, Training } from '@/types/models';
import { teamsApi, playersApi, matchesApi, newsApi, getCoaches, getCoach, createCoach, updateCoach, deleteCoach } from '@/api/api';
import { Coach } from '@/types/coach';

class DatabaseService {
  // Teams
  async getTeams(): Promise<Team[]> {
    return teamsApi.getAll();
  }

  async getTeamById(id: string): Promise<Team> {
    return teamsApi.getById(id);
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    return teamsApi.create(team);
  }

  async updateTeam(id: string, team: Partial<Omit<Team, 'id'>>): Promise<Team> {
    return teamsApi.update(id, team);
  }

  async deleteTeam(id: string): Promise<void> {
    return teamsApi.delete(id);
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return playersApi.getByTeam('');
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return playersApi.getByTeam(teamId);
  }

  async createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
    return playersApi.create(player);
  }

  async updatePlayer(id: string, player: Partial<Omit<Player, 'id'>>): Promise<Player> {
    return playersApi.update(id, player);
  }

  async deletePlayer(id: string): Promise<void> {
    return playersApi.delete(id);
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    return matchesApi.getAll();
  }

  async getMatchById(id: string): Promise<Match> {
    return matchesApi.getById(id);
  }

  async createMatch(match: Omit<Match, 'id'>): Promise<Match> {
    return matchesApi.create(match);
  }

  async updateMatch(id: string, match: Partial<Omit<Match, 'id'>>): Promise<Match> {
    return matchesApi.update(id, match);
  }

  async deleteMatch(id: string): Promise<void> {
    return matchesApi.delete(id);
  }

  // News
  async getNews(): Promise<News[]> {
    return newsApi.getAll();
  }

  async getNewsItem(id: string): Promise<News | null> {
    try {
      return await newsApi.getById(id);
    } catch (error) {
      console.error('Error getting news item:', error);
      return null;
    }
  }

  async createNews(news: Omit<News, 'id'>): Promise<News> {
    return newsApi.create(news);
  }

  async updateNews(id: string, news: Partial<Omit<News, 'id'>>): Promise<News> {
    return newsApi.update(id, news);
  }

  async deleteNews(id: string): Promise<void> {
    return newsApi.delete(id);
  }

  // Media
  async getMedia(): Promise<Media[]> {
    const res = await fetch('http://192.168.68.102:8080/api/media');
    return res.json();
  }

  async getMediaItem(id: string): Promise<Media | null> {
    try {
      const res = await fetch(`http://192.168.68.102:8080/api/media/${id}`);
      return res.json();
    } catch (error) {
      console.error('Error getting media item:', error);
      return null;
    }
  }

  async createMedia(media: Omit<Media, 'id'>): Promise<Media> {
    const res = await fetch('http://192.168.68.102:8080/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media)
    });
    return res.json();
  }

  async updateMedia(id: string, media: Partial<Omit<Media, 'id'>>): Promise<Media> {
    const res = await fetch(`http://192.168.68.102:8080/api/media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media)
    });
    return res.json();
  }

  async deleteMedia(id: string): Promise<void> {
    await fetch(`http://192.168.68.102:8080/api/media/${id}`, {
      method: 'DELETE'
    });
  }

  // Trainings
  async getTrainings(): Promise<Training[]> {
    const res = await fetch('http://localhost:3001/api/trainings');
    return res.json();
  }

  async createTraining(training: Omit<Training, 'id'>): Promise<Training> {
    const res = await fetch('http://localhost:3001/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(training)
    });
    return res.json();
  }

  async updateTraining(id: string, training: Partial<Omit<Training, 'id'>>): Promise<Training> {
    const res = await fetch(`http://localhost:3001/api/trainings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(training)
    });
    return res.json();
  }

  async deleteTraining(id: string): Promise<void> {
    await fetch(`http://localhost:3001/api/trainings/${id}`, {
      method: 'DELETE'
    });
  }

  // Coaches
  async getCoaches(): Promise<Coach[]> {
    return getCoaches();
  }

  async createCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
    return createCoach(coach);
  }

  async updateCoach(id: string, coach: Partial<Coach>): Promise<Coach> {
    return updateCoach(id, coach);
  }

  async deleteCoach(id: string): Promise<void> {
    return deleteCoach(id);
  }
}

export const db = new DatabaseService(); 