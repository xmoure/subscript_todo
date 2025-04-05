const userSchema = require("../schemas/userSchema");
const userQueries = require('../database/user.queries');
const bcrypt = require('bcrypt');
const sanitizeUser = require("../utils/sanitizeUser");

exports.create = async (req, res) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        const formatted = validation.error.issues.map(issue => `${issue.path[0]}: ${issue.message}`);
        return res.status(400).json({ error: formatted });
    }
    try {
        const { name, password, email, organization_id } = validation.data;
        const encPassword = await bcrypt.hash(password, 10);

        const newUser = await userQueries.create({
            name,
            password: encPassword,
            email,
            organization_id
        });
        const safeUser = sanitizeUser(newUser);
        res.status(201).json(safeUser);
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'users_email_unique') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Error creating user' });
    }
}

exports.getUsers = async(req,res) => {
    try{
        const users = await userQueries.all();
        res.status(200).json(users);
    }catch(error){
        console.error('Error getting users', error)
        res.status(500).json({ error: 'Error getting users' });
    }
}