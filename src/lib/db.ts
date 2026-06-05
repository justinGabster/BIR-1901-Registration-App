import mysql from 'mysql2/promise';

let pool: mysql.Pool;

if (!global.mysqlPool_v2) {
  global.mysqlPool_v2 = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Gabster#27',
    database: 'bir_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

pool = global.mysqlPool_v2;

export default pool;

declare global {
  var mysqlPool: mysql.Pool | undefined;
}
