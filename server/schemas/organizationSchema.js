const {z} = require('zod');

const organizationSchema = z.object({
    name: z.string().min(1, {message: 'Organization name is required'})
});

module.exports = organizationSchema;