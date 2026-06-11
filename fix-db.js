const mysql = require('mysql2/promise');

async function fixDB() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Gabster#27',
      database: 'bir_db'
    });

    console.log("Fixing applicantcontact table...");
    // Change TEXT to VARCHAR(50) so it can be part of a primary key
    await connection.query("ALTER TABLE applicantcontact MODIFY prefContactType VARCHAR(50) NOT NULL;");
    // Drop existing primary key (applicantID)
    await connection.query("ALTER TABLE applicantcontact DROP PRIMARY KEY;");
    // Add composite primary key
    await connection.query("ALTER TABLE applicantcontact ADD PRIMARY KEY (applicantID, prefContactType);");

    console.log("Fixing repcontact table...");
    // Change TEXT to VARCHAR(50)
    await connection.query("ALTER TABLE repcontact MODIFY repPrefContactType VARCHAR(50) NOT NULL;");
    // Drop existing primary key (applicantID, repID)
    await connection.query("ALTER TABLE repcontact DROP PRIMARY KEY;");
    // Add composite primary key
    await connection.query("ALTER TABLE repcontact ADD PRIMARY KEY (applicantID, repID, repPrefContactType);");

    console.log("Database schema fixed successfully!");
  } catch (error) {
    console.error("Error fixing database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDB();
