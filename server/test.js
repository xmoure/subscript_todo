// test-db.js
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD
    }
});

knex.raw('SELECT 1')
    .then(() => {
        console.log('✅ Connected to DB');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ DB connection failed', err);
        process.exit(1);
    });
