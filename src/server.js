// Clear console
console.clear();

// Server initialization
const express = require('express');
const app = express();

// Use public folder for static files
app.use(express.static('public'));

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));
