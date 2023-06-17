const express = require('express');
const db = require('../../db');

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getDirections = async (req, res) => {
  try {
    const { q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;
    const dbQuery = db('directions').select('id', 'name');

    if (q) {
      dbQuery.andWhereILike('groups.name', `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);
    dbQuery.limit(limit).offset(offset);

    const directions = await dbQuery;

    res.status(200).json({
      directions,
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
const showDirection = async (req, res) => {
  try {
    const { id } = req.params;

    const direction = await db('directions').select('id', 'name').where({ id }).first();

    if (!direction) {
      return res.status(404).json({
        error: 'Direction not found',
      });
    }

    res.status(200).json({
      directions,
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
const patchDirection = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli direction topilmadi`,
      });
    }

    const updated = await db('directions')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'name']);

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
const deleteDirection = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle direction topilmadi`,
      });
    }

    const deleted = await db('directions').where({ id }).delete().returning(['id', 'name']);

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
const postDirection = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db('directions').insert({ name }).returning('*');

    res.status(201).json({
      direction: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getDirections,
  showDirection,
  patchDirection,
  deleteDirection,
  postDirection,
};
