/*
Flash je middleware pro dynamické zobrazování zpráv na stránce - v
ejs souboru je pro něj v potřebných případech vyhrazené místo.
Flash vypisuje text, který zadáváme v jiných routes nebo jiných js
souborech obecně, pokud je správně napojen.
 */
module.exports.flashMiddleware = async function (req, res, next) {
    let info = await req.consumeFlash('info');
    let error = await req.consumeFlash('error');
    res.locals = {
        ...res.locals, messages: [...error.map(function (i) {
            return {type: 'error', message: i}
        }),
            ...info.map(function (i) {
                return {type: 'info', message: i}
            })
        ]
    }

    return next()
}