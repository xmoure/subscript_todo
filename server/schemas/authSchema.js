const {z} = require('zod');

const authSchema = z.object({
    email: z.string().email({message: 'Email is required'}),
    password: z.string(),
});

module.exports = authSchema;