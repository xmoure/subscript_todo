const {z} = require('zod');

const userSchema = z.object({
    name: z.string().min(1, {message: 'Name is required'}),
    email: z.string().email({message: 'Email is required'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    organization_id: z.number({message: "Organization ID is required"})
});

module.exports = userSchema;