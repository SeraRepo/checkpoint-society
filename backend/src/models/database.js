const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../../database/bookings.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize tables
const initTables = () => {
  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      total_slots INTEGER NOT NULL,
      available_slots INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `)

  // Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Initialize default settings
  const defaultSettings = [
    { key: 'event_date', value: 'Dimanche 12 Octobre' },
    { key: 'invites_fr', value: 'Vous invite à sa première chasse aux loups-garous !' },
    { key: 'invites_en', value: 'Invites you to his first Werewolf hunt!' }
  ]

  const checkSetting = db.prepare('SELECT key FROM settings WHERE key = ?')
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')

  defaultSettings.forEach(({ key, value }) => {
    const exists = checkSetting.get(key)
    if (!exists) {
      insertSetting.run(key, value)
    }
  })

  // Migrations
  // Check if phone column exists in bookings table
  const checkPhoneColumn = db.prepare(`
    SELECT COUNT(*) as count
    FROM pragma_table_info('bookings')
    WHERE name='phone'
  `).get()

  if (checkPhoneColumn.count === 0) {
    console.log('Adding phone column to bookings table...')
    db.exec('ALTER TABLE bookings ADD COLUMN phone TEXT')
    console.log('Phone column added successfully')
  }

  // Check if party_size column exists in bookings table
  const checkPartySizeColumn = db.prepare(`
    SELECT COUNT(*) as count
    FROM pragma_table_info('bookings')
    WHERE name='party_size'
  `).get()

  if (checkPartySizeColumn.count === 0) {
    console.log('Adding party_size column to bookings table...')
    db.exec('ALTER TABLE bookings ADD COLUMN party_size INTEGER DEFAULT 1')
    console.log('Party_size column added successfully')
  }

  // Check if token column exists in bookings table
  const checkTokenColumn = db.prepare(`
    SELECT COUNT(*) as count
    FROM pragma_table_info('bookings')
    WHERE name='token'
  `).get()

  if (checkTokenColumn.count === 0) {
    console.log('Adding token column to bookings table...')
    db.exec('ALTER TABLE bookings ADD COLUMN token TEXT')

    // Generate tokens for existing bookings
    const { v4: uuidv4 } = require('uuid')
    const existingBookings = db.prepare('SELECT id FROM bookings WHERE token IS NULL').all()
    const updateStmt = db.prepare('UPDATE bookings SET token = ? WHERE id = ?')

    existingBookings.forEach(booking => {
      updateStmt.run(uuidv4(), booking.id)
    })

    // Create unique index on token column
    try {
      db.exec('CREATE UNIQUE INDEX idx_bookings_token ON bookings(token)')
      console.log('Token column added and unique index created')
    } catch (err) {
      console.log('Token column added (index may already exist)')
    }
  }

  // Check if is_waitlist column exists in bookings table
  const checkWaitlistColumn = db.prepare(`
    SELECT COUNT(*) as count
    FROM pragma_table_info('bookings')
    WHERE name='is_waitlist'
  `).get()

  if (checkWaitlistColumn.count === 0) {
    console.log('Adding is_waitlist column to bookings table...')
    db.exec('ALTER TABLE bookings ADD COLUMN is_waitlist INTEGER DEFAULT 0')
    console.log('is_waitlist column added successfully')
  }

  console.log('Database tables initialized')
}

initTables()

module.exports = db
