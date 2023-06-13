/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('groups', (table) => {
    table.increments('id').primary();
    table.string('name', 150).notNullable();
    table.integer('teacher_id').references('id').inTable('stuff').onDelete('SET NULL');
    table.integer('assistent_teacher_id').references('id').inTable('stuff').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('groups');
};
