const rateLimitLogin = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// Limite chaque IP à 10 requêtes par 15 minutes
module.exports = rateLimitLogin({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message:
    "Trop de tentatives de connexion. Réessayez dans 15 minutes"
});