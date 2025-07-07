const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const open = require('open');

// Express server setup
const server = express();
const PORT = 3000;

server.use(express.static(path.join(__dirname, 'dist')));

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.on('ready', () => {
  // Start the server
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Open the default browser
    open(`http://localhost:${PORT}`);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
