const pool = require('../db/pool');

async function createUser({ name, email, passwordHash }) {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;

  const { rows } = await pool.query(query, [name, email, passwordHash]);
  return rows[0];
}

async function findUserByEmail(email) {
  const query = `
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = $1
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function createDefaultWishlistSettings(userId) {
  const query = `
    INSERT INTO wishlist_settings (user_id)
    VALUES ($1)
    ON CONFLICT (user_id) DO NOTHING
  `;

  await pool.query(query, [userId]);
}

module.exports = {
  createUser,
  findUserByEmail,
  createDefaultWishlistSettings
};

