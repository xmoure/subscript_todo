const jwt = require('jsonwebtoken');

// move to .env 
const JWT_SECRET = 'super-super-super-secret';

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ error: 'Please provide a token' })
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error", error);
        res.status(500).json({error: 'Error'});
    }
}


module.exports = authenticate;