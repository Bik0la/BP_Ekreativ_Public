const express = require('express');
const router = express.Router();
const {isAuthorized} = require("../services/authentication");

/*
* Úvodní GET pro logout - ani nezobrazujeme, jenom redirect a mazání session.
* */
router.get('/logout', isAuthorized, function (req, res, next) {
    req.session.userId = null
    res.redirect('/login')
});


module.exports = router;