const mysql = require('mysql2/promise');
async function run() {
  try {
    const c = await mysql.createConnection({host:'127.0.0.1', user:'root', password:'Gabster#27', database:'bir_db'});
    const tables = ['facility', 'industry', 'idvalidation', 'invoices', 'spousal'];
    for (const t of tables) {
      const [cols] = await c.query(`DESCRIBE ${t}`);
      console.log(`--- ${t} ---`);
      console.table(cols);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
