const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main route
app.get('/', (req, res) => {
    res.render('index', { title: 'Maturitní Cvičení JS' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
