exports.getHome = (req, res) => {
    res.render('login', { 
        title: 'Maturitní Cvičení JS - MVC',
        message: 'Vítejte v naší aplikaci používající MVC architekturu!'
    });
};

exports.getNotes = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/user/login');
    }
    
    res.render('notes', { 
        title: 'Moje Poznámky',
        user: req.session.username
    });
};
