const userQueries = require('../database/user.queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authSchema = require('../schemas/authSchema');
const sanitizeUser = require('../utils/sanitizeUser');

const JWT_SECRET = 'super-super-super-secret';

exports.login = async (req, res) => {
    const validation = authSchema.safeParse(req.body);
    if (!validation.success) {
        const formatted = validation.error.issues.map(issue => `${issue.path[0]}: ${issue.message}`);
        return res.status(400).json({ error: formatted });
    }
    try {
        const { email, password } = validation.data;

        const user = await userQueries.getByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Invalid user or email' })
        }
        const matches = await bcrypt.compare(password, user.password);
        if (!matches) {
            return res.status(404).json({ error: 'Invalid user or email' })
        }
        const token = jwt.sign({ id: user.id, organization_id: user.organization_id }, JWT_SECRET, {expiresIn: '9d'} );
        const sanitizedUser = sanitizeUser(user);
        res.status(200).json({
            user: sanitizedUser,
            token
        })
    } catch (error) {
        res.status(500).json({error: "There was an error"});
    }
}