const db = require('./database')
const { v4: uuidv4 } = require('uuid')

class Booking {
  static getAll() {
    const stmt = db.prepare(`
      SELECT b.*, s.name as session_name, s.start_time
      FROM bookings b
      JOIN sessions s ON b.session_id = s.id
      ORDER BY b.created_at DESC
    `)
    return stmt.all()
  }

  static getBySessionId(sessionId) {
    const stmt = db.prepare('SELECT * FROM bookings WHERE session_id = ?')
    return stmt.all(sessionId)
  }

  static create({ session_id, name, email, phone, party_size = 1, is_waitlist = false }) {
    const token = uuidv4()
    const stmt = db.prepare(`
      INSERT INTO bookings (session_id, name, email, phone, party_size, token, is_waitlist)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(session_id, name, email, phone || null, party_size, token, is_waitlist ? 1 : 0)
    return result.lastInsertRowid
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?')
    return stmt.get(id)
  }

  static getByToken(token) {
    const stmt = db.prepare(`
      SELECT b.*, s.name as session_name, s.start_time, s.end_time, s.available_slots
      FROM bookings b
      JOIN sessions s ON b.session_id = s.id
      WHERE b.token = ?
    `)
    return stmt.get(token)
  }

  static update(id, { party_size }) {
    const stmt = db.prepare(`
      UPDATE bookings
      SET party_size = ?
      WHERE id = ?
    `)
    const result = stmt.run(party_size, id)
    return result.changes > 0
  }

  static updateByToken(token, { name, email, phone, party_size }) {
    const fields = []
    const values = []

    if (name !== undefined) {
      fields.push('name = ?')
      values.push(name)
    }
    if (email !== undefined) {
      fields.push('email = ?')
      values.push(email)
    }
    if (phone !== undefined) {
      fields.push('phone = ?')
      values.push(phone)
    }
    if (party_size !== undefined) {
      fields.push('party_size = ?')
      values.push(party_size)
    }

    if (fields.length === 0) return false

    values.push(token)
    const stmt = db.prepare(`
      UPDATE bookings
      SET ${fields.join(', ')}
      WHERE token = ?
    `)
    const result = stmt.run(...values)
    return result.changes > 0
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM bookings WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }
}

module.exports = Booking
