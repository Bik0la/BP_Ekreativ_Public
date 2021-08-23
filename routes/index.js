const express = require('express');
const courseModel = require('../models/course');
const {loggedInInfo} = require("../services/authentication");

const router = express.Router();


/* GET home page.
* Úvodní GET pro index. Načtou se všechny modely z db, a zobrazí se skrze ejs šablonu.
* */
router.get('/', loggedInInfo, async function (req, res, next) {
    const courses = await courseModel.find();

    res.render('index', {courses: courses, user: req.user});
});



module.exports = router;
