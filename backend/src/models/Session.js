const db = require('./database')

class Session {
  static getAll() {
    const stmt = db.prepare(`
      SELECT id, name, start_time, end_time, total_slots, available_slots, created_at
      FROM sessions
      ORDER BY start_time ASC
    `)
    return stmt.all()
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?')
    return stmt.get(id)
  }

  static create({ name, start_time, end_time, total_slots }) {
    const stmt = db.prepare(`
      INSERT INTO sessions (name, start_time, end_time, total_slots, available_slots)
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(name, start_time, end_time, total_slots, total_slots)
    return result.lastInsertRowid
  }

  static decrementSlot(id, count = 1) {
    const stmt = db.prepare(`
      UPDATE sessions
      SET available_slots = available_slots - ?
      WHERE id = ? AND available_slots >= ?
    `)
    const result = stmt.run(count, id, count)
    return result.changes > 0
  }

  static incrementSlot(id, count = 1) {
    const stmt = db.prepare(`
      UPDATE sessions
      SET available_slots = available_slots + ?
      WHERE id = ? AND available_slots + ? <= total_slots
    `)
    const result = stmt.run(count, id, count)
    return result.changes > 0
  }

  static update(id, { name, start_time, end_time, total_slots }) {
    const currentSession = this.getById(id)
    if (!currentSession) {
      return false
    }

    // Calculate the difference in total_slots to adjust available_slots
    const slotsDifference = total_slots - currentSession.total_slots
    const newAvailableSlots = currentSession.available_slots + slotsDifference

    const stmt = db.prepare(`
      UPDATE sessions
      SET name = ?, start_time = ?, end_time = ?, total_slots = ?, available_slots = ?
      WHERE id = ?
    `)
    const result = stmt.run(name, start_time, end_time, total_slots, Math.max(0, newAvailableSlots), id)
    return result.changes > 0
  }
}

module.exports = Session
