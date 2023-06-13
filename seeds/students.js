/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('students').del();
  await knex('students').insert([
    { first_name: 'Ilnur', last_name: 'Umirbayev' },
    { first_name: 'Iroda', last_name: 'Muminova' },
    { first_name: 'Jahongir', last_name: 'Ahmadov' },
  ]);
};
