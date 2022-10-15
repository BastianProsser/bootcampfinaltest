const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'skatepark',
    password: '900811Pancha',
    port: 5432,
});

const saveUser = async (email, nombre, password, experiencia, especialidad, foto) => {
    const result = await pool.query(`INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ('${email}', '${nombre}', '${password}', '${experiencia}', '${especialidad}', '${foto}', false) RETURNING *`)
    return result.rows
}
const obtenerUsers = async () => {
    const results = await pool.query("SELECT * FROM skaters")
    return results.rows
}
const obtenerUser = async (email, password) => {
    const results = await pool.query(`SELECT * FROM skaters WHERE email='${email}' AND password='${password}'`)
    return results.rows[0]
}
const adminEdit = async (id) => {
    const result = await pool.query(`UPDATE skaters SET estado = NOT estado WHERE id = ${id} RETURNING *;`)
    return result.rows
}
const editUser = async (id, nombre, password, experiencia, especialidad) => {
    const result = await pool.query(`UPDATE skaters SET nombre = '${nombre}', password = '${password}', anos_experiencia = '${experiencia}', especialidad = '${especialidad}'  WHERE id = '${id}' RETURNING *;`)
    return result.rows
}

const eliminarSkater = async (id) => {
    const result = await pool.query(`DELETE FROM skaters WHERE id = '${id}'`)
    return result.rows
}

module.exports = { saveUser, obtenerUsers, adminEdit, editUser, obtenerUser, eliminarSkater }