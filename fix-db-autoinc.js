const mysql = require('mysql2/promise');

async function fixDBAutoInc() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Gabster#27',
      database: 'bir_db'
    });

    console.log("Fixing applicantcontact table...");
    // Drop the composite primary key
    await connection.query("ALTER TABLE applicantcontact DROP PRIMARY KEY;");
    // Add the new auto-incrementing column
    await connection.query("ALTER TABLE applicantcontact ADD COLUMN applicantContactID INT AUTO_INCREMENT PRIMARY KEY FIRST;");

    console.log("Fixing repcontact table...");
    // Drop the composite primary key
    await connection.query("ALTER TABLE repcontact DROP PRIMARY KEY;");
    // Add the new auto-incrementing column
    await connection.query("ALTER TABLE repcontact ADD COLUMN repContactID INT AUTO_INCREMENT PRIMARY KEY FIRST;");

    console.log("Database schema auto-increment fixed successfully!");
  } catch (error) {
    console.error("Error fixing database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDBAutoInc();
