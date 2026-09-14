import Database from 'better-sqlite3';

const db = new Database('wallet.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(64),
    first_name VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS balances (
    user_id INTEGER REFERENCES users(id),
    asset VARCHAR(10) NOT NULL,
    amount DECIMAL(18, 6) DEFAULT 0,
    PRIMARY KEY (user_id, asset)
);

CREATE TABLE IF NOT EXISTS checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(32) UNIQUE NOT NULL,
    creator_id INTEGER REFERENCES users(id),
    asset VARCHAR(10) NOT NULL,
    total_amount DECIMAL(18, 6) NOT NULL,
    per_user_amount DECIMAL(18, 6) NOT NULL,
    max_activations INTEGER NOT NULL,
    current_activations INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS check_activations (
    check_id INTEGER REFERENCES checks(id),
    user_id INTEGER REFERENCES users(id),
    PRIMARY KEY (check_id, user_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    asset VARCHAR(10) NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    tx_hash VARCHAR(128),
    counterparty VARCHAR(128),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
