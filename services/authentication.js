const userModel = require('../models/user');

/*
Autentikace - isAuthorized přímo kontroluje, zdali je uživatel přihlášen,
a v opačném případě dává redirect na login.
Pokud si spojí session.userId s userId, tak pokračujeme dál skrze next
 */
module.exports.isAuthorized = function (req, res, next) {
    userModel.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            res.locals = {...res.locals, user: {}}
            return next(error);
        } else {
            if (user === null) {
                res.redirect('/login')
                res.locals = {...res.locals, user: {}}
                return
            } else {
                req.user = user;
                res.locals = {...res.locals, user: user}
                return next();
            }
        }
    });
}

/*
loggednInInfo pouze čte, zdali je dotyčný přihlášen. Pokud ano, můžeme pak poslat na
render celého uživatele a dotazovat se na věci jako LastName nebo FirstName.
 */
module.exports.loggedInInfo = function (req, res, next) {
    userModel.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            res.locals = {...res.locals, user: {}}
            return next(error);
        } else {
            if (user === null) {
                res.locals = {...res.locals, user: {}}
                return next();
            } else {
                req.user = user;
                res.locals = {...res.locals, user: user}
                return next();
            }
        }
    });
}