// Importations
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        // problème d'identifications
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};