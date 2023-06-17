/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('students').del();
  await knex('students').insert([
    {
      // id: 1,
      first_name: 'Ilnur',
      last_name: 'Umirbayev',
    },
    {
      // id: 2,
      first_name: 'Iroda',
      last_name: 'Muminova',
    },
    {
      // id: 3,
      first_name: 'Jahongir',
      last_name: 'Ahmadov',
    },
  ]);
};
