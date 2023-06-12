const express = require('express')
const db = require('../../db')

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getStudents = async (req, res) => {
    try {
        const dbQuery = db('students').select('id', 'first_name', 'last_name');

        const students = await dbQuery

        res.status(200).json({
            students
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const showStudents = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        const students = await db('students')
            .select('id', 'first_name', 'last_name')
            .where({ id })
            .first()

        if (!students) {
            return res.status(404).json({
                error: "Student not found"
            })
        }

        res.status(200).json({
            students
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const patchStudent = async (req, res) => {
    try {
        const { ...changes } = req.body
        const { id } = req.params

        const existing = await db('students').where({ id }).first()

        if (!existing) {
            return res.status(404).json({
                error: `${id}-idli student topilmadi`
            })
        }

        const updated = await db('students')
            .where({ id })
            .update({ ...changes })
            .returning(['id', 'first_name', 'last_name'])

        res.status(200).json({
            updated: updated[0]
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        const existing = await db('students').where({ id }).first()

        if (!existing) {
            return res.status(404).json({
                error: `${id}-idle student topilmadi`
            })
        }

        const deleted = await db('students')
            .where({ id })
            .delete()
            .returning(['id', 'first_name', 'last_name'])

        res.status(200).json({
            deleted: deleted[0]
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postStudent = async (req, res) => {
    try {
        const { first_name, last_name } = req.body

        const result = await db('students')
            .insert({
                first_name,
                last_name
            })
            .returning('*')

        res.status(201).json({
            student: result[0]
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports = {
    getStudents,
    showStudents,
    patchStudent,
    deleteStudent,
    postStudent
}