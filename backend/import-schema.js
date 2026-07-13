const fs = require('fs');
const { Client } = require('pg');

(async () => {
  const uri = 'postgresql://backend_r95t_user:VoINh0mdA6y5092FPuqzPjEfobvCg9rb@dpg-d98aska8qa3s73f6lhdg-a.singapore-postgres.render.com/backend_r95t';
  const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
  try {
    const sql = fs.readFileSync('../database/schema.sql', 'utf8');
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(JSON.stringify({ ok: true, message: 'Schema imported' }));
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch(e){}
    console.error(JSON.stringify({ ok: false, error: err.message }));
    process.exitCode = 1;
  } finally {
    await client.end().catch(()=>{});
  }
})();
