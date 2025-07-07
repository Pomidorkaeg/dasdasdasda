import { Team, Match, News, Media } from '../types/models';
import { Player } from '../types/player';
import { teamsApi, playersApi, matchesApi, newsApi, mediaApi } from '../api/api';

export class DatabaseService {
  // Teams
  static async getTeams(): Promise<Team[]> {
    return teamsApi.getAll();
  }

  static async getTeamById(id: string): Promise<Team> {
    return teamsApi.getById(id);
  }

  static async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    return teamsApi.create(team);
  }

  static async updateTeam(id: string, team: Partial<Omit<Team, 'id'>>): Promise<Team> {
    return teamsApi.update(id, team);
  }

  static async deleteTeam(id: string): Promise<void> {
    return teamsApi.delete(id);
  }

  // Players
  static async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return playersApi.getByTeam(teamId);
  }

  static async createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
    return playersApi.create(player);
  }

  static async updatePlayer(id: string, player: Partial<Omit<Player, 'id'>>): Promise<Player> {
    return playersApi.update(id, player);
  }

  static async deletePlayer(id: string): Promise<void> {
    return playersApi.delete(id);
  }

  // Matches
  static async getMatches(): Promise<Match[]> {
    return matchesApi.getAll();
  }

  static async getMatchById(id: string): Promise<Match> {
    return matchesApi.getById(id);
  }

  static async createMatch(match: Omit<Match, 'id'>): Promise<Match> {
    return matchesApi.create(match);
  }

  static async updateMatch(id: string, match: Partial<Omit<Match, 'id'>>): Promise<Match> {
    return matchesApi.update(id, match);
  }

  static async deleteMatch(id: string): Promise<void> {
    return matchesApi.delete(id);
  }

  // News
  static async getNews(): Promise<News[]> {
    return newsApi.getAll();
  }

  static async getNewsById(id: string): Promise<News> {
    return newsApi.getById(id);
  }

  static async createNews(news: Omit<News, 'id'>): Promise<News> {
    return newsApi.create(news);
  }

  static async updateNews(id: string, news: Partial<Omit<News, 'id'>>): Promise<News> {
    return newsApi.update(id, news);
  }

  static async deleteNews(id: string): Promise<void> {
    return newsApi.delete(id);
  }

  // Media
  static async getMedia(): Promise<Media[]> {
    return mediaApi.getAll();
  }

  static async getMediaById(id: string): Promise<Media> {
    return mediaApi.getById(id);
  }

  static async createMedia(media: Omit<Media, 'id'>): Promise<Media> {
    return mediaApi.create(media);
  }

  static async updateMedia(id: string, media: Partial<Omit<Media, 'id'>>): Promise<Media> {
    return mediaApi.update(id, media);
  }

  static async deleteMedia(id: string): Promise<void> {
    return mediaApi.delete(id);
  }
} 