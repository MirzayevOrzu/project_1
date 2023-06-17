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
    const { q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;
    const dbQuery = db('groups').select(
      'groups.id',
      'groups.name',
      'groups.teacher_id',
      'groups.assistent_teacher_id'
    );

    if (q) {
      dbQuery.andWhereILike('groups.name', `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);
    dbQuery.limit(limit).offset(offset);

    const result = await dbQuery;

    res.status(201).json({
      groups: result,
      pageInfo: {
        total: total.length,
        offset,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const showGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await db('groups')
      .leftJoin('stuff as stuff_teacher', 'stuff_teacher.id', 'groups.teacher_id')
      .leftJoin('stuff as stuff_assistent ', 'stuff_assistent.id', 'groups.assistent_teacher_id')
      .innerJoin('groups_students', 'groups_students.group_id', 'groups.id')
      .innerJoin('students', 'groups_students.student_id', 'students.id')
      .select(
        'groups.id',
        'groups.name',
        'stuff_teacher.id as teacher_id',
        db.raw("CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"),
        'stuff_assistent.id as assistent_id',
        db.raw(
          "CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher"
        ),
        db.raw(
          `json_agg(json_build_object(
          'id', students.id,
          'first_name', students.first_name, 
          'last_name', students.last_name
        )) as students`
        )
      )
      .where({ 'groups.id': id })
      .groupBy('groups.id', 'stuff_teacher.id', 'stuff_assistent.id')
      .first();

    if (!group) {
      return res.status(404).json({
        error: 'Group not found',
      });
    }

    res.status(201).json({
      group,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const patchGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db('groups').where({ id }).update(req.body).returning('*');

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('groups').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle group topilmadi`,
      });
    }

    const deleted = await db('groups')
      .where({ id })
      .delete()
      .returning(['id', 'name', 'teacher_id', 'assistent_id']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    await db('groups_students').insert({ group_id: id, student_id });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removeStudent = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    await db('groups_students').where({ group_id: id, student_id }).delete();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postGroup,
  getGroups,
  showGroup,
  patchGroup,
  deleteGroup,
  addStudent,
  removeStudent,
};
