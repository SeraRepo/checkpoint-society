const db = require('./database')
const bcrypt = require('bcryptjs')
const { isValidPassword } = require('../utils/validation')

class Admin {
  static async create({ username, password }) {
    // Validate password strength
    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`)
    }

    const password_hash = await bcrypt.hash(password, 10)
    const stmt = db.prepare(`
      INSERT INTO admins (username, password_hash)
      VALUES (?, ?)
    `)
    const result = stmt.run(username, password_hash)
    return result.lastInsertRowid
  }

  static getByUsername(username) {
    const stmt = db.prepare('SELECT * FROM admins WHERE username = ?')
    return stmt.get(username)
  }

  static async validatePassword(username, password) {
    const admin = this.getByUsername(username)
    if (!admin) {
      return false
    }
    return await bcrypt.compare(password, admin.password_hash)
  }
}

module.exports = Admin
