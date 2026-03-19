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
        const notes = await Note.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.render('notes', { 
            title: 'Moje Poznámky',
            user: req.session.username,
            notes: notes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Chyba při načítání poznámek');
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
        res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.redirect('/notes');
    }
};

exports.deleteNote = async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Nepřihlášen');
    
    try {
        await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
        res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.redirect('/notes');
    }
};
