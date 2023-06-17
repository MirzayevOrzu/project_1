const { hashSync } = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('stuff').del();
  await knex('stuff').insert([
    {
      // id: 1,
      first_name: 'Usmon',
      last_name: 'Mirzayev',
      role: 'super_admin',
      username: 'superadmin',
      password: hashSync('foobarbaz', 10),
    },
    {
      // id: 2,
      first_name: "O'g'abek",
      last_name: 'Joniqulov',
      role: 'admin',
      username: 'admin',
      password: hashSync('foobarbaz', 10),
    },
    {
      // id: 3,
      first_name: 'Mr',
      last_name: 'Bean',
      role: 'teacher',
      username: 'teacher',
      password: hashSync('foobarbaz', 10),
    },
    {
      // id: 4,
      first_name: 'John',
      last_name: 'Doe',
      role: 'assistent_teacher',
      username: 'assistent',
      password: hashSync('foobarbaz', 10),
    },
  ]);
};
