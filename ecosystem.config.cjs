const path = require('path');

module.exports = {
  apps: [
    {
      name: 'codejudge-backend',
      script: 'backend/local-api-server.js',
      cwd: __dirname,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      }
    },
    {
      name: 'codejudge-frontend',
      script: 'node_modules/vite/bin/vite.js',
      args: '--host 0.0.0.0 --port 3000',
      cwd: path.join(__dirname, 'frontend'),
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
