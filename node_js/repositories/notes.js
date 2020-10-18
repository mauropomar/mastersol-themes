const pool = require('../connection/server-db')
const objNotes = {}

const getNotes = async (req) => {
    const params = [req.query.idsection, req.query.idregistro]
    const query = "SELECT cfgapl.fn_get_notes($1,$2)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_notes == null) {
        return []
    }
    return result.rows[0].fn_get_notes
}

const insertNote = async (req) => {
    const params = [req.body.idsection, req.body.idregistro, req.body.texto]
    const query = "SELECT cfgapl.fn_insert_note($1,$2,$3)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_note == null) {
        return []
    }
    return result.rows[0].fn_insert_note
}

const updateNote = async (req) => {
    const params = [req.body.id, req.body.idsection, req.body.idregistro, req.body.texto]
    const query = "SELECT cfgapl.fn_update_note($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_update_note == null) {
        return []
    }
    return result.rows[0].fn_update_note
}

const deleteNote = async (req) => {
    const params = [req.body.idnota]
    const query = "SELECT cfgapl.fn_delete_note($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_delete_note == null) {
        return []
    }
    return result.rows[0].fn_delete_note
}

objNotes.getNotes = getNotes
objNotes.insertNote = insertNote
objNotes.updateNote = updateNote
objNotes.deleteNote = deleteNote
module.exports = objNotes