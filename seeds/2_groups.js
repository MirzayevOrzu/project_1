/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('groups').del();
  await knex('groups').insert([
    {
      // id: 1,
      name: 'N82',
      teacher_id: 3,
      assistent_teacher_id: 4,
    },
    {
      // id: 2,
      name: 'N3',
      teacher_id: 3,
      assistent_teacher_id: null,
    },
  ]);
};
