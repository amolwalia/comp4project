const pool = require('../db/pool');

function mapWishlistRow(row) {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    price: Number(row.price),
    productLink: row.product_link,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getWishlistItemsByUser(userId) {
  const itemsQuery = `
    SELECT id, name, image_url, price, product_link, created_at, updated_at
    FROM wishlist_items
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const statsQuery = `
    SELECT COUNT(*)::INTEGER AS item_count, COALESCE(SUM(price), 0)::NUMERIC(10, 2) AS total_value
    FROM wishlist_items
    WHERE user_id = $1
  `;

  const [itemsResult, statsResult] = await Promise.all([
    pool.query(itemsQuery, [userId]),
    pool.query(statsQuery, [userId])
  ]);

  return {
    items: itemsResult.rows.map(mapWishlistRow),
    stats: {
      totalItems: statsResult.rows[0].item_count,
      totalValue: Number(statsResult.rows[0].total_value)
    }
  };
}

async function createWishlistItem(userId, item) {
  const query = `
    INSERT INTO wishlist_items (user_id, name, image_url, price, product_link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, image_url, price, product_link, created_at, updated_at
  `;

  const values = [userId, item.name, item.imageUrl, item.price, item.productLink];
  const { rows } = await pool.query(query, values);
  return mapWishlistRow(rows[0]);
}

async function updateWishlistItem(userId, itemId, item) {
  const query = `
    UPDATE wishlist_items
    SET name = $3,
        image_url = $4,
        price = $5,
        product_link = $6,
        updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING id, name, image_url, price, product_link, created_at, updated_at
  `;
  const values = [itemId, userId, item.name, item.imageUrl, item.price, item.productLink];
  const { rows } = await pool.query(query, values);

  return rows[0] ? mapWishlistRow(rows[0]) : null;
}

async function deleteWishlistItem(userId, itemId) {
  const query = `
    DELETE FROM wishlist_items
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rows } = await pool.query(query, [itemId, userId]);
  return Boolean(rows[0]);
}

module.exports = {
  getWishlistItemsByUser,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem
};

