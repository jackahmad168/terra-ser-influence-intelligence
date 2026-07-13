const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const OUT = path.join(__dirname, 'import-result.json');

(async () => {
  const uri = 'postgresql://backend_r95t_user:VoINh0mdA6y5092FPuqzPjEfobvCg9rb@dpg-d98aska8qa3s73f6lhdg-a.singapore-postgres.render.com/backend_r95t';
  const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
  let result;
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    const check = await client.query('SELECT COUNT(*) AS count FROM influencers');
    result = { ok: true, message: 'Schema imported', rows: Number(check.rows[0].count) };
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch(_) {}
    result = { ok: false, error: err.message };
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  process.stdout.write(JSON.stringify(result) + '\n');
})();
