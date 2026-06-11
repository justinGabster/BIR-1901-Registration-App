const mysql = require('mysql2/promise');

async function revertDB() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Gabster#27',
      database: 'bir_db'
    });

    console.log("Reverting applicantcontact table...");
    // Drop the auto-increment primary key by dropping the column
    await connection.query("ALTER TABLE applicantcontact DROP COLUMN applicantContactID;");
    // Add composite primary key
    await connection.query("ALTER TABLE applicantcontact ADD PRIMARY KEY (applicantID, prefContactType);");

    console.log("Reverting repcontact table...");
    // Drop the auto-increment primary key by dropping the column
    await connection.query("ALTER TABLE repcontact DROP COLUMN repContactID;");
    // Add composite primary key
    await connection.query("ALTER TABLE repcontact ADD PRIMARY KEY (applicantID, repID, repPrefContactType);");

    console.log("Database schema successfully reverted to composite primary keys!");
  } catch (error) {
    console.error("Error reverting database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

revertDB();
