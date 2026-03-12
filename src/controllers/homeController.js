exports.getHome = (req, res) => {
    res.render('index', { 
        title: 'Maturitní Cvičení JS - MVC',
        message: 'Vítejte v naší aplikaci používající MVC architekturu!'
    });
};
