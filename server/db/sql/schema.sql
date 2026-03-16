CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  visibility VARCHAR(20) NOT NULL DEFAULT 'private',
  orb_theme VARCHAR(40) NOT NULL DEFAULT 'graphite',
  allow_link_sharing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT wishlist_settings_visibility_check
    CHECK (visibility IN ('private', 'friends', 'public'))
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  image_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  product_link TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);

CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  CONSTRAINT friendships_unique_pair UNIQUE (requester_id, addressee_id),
  CONSTRAINT friendships_status_check CHECK (status IN ('pending', 'accepted', 'blocked'))
);

CREATE TABLE IF NOT EXISTS wishlist_shares (
  id SERIAL PRIMARY KEY,
  owner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  share_token UUID,
  share_type VARCHAR(20) NOT NULL DEFAULT 'direct',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT wishlist_shares_type_check CHECK (share_type IN ('direct', 'link', 'public'))
);

COMMENT ON TABLE wishlist_settings IS 'Future-ready visibility and presentation settings for orb sharing.';
COMMENT ON TABLE friendships IS 'Reserved for future following or friend access controls.';
COMMENT ON TABLE wishlist_shares IS 'Reserved for future share-link and per-user access grants.';

