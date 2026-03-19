const Note = require('../models/Note');

exports.getHome = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/notes');
    }
    res.redirect('/user/login');
};

exports.getNotes = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/user/login');
    }
    
    try {
        const showFavoritesOnly = req.query.favorites === 'true';
        let query = { user: req.session.userId };
        
        if (showFavoritesOnly) {
            query.isFavorite = true;
        }

        const notes = await Note.find(query).sort({ isFavorite: -1, createdAt: -1 });
        
        res.render('notes', { 
            title: 'Moje Poznámky',
            user: req.session.username,
            notes: notes,
            showFavoritesOnly: showFavoritesOnly
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Chyba při načítání poznámek');
    }
};

exports.toggleFavorite = async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Nepřihlášen');
    
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
        if (note) {
            note.isFavorite = !note.isFavorite;
            await note.save();
        }
        const redirectUrl = req.query.favorites === 'true' ? '/notes?favorites=true' : '/notes';
        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.redirect('/notes');
    }
};

exports.postNote = async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Nepřihlášen');
    
    try {
        const { title, content } = req.body;
        const newNote = new Note({
            title,
            content,
            user: req.session.userId
        });
        await newNote.save();
        
        // Redirect back with the same filter if it was active
        const redirectUrl = req.query.favorites === 'true' ? '/notes?favorites=true' : '/notes';
        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.redirect('/notes');
    }
};

exports.deleteNote = async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Nepřihlášen');
    
    try {
        await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
        const redirectUrl = req.query.favorites === 'true' ? '/notes?favorites=true' : '/notes';
        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.redirect('/notes');
    }
};
