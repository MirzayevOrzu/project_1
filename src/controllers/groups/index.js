const express = require('express');
const db = require('../../db');
const knex = require('knex');

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postGroup = async (req, res) => {
  try {
    const { name, teacher_id, assistent_teacher_id } = req.body;

    if (teacher_id) {
      const existing = await db('stuff').where({ id: teacher_id }).first();

      if (!existing || existing.role !== 'teacher') {
        return res.status(400).json({
          error: 'Teacher mavjud emas.',
        });
      }
    }

    if (assistent_teacher_id) {
      const existing = await db('stuff').where({ id: assistent_teacher_id }).first();

      if (!existing || existing.role !== 'assistent_teacher') {
        return res.status(400).json({
          error: 'Asistent teacher mavjud emas.',
        });
      }
    }

    const result = await db('groups')
      .insert({ name, teacher_id, assistent_teacher_id })
      .returning('*');

    res.status(201).json({
      group: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getGroups = async (req, res) => {
  try {
    const result = await db('groups')
      .leftJoin('stuff as stuff_teacher', 'stuff_teacher.id', 'groups.teacher_id')
      .leftJoin('stuff as stuff_assistent ', 'stuff_assistent.id', 'groups.assistent_teacher_id')
      .select(
        'groups.id',
        'groups.name',
        db.raw("CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"),
        db.raw("CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher")
      );

    res.status(201).json({
      groups: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postGroup,
  getGroups,
};
