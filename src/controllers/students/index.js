const express = require('express');
const db = require('../../db');
const { NotFoundError } = require('../../shared/errors');

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStudents = async (req, res) => {
  try {
    const { q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;
    const dbQuery = db('students').select('id', 'first_name', 'last_name');

    if (q) {
      dbQuery.andWhereILike('groups.name', `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);
    dbQuery.limit(limit).offset(offset);

    const students = await dbQuery;

    res.status(200).json({
      students,
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

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const students = await db('students')
      .select('id', 'first_name', 'last_name')
      .where({ id })
      .first();

    if (!students) {
      throw new NotFoundError('Student not found');
    }

    res.status(200).json({
      students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchStudent = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await db('students').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli student topilmadi`,
      });
    }

    const updated = await db('students')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'first_name', 'last_name']);

    res.status(200).json({
      updated: updated[0],
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
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('students').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle student topilmadi`,
      });
    }

    const deleted = await db('students')
      .where({ id })
      .delete()
      .returning(['id', 'first_name', 'last_name']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postStudent = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    const result = await db('students')
      .insert({
        first_name,
        last_name,
      })
      .returning('*');

    res.status(201).json({
      student: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getStudents,
  showStudents,
  patchStudent,
  deleteStudent,
  postStudent,
};
