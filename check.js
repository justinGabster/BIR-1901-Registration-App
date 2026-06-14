const mysql = require('mysql2/promise');

async function check() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Gabster#27',
    database: 'bir_db'
  });
  
  const [tables] = await connection.query("SHOW TABLES");
  for (let row of tables) {
    const tableName = Object.values(row)[0];
    const [cols] = await connection.query(`DESCRIBE ${tableName}`);
    console.log(`\nTable: ${tableName}`);
    cols.forEach(c => console.log(`- ${c.Field}: ${c.Type}`));
  }
  await connection.end();
}

check().catch(console.error);
