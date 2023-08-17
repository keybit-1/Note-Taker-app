const express = require('express');
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));
