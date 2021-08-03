const rateLimitLogin = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// Limite chaque IP à 5 (max) requêtes par fenêtre de tps de 15 minutes (windowsMs)
module.exports = rateLimitLogin({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // nombre de tentatives
    headers: true,
    message:
    "Trop de tentatives de connexion. Réessayez dans 15 minutes"
});