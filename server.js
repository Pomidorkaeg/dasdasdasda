import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.68.104:5173', 'http://192.168.68.104:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Initialize database in the project root
const dbPath = path.join(__dirname, 'database.sqlite');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const createTable = `CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo TEXT,
  background_image TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  description TEXT,
  coach TEXT,
  founded_year INTEGER,
  stadium TEXT,
  address TEXT,
  achievements TEXT,
  social_links TEXT,
  stats TEXT,
  created_at TEXT
);`;

const createPlayersTable = `CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER,
  nationality TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  photo TEXT,
  stats TEXT,
  created_at TEXT,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);`;

db.exec(createTable);
db.exec(createPlayersTable);

// Добавляем тестовую команду, если её нет
const testTeamId = 'team_1';
const testTeam = db.prepare('SELECT * FROM teams WHERE id = ?').get(testTeamId);
if (!testTeam) {
  console.log('Adding test team...');
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO teams (
      id, name, short_name, primary_color, secondary_color, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    testTeamId,
    'Тестовая команда',
    'ТК',
    '#000000',
    '#ffffff',
    now
  );
}

// Добавляем тестовых игроков, если их нет
const testPlayers = db.prepare('SELECT * FROM players WHERE team_id = ?').all(testTeamId);
if (testPlayers.length === 0) {
  console.log('Adding test players...');
  const now = new Date().toISOString();
  
  const testPlayersData = [
    {
      name: 'Игрок 1',
      position: 'Вратарь',
      number: 1,
      nationality: 'Россия',
      age: 25,
      height: 190,
      weight: 85
    },
    {
      name: 'Игрок 2',
      position: 'Защитник',
      number: 4,
      nationality: 'Россия',
      age: 23,
      height: 185,
      weight: 80
    },
    {
      name: 'Игрок 3',
      position: 'Полузащитник',
      number: 8,
      nationality: 'Россия',
      age: 24,
      height: 180,
      weight: 75
    },
    {
      name: 'Игрок 4',
      position: 'Нападающий',
      number: 9,
      nationality: 'Россия',
      age: 22,
      height: 178,
      weight: 70
    }
  ];

  const insertPlayer = db.prepare(`
    INSERT INTO players (
      id, team_id, team_name, name, position, number, nationality,
      age, height, weight, stats, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  testPlayersData.forEach((player, index) => {
    const playerId = `player_${index + 1}`;
    insertPlayer.run(
      playerId,
      testTeamId,
      'Тестовая команда',
      player.name,
      player.position,
      player.number,
      player.nationality,
      player.age,
      player.height,
      player.weight,
      JSON.stringify({
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }),
      now
    );
  });
}

console.log('Database initialized');

// Get all teams
app.get('/api/teams', (req, res) => {
  try {
    console.log('Getting all teams');
    const teams = db.prepare('SELECT * FROM teams').all();
    const formattedTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.short_name,
      logo: team.logo,
      backgroundImage: team.background_image,
      primaryColor: team.primary_color,
      secondaryColor: team.secondary_color,
      description: team.description,
      coach: team.coach,
      foundedYear: team.founded_year,
      stadium: team.stadium,
      address: team.address,
      achievements: JSON.parse(team.achievements || '[]'),
      socialLinks: JSON.parse(team.social_links || '{}'),
      stats: JSON.parse(team.stats || '{}')
    }));
    console.log(`Found ${formattedTeams.length} teams`);
    res.json(formattedTeams);
  } catch (error) {
    console.error('Error getting teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team by ID
app.get('/api/teams/:id', (req, res) => {
  try {
    console.log('Getting team by ID:', req.params.id);
    const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
    if (!team) {
      console.log('Team not found');
      return res.status(404).json({ error: 'Team not found' });
    }
    const formattedTeam = {
      id: team.id,
      name: team.name,
      shortName: team.short_name,
      logo: team.logo,
      backgroundImage: team.background_image,
      primaryColor: team.primary_color,
      secondaryColor: team.secondary_color,
      description: team.description,
      coach: team.coach,
      foundedYear: team.founded_year,
      stadium: team.stadium,
      address: team.address,
      achievements: JSON.parse(team.achievements || '[]'),
      socialLinks: JSON.parse(team.social_links || '{}'),
      stats: JSON.parse(team.stats || '{}')
    };
    console.log('Team found:', formattedTeam.name);
    res.json(formattedTeam);
  } catch (error) {
    console.error('Error getting team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create team
app.post('/api/teams', (req, res) => {
  try {
    const team = req.body;
    console.log('Creating new team:', team.name);
    
    // Validate required fields
    if (!team.name || !team.shortName) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name and shortName are required' });
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      `INSERT INTO teams (
        id, name, short_name, logo, background_image, primary_color, secondary_color,
        description, coach, founded_year, stadium, address, achievements, social_links,
        stats, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    stmt.run(
      id,
      team.name,
      team.shortName,
      team.logo || null,
      team.backgroundImage || null,
      team.primaryColor || '#000000',
      team.secondaryColor || '#ffffff',
      team.description || null,
      team.coach || null,
      team.foundedYear || null,
      team.stadium || null,
      team.address || null,
      JSON.stringify(team.achievements || []),
      JSON.stringify(team.socialLinks || {}),
      JSON.stringify(team.stats || {
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }),
      now
    );

    console.log('Team created successfully:', id);
    res.status(201).json({
      id,
      ...team,
      created_at: now
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update team
app.put('/api/teams/:id', (req, res) => {
  try {
    const team = req.body;
    const id = req.params.id;
    console.log('Updating team:', id);

    // Check if team exists
    const existingTeam = db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    if (!existingTeam) {
      console.log('Team not found');
      return res.status(404).json({ error: 'Team not found' });
    }

    const stmt = db.prepare(
      `UPDATE teams SET
        name = ?,
        short_name = ?,
        logo = ?,
        background_image = ?,
        primary_color = ?,
        secondary_color = ?,
        description = ?,
        coach = ?,
        founded_year = ?,
        stadium = ?,
        address = ?,
        achievements = ?,
        social_links = ?,
        stats = ?
      WHERE id = ?`
    );

    stmt.run(
      team.name,
      team.shortName,
      team.logo || null,
      team.backgroundImage || null,
      team.primaryColor || '#000000',
      team.secondaryColor || '#ffffff',
      team.description || null,
      team.coach || null,
      team.foundedYear || null,
      team.stadium || null,
      team.address || null,
      JSON.stringify(team.achievements || []),
      JSON.stringify(team.socialLinks || {}),
      JSON.stringify(team.stats || {
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }),
      id
    );

    console.log('Team updated successfully');
    res.json({
      id,
      ...team
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete team
app.delete('/api/teams/:id', (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting team:', id);
    
    // Check if team exists
    const existingTeam = db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    if (!existingTeam) {
      console.log('Team not found');
      return res.status(404).json({ error: 'Team not found' });
    }

    db.prepare('DELETE FROM teams WHERE id = ?').run(id);
    console.log('Team deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get players by team
app.get('/api/players', (req, res) => {
  try {
    const teamId = req.query.team_id;
    console.log('Getting players for team:', teamId);
    console.log('Query parameters:', req.query);
    
    let players;
    if (teamId) {
      console.log('Filtering players by team_id:', teamId);
      players = db.prepare('SELECT * FROM players WHERE team_id = ?').all(teamId);
      console.log('Found players for team:', players.length);
    } else {
      console.log('Getting all players');
      players = db.prepare('SELECT * FROM players').all();
      console.log('Found total players:', players.length);
    }
    
    const formattedPlayers = players.map(player => ({
      id: player.id,
      team_id: player.team_id,
      team_name: player.team_name,
      name: player.name,
      position: player.position,
      number: player.number,
      nationality: player.nationality,
      age: player.age,
      height: player.height,
      weight: player.weight,
      photo: player.photo,
      stats: JSON.parse(player.stats || '{"games":0,"goals":0,"assists":0,"yellowCards":0,"redCards":0}'),
      created_at: player.created_at
    }));
    
    console.log('Sending response with players:', formattedPlayers.length);
    res.json(formattedPlayers);
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create player
app.post('/api/players', (req, res) => {
  try {
    const player = req.body;
    console.log('Creating new player:', player.name);
    
    // Validate required fields
    if (!player.name || !player.position || !player.team_id || !player.team_name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, position, team_id and team_name are required' });
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      `INSERT INTO players (
        id, team_id, team_name, name, position, number, nationality,
        age, height, weight, photo, stats, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    stmt.run(
      id,
      player.team_id,
      player.team_name,
      player.name,
      player.position,
      player.number || null,
      player.nationality || null,
      player.age || null,
      player.height || null,
      player.weight || null,
      player.photo || null,
      JSON.stringify(player.stats || {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }),
      now
    );

    console.log('Player created successfully:', id);
    res.status(201).json({
      id,
      ...player,
      created_at: now
    });
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player
app.put('/api/players/:id', (req, res) => {
  try {
    const player = req.body;
    const id = req.params.id;
    console.log('Updating player:', id);

    // Check if player exists
    const existingPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(id);
    if (!existingPlayer) {
      console.log('Player not found');
      return res.status(404).json({ error: 'Player not found' });
    }

    const stmt = db.prepare(
      `UPDATE players SET
        team_id = ?,
        team_name = ?,
        name = ?,
        position = ?,
        number = ?,
        nationality = ?,
        age = ?,
        height = ?,
        weight = ?,
        photo = ?,
        stats = ?
      WHERE id = ?`
    );

    stmt.run(
      player.team_id,
      player.team_name,
      player.name,
      player.position,
      player.number || null,
      player.nationality || null,
      player.age || null,
      player.height || null,
      player.weight || null,
      player.photo || null,
      JSON.stringify(player.stats || {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }),
      id
    );

    console.log('Player updated successfully');
    res.json({
      id,
      ...player
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete player
app.delete('/api/players/:id', (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting player:', id);
    
    // Check if player exists
    const existingPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(id);
    if (!existingPlayer) {
      console.log('Player not found');
      return res.status(404).json({ error: 'Player not found' });
    }

    db.prepare('DELETE FROM players WHERE id = ?').run(id);
    console.log('Player deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database file: ${dbPath}`);
}); 