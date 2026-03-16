const fs = require('fs');
const path = require('path');

const pool = require('../db/pool');

async function main() {
  const schemaPath = path.join(__dirname, '..', 'db', 'sql', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(schemaSql);
  await pool.end();

  console.log('Database schema is up to date.');
}

main().catch(async (error) => {
  console.error('Failed to apply schema.');
  console.error(error);

  try {
    await pool.end();
  } catch (_endError) {
    // Ignore cleanup failures so the original error is preserved.
  }

  process.exit(1);
});
