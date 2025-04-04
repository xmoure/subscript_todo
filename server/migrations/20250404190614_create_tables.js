/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('organizations', function(table) {
        table.increments('id');
        table.string('name');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now())
    })
    .createTable('users', function(table) {
        table.increments('id');
        table.string('name');
        table.string('email').unique();
        table.string('password');
        table.integer('organization_id').unsigned().references('id').inTable('organizations');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
    })
    .createTable('projects', function(table) {
        table.increments('id');
        table.string('name');
        table.string('description');
        table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
    })
    .createTable('tasks', function(table) {
        table.increments('id');
        table.string('title');
        table.string('description');
        table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
    })
    .createTable('taskAssignees', function(table) {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('task_id').unsigned().references('id').inTable('tasks');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
        table.unique(['user_id', 'task_id'])
    })
    .createTable('projectMembers', function(table) {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('project_id').unsigned().references('id').inTable('projects');
        table.timestamp('assigned_at', {useTz: true}).defaultTo(knex.fn.now());
        table.enum('role', ['admin', 'viewer', 'member'])
        table.unique(['user_id', 'project_id'])
    })
    .createTable('attachments', function(table) {
        table.increments('id');
        table.integer('task_id').unsigned().references('id').inTable('tasks');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
        table.string('url');
        table.string('fileName');
        table.string('fileType')
    })
    .createTable('comments', function(table) {
        table.increments('id');
        table.integer('task_id').unsigned().references('id').inTable('tasks');
        table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
        table.string('content');
    })
    ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments')
    .dropTableIfExists('attachments')
    .dropTableIfExists('projectMembers')
    .dropTableIfExists('taskAssignees')
    .dropTableIfExists('tasks')
    .dropTableIfExists('projects')
    .dropTableIfExists('users')
    .dropTableIfExists('organizations')
};
