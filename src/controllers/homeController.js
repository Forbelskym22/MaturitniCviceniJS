exports.getHome = (req, res) => {
    res.render('login', { 
        title: 'Maturitní Cvičení JS - MVC',
        message: 'Vítejte v naší aplikaci používající MVC architekturu!'
    });
};
