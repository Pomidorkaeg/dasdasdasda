export interface Player {
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

export interface Training {
  id: string;
  date: Date;
  type: string;
  description: string;
  location: string;
  participants: string[]; // Array of player IDs
}

export interface Media {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  type: 'image' | 'video';
  date: string;
  tags: string[];
}

export interface Match {
  id: string;
  date: Date;
  time: string;
  opponent: string;
  venue: string;
  competition?: string;
  score: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  stats?: {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
  };
  highlights: any[];
  created_at?: string;
  updated_at?: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'card' | 'substitution';
  minute: number;
  playerId: string;
  description: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  foundedYear: number;
  stadium: string;
  city: string;
  country: string;
  coach: string;
  website: string;
  address: string;
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  backgroundImage: string;
  stats: {
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
} 