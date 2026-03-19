const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcryptjs');

exports.getSettings = (req, res) => {
    if (!req.session.userId) return res.redirect('/user/login');
    res.render('settings', { 
        title: 'Nastavení účtu', 
        user: req.session.username,
        error: null,
        success: null
    });
};

exports.updateProfile = async (req, res) => {
    if (!req.session.userId) return res.redirect('/user/login');
    
    try {
        const { login, current_password, new_password } = req.body;
        const user = await User.findById(req.session.userId);

        // Verification
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.render('settings', { 
                title: 'Nastavení účtu', 
                user: req.session.username, 
                error: 'Současné heslo je nesprávné', 
                success: null 
            });
        }

        // Change login if provided
        if (login && login !== user.login) {
            user.login = login;
            req.session.username = login;
        }

        // Change password if provided
        if (new_password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(new_password, salt);
        }

        await user.save();
        res.render('settings', { 
            title: 'Nastavení účtu', 
            user: req.session.username, 
            error: null, 
            success: 'Údaje byly úspěšně aktualizovány' 
        });
    } catch (err) {
        console.error(err);
        res.render('settings', { 
            title: 'Nastavení účtu', 
            user: req.session.username, 
            error: 'Nastala chyba při aktualizaci', 
            success: null 
        });
    }
};

exports.deleteAccount = async (req, res) => {
    if (!req.session.userId) return res.redirect('/user/login');
    
    try {
        const { confirm_password } = req.body;
        const user = await User.findById(req.session.userId);

        const isMatch = await bcrypt.compare(confirm_password, user.password);
        if (!isMatch) {
            return res.render('settings', { 
                title: 'Nastavení účtu', 
                user: req.session.username, 
                error: 'Heslo pro smazání účtu je nesprávné', 
                success: null 
            });
        }

        // Delete user's notes first
        await Note.deleteMany({ user: req.session.userId });
        // Delete user
        await User.findByIdAndDelete(req.session.userId);

        req.session.destroy();
        res.redirect('/user/register');
    } catch (err) {
        console.error(err);
        res.redirect('/user/settings');
    }
};

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Přihlášení', error: null });
};

exports.postLogin = async (req, res) => {
    try {
        const { login, password } = req.body;
        
        // Find user by login
        const user = await User.findOne({ login });
        if (!user) {
            return res.render('login', { 
                title: 'Přihlášení', 
                error: 'Uživatel s tímto jménem neexistuje' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { 
                title: 'Přihlášení', 
                error: 'Nesprávné heslo' 
            });
        }

        console.log(`Uživatel ${login} se úspěšně přihlásil`);
        
        // Store user info in session
        req.session.userId = user._id;
        req.session.username = user.login;
        
        res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.render('login', { 
            title: 'Přihlášení', 
            error: 'Nastala chyba při přihlašování' 
        });
    }
};

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Registrace', error: null });
};

exports.postRegister = async (req, res) => {
    try {
        const { login, password, password_confirm } = req.body;

        // Basic validation
        if (password !== password_confirm) {
            return res.render('register', { 
                title: 'Registrace', 
                error: 'Hesla se neshodují!' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.render('register', { 
                title: 'Registrace', 
                error: 'Uživatel s tímto jménem již existuje' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            login,
            password: hashedPassword
        });

        await newUser.save();
        console.log(`Nový uživatel zaregistrován: ${login}`);
        res.redirect('/user/login');
    } catch (err) {
        console.error(err);
        let errorMsg = 'Chyba při registraci';
        if (err.name === 'ValidationError') {
            errorMsg = Object.values(err.errors).map(e => e.message).join(', ');
        }
        res.render('register', { 
            title: 'Registrace', 
            error: errorMsg 
        });
    }
};
