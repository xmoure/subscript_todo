const knex = require("./connection.js");

async function all() {
    return knex('organizations');
}

async function get(id) {
    const results = await knex('organizations').where({ id });
    return results[0];
}

async function create(data) {
    const results = await knex('organizations').insert(data).returning('*');
    return results[0];
}

async function update(id, data) {
    const results = await knex('organizations').where({ id }).update(data).returning('*');
    return results[0];
}

module.exports = {
    all,
    get,
    create,
    update,

}