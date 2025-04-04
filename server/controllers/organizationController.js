const organizationSchema = require("../schemas/organizationSchema");
const organizationQueries = require('../database/organization-queries');

exports.create = async (req, res) => {
    const validation = organizationSchema.safeParse(req.body);
    console.log("validation", validation);
    if (!validation.success) {
        const formatted = validation.error.issues.map(issue => `${issue.path[0]}: ${issue.message}`);
        return res.status(400).json({ error: formatted });
    }
    try {
        const { name } = validation.data;
        const newOrganization = await organizationQueries.create({
            name
        });
        res.status(201).json(newOrganization);
    } catch (error) {
        console.error('Error creating organization', error)
        res.status(500).json({ error: 'Error creating an organization' });
    }

}