const db = require('./database')

class Settings {
  static getAll() {
    const stmt = db.prepare('SELECT * FROM settings')
    return stmt.all()
  }

  static get(key) {
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?')
    const result = stmt.get(key)
    return result ? result.value : null
  }

  static set(key, value) {
    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `)
    const result = stmt.run(key, value)
    return result.changes > 0
  }

  static delete(key) {
    const stmt = db.prepare('DELETE FROM settings WHERE key = ?')
    const result = stmt.run(key)
    return result.changes > 0
  }
}

module.exports = Settings
