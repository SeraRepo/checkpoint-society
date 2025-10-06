const Admin = require('../src/models/Admin')

const DEFAULT_USERNAME = 'Avana'
const DEFAULT_PASSWORD = 'L3VentSeLève!'

async function initAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = Admin.getByUsername(DEFAULT_USERNAME)

    if (existingAdmin) {
      console.log(`Admin user '${DEFAULT_USERNAME}' already exists`)
      return
    }

    // Create admin user
    await Admin.create({
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD
    })

    console.log(`Admin user '${DEFAULT_USERNAME}' created successfully!`)
  } catch (error) {
    console.error('Error creating admin user:', error.message)
    process.exit(1)
  }
}

initAdmin()
