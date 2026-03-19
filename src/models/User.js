const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Přihlašovací jméno je povinné'],
        unique: true,
        trim: true,
        minlength: [3, 'Jméno musí mít alespoň 3 znaky']
    },
    password: {
        type: String,
        required: [true, 'Heslo je povinné'],
        minlength: [6, 'Heslo musí mít alespoň 6 znaků']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
