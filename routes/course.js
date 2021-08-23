var express = require('express');
const {loggedInInfo} = require("../services/authentication");
var router = express.Router();

const courseModel = require('../models/course');

// Úvodní get pro kurz - načte se potřebný kurz dle ID, případně se zachytí chyba, pokud takové ID neexistuje - flash vyhodí chybu.
router.get('/course/:courseId', loggedInInfo, async function (req, res, next) {
    const courseId = req.params.courseId;

    const course = await courseModel.findOne({_id: courseId})
    if (!course?._id) {
        await req.flash('error', `Požadovaný kurz nebyl nalezen!`);
        res.redirect('/');
        return;
    }

    res.render('course', {course});
});

module.exports = router;