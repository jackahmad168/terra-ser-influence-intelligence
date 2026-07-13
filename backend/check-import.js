const fs = require('fs');
const { Client } = require('pg');
const uri = 'postgresql://backend_r95t_user:VoINh0mdA6y5092FPuqzPjEfobvCg9rb@dpg-d98aska8qa3s73f6lhdg-a.singapore-postgres.render.com/backend_r95t';

(async()=>{
  const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
  const outPath = './check-import-result.json';
  try{
    await client.connect();
    const res = await client.query('SELECT COUNT(*) AS count FROM influencers');
    const result = { ok: true, count: Number(res.rows[0].count) };
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  }catch(err){
    const result = { ok: false, error: err.message };
    try { fs.writeFileSync(outPath, JSON.stringify(result, null, 2)); } catch(e){}
    process.exitCode = 1;
  }finally{ await client.end().catch(()=>{}); }
})();
