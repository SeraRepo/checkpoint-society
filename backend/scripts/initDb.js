const Session = require('../src/models/Session')

// Sample sessions data
const sampleSessions = [
  {
    name: 'Session du soir - 18h00',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow 18:00
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Tomorrow 20:00
    total_slots: 30
  },
  {
    name: 'Session du soir - 20h30',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 4.5 * 60 * 60 * 1000).toISOString(),
    total_slots: 30
  },
  {
    name: 'Session du soir - 23h00',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
    total_slots: 25
  }
]

console.log('Initializing database with sample data...')

sampleSessions.forEach(session => {
  Session.create(session)
  console.log(`Created session: ${session.name}`)
})

console.log('Database initialized successfully!')
