import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Add a test route to verify the server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Database connection
const db = new sqlite3.Database(join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database with test data
function initializeDatabase() {
  db.serialize(() => {
    // Teams table
    db.run(`CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT,
      primaryColor TEXT,
      secondaryColor TEXT,
      logo TEXT,
      coach TEXT,
      founded INTEGER,
      stadium TEXT,
      country TEXT,
      website TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Coaches table
    db.run(`CREATE TABLE IF NOT EXISTS coaches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      team_id TEXT,
      photo TEXT,
      nationality TEXT,
      age INTEGER,
      experience INTEGER,
      achievements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);

    // Players table
    db.run(`CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT,
      number INTEGER,
      team_id TEXT,
      photo TEXT,
      nationality TEXT,
      age INTEGER,
      height INTEGER,
      weight INTEGER,
      stats TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);

    // Matches table
    db.run(`CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      startTime TEXT,
      opponent TEXT,
      location TEXT,
      score TEXT,
      status TEXT,
      highlights TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // News table
    db.run(`CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      date TEXT,
      author TEXT,
      tags TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Media table
    db.run(`CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Check if test data exists before inserting
    db.get('SELECT COUNT(*) as count FROM players', (err, row) => {
      if (err) {
        console.error('Error checking players table:', err);
        return;
      }

      if (row.count === 0) {
        // Insert test data only if the table is empty
        db.run(`
          INSERT INTO players (id, name, position, number, team_id, photo, nationality, age, height, weight, stats) 
          VALUES (
            'player_1',
            'John Doe',
            'Forward',
            10,
            'team_1',
            'https://example.com/player1.jpg',
            'USA',
            25,
            180,
            75,
            '{"goals": 15, "assists": 8, "yellowCards": 2, "redCards": 0, "appearances": 30}'
          )
        `);

        db.run(`
          INSERT INTO players (id, name, position, number, team_id, photo, nationality, age, height, weight, stats) 
          VALUES (
            'player_2',
            'Jane Smith',
            'Midfielder',
            8,
            'team_1',
            'https://example.com/player2.jpg',
            'England',
            23,
            175,
            65,
            '{"goals": 5, "assists": 12, "yellowCards": 1, "redCards": 0, "appearances": 28}'
          )
        `);
      }
    });
  });
}

// Teams API
app.get('/api/teams', (req, res) => {
  console.log('GET /api/teams called');
  db.all('SELECT * FROM teams', (err, rows) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
    console.log('Teams found:', rows);
    res.json(rows || []);
  });
});

app.get('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM teams WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching team:', err);
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(row);
  });
});

app.post('/api/teams', (req, res) => {
  const { name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description } = req.body;
  const id = `team_${Date.now()}`;
  
  db.run(
    'INSERT INTO teams (id, name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description],
    function(err) {
      if (err) {
        console.error('Error creating team:', err);
        return res.status(500).json({ error: 'Failed to create team' });
      }
      res.status(201).json({ id, name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description });
    }
  );
});

app.put('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  const { name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description } = req.body;
  
  db.run(
    'UPDATE teams SET name = ?, city = ?, primaryColor = ?, secondaryColor = ?, logo = ?, coach = ?, founded = ?, stadium = ?, country = ?, website = ?, description = ? WHERE id = ?',
    [name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description, id],
    function(err) {
      if (err) {
        console.error('Error updating team:', err);
        return res.status(500).json({ error: 'Failed to update team' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json({ id, name, city, primaryColor, secondaryColor, logo, coach, founded, stadium, country, website, description });
    }
  );
});

app.delete('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM teams WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting team:', err);
      return res.status(500).json({ error: 'Failed to delete team' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(204).send();
  });
});

// Players API
app.get('/api/players', (req, res) => {
  const { teamId } = req.query;
  
  const query = teamId 
    ? `SELECT p.*, t.name as team_name FROM players p LEFT JOIN teams t ON p.team_id = t.id WHERE p.team_id = ?`
    : `SELECT p.*, t.name as team_name FROM players p LEFT JOIN teams t ON p.team_id = t.id`;
  const params = teamId ? [teamId] : [];

  console.log('GET /api/players called with teamId:', teamId);
  console.log('Query:', query);
  console.log('Params:', params);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching players:', err);
      return res.status(500).json({ error: 'Failed to fetch players' });
    }
    
    const players = rows.map(player => ({
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
      stats: player.stats ? JSON.parse(player.stats) : {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      },
      created_at: player.created_at,
      updated_at: player.updated_at
    }));
    
    res.json(players);
  });
});

app.post('/api/players', (req, res) => {
  try {
    const { name, position, number, team_id, team_name, photo, nationality, age, height, weight, stats } = req.body;
    const id = uuidv4();
    const statsJson = JSON.stringify(stats || {
      games: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    });

    console.log('Creating player with data:', { name, position, number, team_id, team_name, photo, nationality, age, height, weight, stats });

    // First, verify that the team exists if team_id is provided
    if (team_id) {
      db.get('SELECT name FROM teams WHERE id = ?', [team_id], (err, team) => {
        if (err) {
          console.error('Error verifying team:', err);
          return res.status(500).json({ error: 'Failed to verify team' });
        }
        if (!team) {
          return res.status(400).json({ error: 'Team not found' });
        }
        
        // Proceed with player creation
        db.run(
          'INSERT INTO players (id, name, position, number, team_id, photo, nationality, age, height, weight, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, name, position, number, team_id, photo || null, nationality || null, age || null, height || null, weight || null, statsJson],
          function(err) {
            if (err) {
              console.error('Error creating player:', err);
              return res.status(500).json({ error: 'Failed to create player' });
            }
            
            console.log('Player created with ID:', id);
            console.log('Team ID saved:', team_id);
            
            res.status(201).json({
              id,
              team_id: team_id,
              team_name: team.name,
              name,
              position,
              number,
              photo,
              nationality,
              age,
              height,
              weight,
              stats: JSON.parse(statsJson)
            });
          }
        );
      });
    } else {
      // Create player without team
      db.run(
        'INSERT INTO players (id, name, position, number, team_id, photo, nationality, age, height, weight, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, position, number, null, photo || null, nationality || null, age || null, height || null, weight || null, statsJson],
        function(err) {
          if (err) {
            console.error('Error creating player:', err);
            return res.status(500).json({ error: 'Failed to create player' });
          }
          
          res.status(201).json({
            id,
            team_id: null,
            team_name: null,
            name,
            position,
            number,
            photo,
            nationality,
            age,
            height,
            weight,
            stats: JSON.parse(statsJson)
          });
        }
      );
    }
  } catch (error) {
    console.error('Error in player creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/players/:id', (req, res) => {
  try {
    const { name, position, number, team_id, team_name, photo, nationality, age, height, weight, stats } = req.body;
    const id = req.params.id;
    const statsJson = JSON.stringify(stats || {
      games: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    });

    console.log('Updating player with data:', { id, name, position, number, team_id, team_name, photo, nationality, age, height, weight, stats });

    // First, verify that the team exists if team_id is provided
    if (team_id) {
      db.get('SELECT name FROM teams WHERE id = ?', [team_id], (err, team) => {
        if (err) {
          console.error('Error verifying team:', err);
          return res.status(500).json({ error: 'Failed to verify team' });
        }
        if (!team) {
          return res.status(400).json({ error: 'Team not found' });
        }

        // Proceed with player update
        db.run(
          `UPDATE players SET
            name = ?,
            position = ?,
            number = ?,
            team_id = ?,
            photo = ?,
            nationality = ?,
            age = ?,
            height = ?,
            weight = ?,
            stats = ?
          WHERE id = ?`,
          [name, position, number, team_id, photo || null, nationality || null, age || null, height || null, weight || null, statsJson, id],
          function(err) {
            if (err) {
              console.error('Error updating player:', err);
              return res.status(500).json({ error: 'Failed to update player' });
            }
            if (this.changes === 0) {
              return res.status(404).json({ error: 'Player not found' });
            }
            
            res.json({
              id,
              team_id: team_id,
              team_name: team.name,
              name,
              position,
              number,
              photo,
              nationality,
              age,
              height,
              weight,
              stats: JSON.parse(statsJson)
            });
          }
        );
      });
    } else {
      // Update player without team
      db.run(
        `UPDATE players SET
          name = ?,
          position = ?,
          number = ?,
          team_id = NULL,
          photo = ?,
          nationality = ?,
          age = ?,
          height = ?,
          weight = ?,
          stats = ?
        WHERE id = ?`,
        [name, position, number, photo || null, nationality || null, age || null, height || null, weight || null, statsJson, id],
        function(err) {
          if (err) {
            console.error('Error updating player:', err);
            return res.status(500).json({ error: 'Failed to update player' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Player not found' });
          }
          
          res.json({
            id,
            team_id: null,
            team_name: null,
            name,
            position,
            number,
            photo,
            nationality,
            age,
            height,
            weight,
            stats: JSON.parse(statsJson)
          });
        }
      );
    }
  } catch (error) {
    console.error('Error in player update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/players/:id', (req, res) => {
  const { id } = req.params;
  
  console.log(`DELETE /api/players/${id} called.`);
  
  db.run('DELETE FROM players WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting player:', err);
      return res.status(500).json({ error: 'Failed to delete player' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(204).send();
  });
});

// Matches API
app.get('/api/matches', (req, res) => {
  db.all('SELECT * FROM matches', (err, rows) => {
    if (err) {
      console.error('Error fetching matches:', err);
      return res.status(500).json({ error: 'Failed to fetch matches' });
    }
    
    const matches = rows.map(match => ({
      ...match,
      score: match.score ? JSON.parse(match.score) : null,
      highlights: match.highlights ? JSON.parse(match.highlights) : []
    }));
    
    res.json(matches);
  });
});

app.post('/api/matches', (req, res) => {
  const { date, startTime, opponent, location, score, status, highlights } = req.body;
  const id = `match_${Date.now()}`;
  const scoreJson = score ? JSON.stringify(score) : null;
  const highlightsJson = highlights ? JSON.stringify(highlights) : '[]';
  
  db.run(
    'INSERT INTO matches (id, date, startTime, opponent, location, score, status, highlights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, date, startTime, opponent, location, scoreJson, status, highlightsJson],
    function(err) {
      if (err) {
        console.error('Error creating match:', err);
        return res.status(500).json({ error: 'Failed to create match' });
      }
      res.status(201).json({
        id,
        date,
        startTime,
        opponent,
        location,
        score,
        status,
        highlights
      });
    }
  );
});

app.put('/api/matches/:id', (req, res) => {
  const { id } = req.params;
  const { date, startTime, opponent, location, score, status, highlights } = req.body;
  const scoreJson = score ? JSON.stringify(score) : null;
  const highlightsJson = highlights ? JSON.stringify(highlights) : '[]';
  
  db.run(
    'UPDATE matches SET date = ?, startTime = ?, opponent = ?, location = ?, score = ?, status = ?, highlights = ? WHERE id = ?',
    [date, startTime, opponent, location, scoreJson, status, highlightsJson, id],
    function(err) {
      if (err) {
        console.error('Error updating match:', err);
        return res.status(500).json({ error: 'Failed to update match' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json({
        id,
        date,
        startTime,
        opponent,
        location,
        score,
        status,
        highlights
      });
    }
  );
});

app.delete('/api/matches/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM matches WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting match:', err);
      return res.status(500).json({ error: 'Failed to delete match' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.status(204).send();
  });
});

// News API
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY date DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching news:', err);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
    
    const news = rows.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      date: item.date || new Date().toISOString()
    }));
    
    res.json(news);
  });
});

app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching news item:', err);
      return res.status(500).json({ error: 'Failed to fetch news item' });
    }
    if (!row) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    const news = {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      date: row.date || new Date().toISOString()
    };
    
    res.json(news);
  });
});

app.post('/api/news', (req, res) => {
  const { title, content, image, author, tags, category } = req.body;
  const id = `news_${Date.now()}`;
  const date = new Date().toISOString();
  const tagsJson = tags ? JSON.stringify(tags) : '[]';
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  db.run(
    'INSERT INTO news (id, title, content, image, date, author, tags, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, content, image || null, date, author || null, tagsJson, category || 'general'],
    function(err) {
      if (err) {
        console.error('Error creating news:', err);
        return res.status(500).json({ error: 'Failed to create news' });
      }
      res.status(201).json({
        id,
        title,
        content,
        image: image || null,
        date,
        author: author || null,
        tags: tags || [],
        category: category || 'general'
      });
    }
  );
});

app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, image, author, tags, category } = req.body;
  const tagsJson = tags ? JSON.stringify(tags) : '[]';
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  db.run(
    'UPDATE news SET title = ?, content = ?, image = ?, author = ?, tags = ?, category = ? WHERE id = ?',
    [title, content, image || null, author || null, tagsJson, category || 'general', id],
    function(err) {
      if (err) {
        console.error('Error updating news:', err);
        return res.status(500).json({ error: 'Failed to update news' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'News not found' });
      }
      
      db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated news:', err);
          return res.status(500).json({ error: 'Failed to fetch updated news' });
        }
        
        const news = {
          ...row,
          tags: row.tags ? JSON.parse(row.tags) : [],
          date: row.date || new Date().toISOString()
        };
        
        res.json(news);
      });
    }
  );
});

app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting news:', err);
      return res.status(500).json({ error: 'Failed to delete news' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.status(204).send();
  });
});

// Media API
app.get('/api/media', (req, res) => {
  db.all('SELECT * FROM media', (err, rows) => {
    if (err) {
      console.error('Error fetching media:', err);
      return res.status(500).json({ error: 'Failed to fetch media' });
    }
    res.json(rows);
  });
});

app.post('/api/media', (req, res) => {
  const { title, description, file_url, type } = req.body;
  const id = `media_${Date.now()}`;
  
  db.run(
    'INSERT INTO media (id, title, description, file_url, type) VALUES (?, ?, ?, ?, ?)',
    [id, title, description, file_url, type],
    function(err) {
      if (err) {
        console.error('Error creating media:', err);
        return res.status(500).json({ error: 'Failed to create media' });
      }
      res.status(201).json({
        id,
        title,
        description,
        file_url,
        type
      });
    }
  );
});

app.put('/api/media/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, file_url, type } = req.body;
  
  db.run(
    'UPDATE media SET title = ?, description = ?, file_url = ?, type = ? WHERE id = ?',
    [title, description, file_url, type, id],
    function(err) {
      if (err) {
        console.error('Error updating media:', err);
        return res.status(500).json({ error: 'Failed to update media' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Media not found' });
      }
      res.json({
        id,
        title,
        description,
        file_url,
        type
      });
    }
  );
});

app.delete('/api/media/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM media WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting media:', err);
      return res.status(500).json({ error: 'Failed to delete media' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(204).send();
  });
});

// Coaches API
app.get('/api/coaches', (req, res) => {
  db.all('SELECT * FROM coaches', (err, rows) => {
    if (err) {
      console.error('Error fetching coaches:', err);
      return res.status(500).json({ error: 'Failed to fetch coaches' });
    }
    res.json(rows);
  });
});

app.get('/api/coaches/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM coaches WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching coach:', err);
      return res.status(500).json({ error: 'Failed to fetch coach' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json(row);
  });
});

app.post('/api/coaches', (req, res) => {
  const { name, team_id, photo, nationality, age, experience, achievements } = req.body;
  const id = `coach_${Date.now()}`;
  
  db.run(
    'INSERT INTO coaches (id, name, team_id, photo, nationality, age, experience, achievements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, team_id, photo, nationality, age, experience, achievements],
    function(err) {
      if (err) {
        console.error('Error creating coach:', err);
        return res.status(500).json({ error: 'Failed to create coach' });
      }
      res.status(201).json({
        id,
        name,
        team_id,
        photo,
        nationality,
        age,
        experience,
        achievements
      });
    }
  );
});

app.put('/api/coaches/:id', (req, res) => {
  const { id } = req.params;
  const { name, team_id, photo, nationality, age, experience, achievements } = req.body;
  
  db.run(
    'UPDATE coaches SET name = ?, team_id = ?, photo = ?, nationality = ?, age = ?, experience = ?, achievements = ? WHERE id = ?',
    [name, team_id, photo, nationality, age, experience, achievements, id],
    function(err) {
      if (err) {
        console.error('Error updating coach:', err);
        return res.status(500).json({ error: 'Failed to update coach' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Coach not found' });
      }
      res.json({
        id,
        name,
        team_id,
        photo,
        nationality,
        age,
        experience,
        achievements
      });
    }
  );
});

app.delete('/api/coaches/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM coaches WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting coach:', err);
      return res.status(500).json({ error: 'Failed to delete coach' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.status(204).send();
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 