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