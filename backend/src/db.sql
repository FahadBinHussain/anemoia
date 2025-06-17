CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  given_name TEXT,
  family_name TEXT
);

CREATE TABLE IF NOT EXISTS follows (
  user_id TEXT NOT NULL,
  artist_id TEXT NOT NULL,
  PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  PRIMARY KEY (user_id, artwork_id)
);

CREATE TABLE IF NOT EXISTS saved (
  user_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  PRIMARY KEY (user_id, artwork_id)
); 