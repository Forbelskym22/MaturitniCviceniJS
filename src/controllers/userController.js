const path = require('path');

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Přihlášení' });
};

exports.postLogin = (req, res) => {
    const { login, password } = req.body;
    console.log(`Pokus o přihlášení: ${login}`);
    // Zde bude logika pro ověření uživatele
    res.redirect('/');
};

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Registrace' });
};

exports.postRegister = (req, res) => {
    const { login, password, password_confirm } = req.body;

    if (password !== password_confirm) {
        console.log('Hesla se neshodují');
        return res.render('register', { 
            title: 'Registrace', 
            error: 'Hesla se neshodují!' 
        });
    }

    console.log(`Nová registrace: ${login}`);
    // Zde bude logika pro uložení uživatele
    res.redirect('/user/login');
};
