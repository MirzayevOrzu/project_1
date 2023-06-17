/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('directions').del();
  await knex('directions').insert([
    {
      // id: 1,
      name: 'Dizayn',
    },
    {
      // id: 2,
      name: 'Marketing',
    },
    {
      // id: 3,
      name: 'Dasturlash',
    },
  ]);
};
