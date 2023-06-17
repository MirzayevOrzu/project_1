/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('groups_students').del();
  await knex('groups_students').insert([
    {
      // id: 1,
      student_id: 3,
      group_id: 1,
    },
    {
      // id: 2,
      student_id: 2,
      group_id: 2,
    },
    {
      // id: 3,
      student_id: 3,
      group_id: 2,
    },
  ]);
};
