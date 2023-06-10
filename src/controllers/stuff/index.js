const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const config = require('../../shared/config');

/**
 * Post stuff
 * 1. Yangi stuff qo'shishni faqat admin va super_admin qila olishi kerak
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postStuff = async (req, res) => {
  try {
    const { first_name, last_name, role, username, password } = req.body;

    // TODO hash password

    const result = await db('stuff')
      .insert({
        first_name,
        last_name,
        role,
        username,
        password,
      })
      .returning('*');

    res.status(201).json({
      user: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Get list of stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStuff = async (req, res) => {
  try {
    const { role, q } = req.query;
    const dbQuery = db('stuff').select('id', 'first_name', 'last_name', 'role', 'username');

    if (role) {
      dbQuery.where({ role });
    }
    if (q) {
      dbQuery.andWhereILike('first_name', `%${q}%`).orWhereILike('last_name', `%${q}%`);
    }

    const stuff = await dbQuery;

    res.status(200).json({
      stuff,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Get single stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showStuff = async (req, res) => {
  try {
    const { id } = req.params;
    const stuff = await db('stuff')
      .select('id', 'first_name', 'last_name', 'role', 'username')
      .where({ id })
      .first();

    if (!stuff) {
      return res.status(404).json({
        error: 'Xodim topilmadi.',
      });
    }

    res.status(200).json({
      stuff,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Login stuff
 * Xodim tizimga kirish uchun login qilishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginStuff = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await db('stuff').where({ username }).select('id', 'password', 'role').first();

    if (!existing) {
      return res.status(401).json({
        error: 'Username yoki password xato.',
      });
    }

    if (existing.password !== password) {
      return res.status(401).json({
        error: 'Username yoki password xato.',
      });
    }

    const token = jwt.sign({ id: existing.id, role: existing.role }, config.jwt.secret, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Update stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni ma'lumotlarini tahrirlay oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchStuff = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await db('stuff').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli xodim topilmadi.`,
      });
    }

    const updated = await db('stuff')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'first_name', 'last_name', 'role', 'username']);

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
 * Delete stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni o'chira oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteStuff = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('stuff').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli xodim topilmadi.`,
      });
    }

    const deleted = await db('stuff')
      .where({ id })
      .delete()
      .returning(['id', 'first_name', 'last_name', 'role', 'username']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  postStuff,
  getStuff,
  showStuff,
  loginStuff,
  patchStuff,
  deleteStuff,
};
