const express = require('express');
const router = express.Router();
const {checkPassword, hashPassword} = require('../services/passwordHasher')
const userModel = require('../models/user');

const defaultResponseParameters = {login: {}, register: {}}

/* GET users listing.
* Úvodní GET pro uživatele. Nekontroluje se přihlášení, na tuto stránku stejně odkazujeme jenom pokud nejsme přihlášení.
* */
router.get('/login', function (req, res, next) {
    res.render('login', defaultResponseParameters);
});

/*
* POST pro přihlášení - přečteme login a password, uložíme si ho a zkontrolujeme skrze model a porovnání s db. Pokud nesedí údaje,
* flash vyhodí chybu. Pokud vše proběhne v pořádku, odkážeme na index ('/') a ukládáme session, abychom byli stále přihlášeni.
* */
router.post('/login', async function (req, res, next) {
    const {username, password} = req.body;

    const user = await userModel.findOne({username})
    if (!user || !checkPassword(password, user.password)) {
        res.render('login', {...defaultResponseParameters, login: {message: 'Neplatné přihlašovací údaje!'}});
        return;
    }

    req.session.userId = user._id
    await req.flash('info', `Uživatel ${user.firstName} ${user.lastName} byl úspěšně přihlášen!`);

    res.redirect('/')
});

/*
* POST pro registraci. Kontrolujeme, jestli už nemá někdo stejný login, a máme try catch na případnou chybu - v obou případech flash ukáže chybu.
* Jinak opět renderujeme login stránku a flash ukáže úspěšnou registraci.
*  */
router.post('/register', async function (req, res, next) {
    const {username, password, firstName, lastName} = req.body;

    const user = userModel.findOne({username})
    if (!!user?.username) {
        res.render('login', {
            ...defaultResponseParameters,
            register: {message: 'Uživatel s tímto jménem již existuje!'}
        });
        return;
    }

    const userToBeCreated = new userModel({
        username,
        password: hashPassword(password),
        firstName,
        lastName,
    })

    try {
        await userToBeCreated.save()
    } catch (e) {
        res.render('login', {
            ...defaultResponseParameters,
            register: {message: 'Při zakládání uživatele došlo k chybě!'}
        });
        return;
    }

    res.render('login', {...defaultResponseParameters, register: {message: 'Uživatel byl úspěšně vytvořen!'}});
});

module.exports = router;
