const mysql = require('mysql2/promise');
async function run() {
  try {
    const c = await mysql.createConnection({host:'127.0.0.1', user:'root', password:'Gabster#27', database:'bir_db'});
    const tables = ['applicant', 'applicantcontact', 'facility', 'industry', 'idvalidation', 'invoices', 'rep', 'repcontact', 'spousal'];
    for (const t of tables) {
      const [rows] = await c.query('SELECT * FROM ' + t + ' LIMIT 3');
      console.log('--- ' + t + ' DATA ---');
      console.log(JSON.stringify(rows, null, 2));
    }
    process.exit(0);
  } catch(e) {
    console.error(e);
  }
}
run();
