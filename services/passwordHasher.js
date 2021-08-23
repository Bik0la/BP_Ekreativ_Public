/*
Hashování hesel dle pravide bcryptu
 */

const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    hashPassword: function (plainPassword) {
        return bcrypt.hashSync(plainPassword, saltRounds);
    },
    checkPassword: function (plainPassword, hash) {
        return bcrypt.compareSync(plainPassword, hash);
    },
}