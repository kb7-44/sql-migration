// Loading .env in process.env
require('dotenv').config()
const mariadb = require('mariadb');

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5
}
console.log(db_config);
const pool = mariadb.createPool(db_config);

module.exports.execute = async (query, params) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query, params);

    return rows;

  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}