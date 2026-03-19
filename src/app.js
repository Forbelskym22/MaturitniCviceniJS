require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Připojeno k MongoDB'))
    .catch(err => console.error('Chyba při připojování k MongoDB:', err));

// Session configuration
app.use(session({
    secret: 'maturitni_tajemstvi_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
