Bakalářská práce Nikola Benešová
===================================

### Instalace projektu:

Pro zdárné nainstalování a spuštění projektu je potřeba mít naisntalovaná v počítači:

* NodeJS
* Yarn a NPM

### Nastavení připojení k MongoDB:

Pro spojení aplikace s běžící instancí mongoDB serveru je potřeba upravit následující parametr 

V souboru: `app.js` je proměnná: 
```
// Connection URI - připojení na MongoDB
const uri =
    "mongodb://root:example@127.0.0.1:27017/?poolSize=20&writeConcern=majority";

```

Kde `root` je uživatelské jméno, `example` je heslo, `127.0.0.1` je host běžícího mongoDB serveru a `21017` je defaultní port běžícího mongoDB serveru.

### Inicializace projektu:

Pro zapnutí projektu je potřeba udělat s již nainstalovanými nástroji následující: 
 
Otevřít terminál a navigovat se do root adresáře s projektem a v tomto terminálu spustit příkazy:

* `yarn install` (stáhne všechny dependencies pro tento projekt)
* `yarn start` (spustí nodejs aplikaci)

