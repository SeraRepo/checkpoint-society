import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SessionModal from '../components/SessionModal'
import api from '../services/api'

function AdminPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [eventDate, setEventDate] = useState('')
  const [invitesFr, setInvitesFr] = useState('')
  const [invitesEn, setInvitesEn] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState('management')
  const [editingBooking, setEditingBooking] = useState(null)
  const [editPartySize, setEditPartySize] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bookingsData, sessionsData, settingsData] = await Promise.all([
        api.getAllBookings(),
        api.getSessions(),
        api.getSettings()
      ])
      setBookings(bookingsData)
      setSessions(sessionsData)
      setEventDate(settingsData.event_date || '')
      setInvitesFr(settingsData.invites_fr || '')
      setInvitesEn(settingsData.invites_en || '')
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookingId, sessionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return
    }

    try {
      await api.deleteBooking(bookingId)
      setBookings(bookings.filter(b => b.id !== bookingId))
      // Recharger les sessions pour mettre à jour les places disponibles
      const sessionsData = await api.getSessions()
      setSessions(sessionsData)
    } catch (error) {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    setEditPartySize(booking.party_size || 1)
  }

  const handleUpdateBooking = async () => {
    try {
      await api.updateBooking(editingBooking.id, { party_size: editPartySize })
      setEditingBooking(null)
      // Recharger les données
      await loadData()
    } catch (error) {
      alert('Erreur lors de la modification: ' + error.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCreateSession = () => {
    setEditingSession(null)
    setShowModal(true)
  }

  const handleEditSession = (session) => {
    setEditingSession(session)
    setShowModal(true)
  }

  const handleSaveSession = async (sessionData, sessionId) => {
    try {
      if (sessionId) {
        // Update existing session
        await api.updateSession(sessionId, sessionData)
      } else {
        // Create new session
        await api.createSession(sessionData)
      }
      // Reload data
      await loadData()
      setShowModal(false)
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la sauvegarde')
    }
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await Promise.all([
        api.updateSetting('event_date', eventDate),
        api.updateSetting('invites_fr', invitesFr),
        api.updateSetting('invites_en', invitesEn)
      ])
      alert('Paramètres sauvegardés avec succès')
    } catch (error) {
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSavingSettings(false)
    }
  }

  const getSessionById = (sessionId) => {
    return sessions.find(s => s.id === sessionId)
  }

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.session_id === parseInt(filter))

  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const sessionId = booking.session_id
    if (!acc[sessionId]) {
      acc[sessionId] = []
    }
    acc[sessionId].push(booking)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'management', label: 'Gestion des réservations' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'settings', label: 'Paramètres' }
  ]

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Administration
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
          >
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 font-medium text-sm sm:text-base whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Gestion des sessions</h2>
            <button
              onClick={handleCreateSession}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              + Nouvelle session
            </button>
          </div>

          {/* Vue mobile - Cards */}
          <div className="block sm:hidden space-y-3 mb-6">
            {sessions.map(session => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{session.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {session.available_slots}/{session.total_slots}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {new Date(session.start_time).toLocaleString('fr-FR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </p>
                <button
                  onClick={() => handleEditSession(session)}
                  className="text-blue-600 hover:text-blue-900 font-medium text-sm w-full text-center py-2 border border-blue-600 rounded"
                >
                  Modifier
                </button>
              </div>
            ))}
          </div>

          {/* Vue desktop - Table */}
          <div className="hidden sm:block overflow-x-auto mb-6">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Heure</th>
                  <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Places</th>
                  <th className="px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map(session => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-3 lg:px-4 py-3 text-xs sm:text-sm font-medium text-gray-900">{session.name}</td>
                    <td className="px-3 lg:px-4 py-3 text-xs sm:text-sm text-gray-600">
                      {new Date(session.start_time).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs sm:text-sm text-gray-600">
                      {session.available_slots} / {session.total_slots}
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs sm:text-sm text-right">
                      <button
                        onClick={() => handleEditSession(session)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Paramètres</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label htmlFor="invites_fr" className="block text-sm font-medium text-gray-700 mb-2">
                Texte d'invitation (Français)
              </label>
              <input
                type="text"
                id="invites_fr"
                value={invitesFr}
                onChange={(e) => setInvitesFr(e.target.value)}
                placeholder="Ex: Vous invite à sa première chasse aux loups-garous !"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="invites_en" className="block text-sm font-medium text-gray-700 mb-2">
                Texte d'invitation (Anglais)
              </label>
              <input
                type="text"
                id="invites_en"
                value={invitesEn}
                onChange={(e) => setInvitesEn(e.target.value)}
                placeholder="Ex: Invites you to his first Werewolf hunt!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                Date de l'événement
              </label>
              <input
                type="text"
                id="event_date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="Ex: Dimanche 12 Octobre"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base disabled:bg-gray-400"
            >
              {savingSettings ? 'Sauvegarde en cours...' : 'Sauvegarder les paramètres'}
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold mb-4">Statistiques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded">
              <div className="text-xl sm:text-2xl font-bold text-blue-900">{bookings.length}</div>
              <div className="text-sm sm:text-base text-blue-700">Réservations totales</div>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded">
              <div className="text-xl sm:text-2xl font-bold text-green-900">{sessions.length}</div>
              <div className="text-sm sm:text-base text-green-700">Sessions actives</div>
            </div>
            <div className="bg-purple-50 p-3 sm:p-4 rounded">
              <div className="text-xl sm:text-2xl font-bold text-purple-900">
                {sessions.reduce((acc, s) => acc + s.available_slots, 0)}
              </div>
              <div className="text-sm sm:text-base text-purple-700">Places disponibles</div>
            </div>
          </div>
        </div>
      )}

      {/* Management Tab */}
      {activeTab === 'management' && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par session
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto sm:min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">Toutes les sessions</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          {Object.keys(groupedBookings).length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center text-gray-500">
              Aucune réservation trouvée
            </div>
          ) : (
            Object.entries(groupedBookings).map(([sessionId, sessionBookings]) => {
              const session = getSessionById(parseInt(sessionId))
              return (
                <div key={sessionId} className="mb-6 sm:mb-8">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {session?.name || `Session #${sessionId}`}
                      </h3>
                      {session && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {new Date(session.start_time).toLocaleString('fr-FR', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })} - {sessionBookings.length} réservation(s) - {session.available_slots} places restantes
                        </p>
                      )}
                    </div>

                    {/* Vue mobile - Cards */}
                    <div className="block sm:hidden divide-y divide-gray-200">
                      {sessionBookings.map(booking => (
                        <div key={booking.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 text-sm">#{booking.id} - {booking.name}</p>
                                {booking.is_waitlist === 1 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                    Liste d'attente
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{booking.email}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {booking.party_size || 1} personne{(booking.party_size || 1) > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            {new Date(booking.created_at).toLocaleString('fr-FR', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="flex-1 text-blue-600 hover:text-blue-900 font-medium text-sm py-2 border border-blue-600 rounded"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(booking.id, booking.session_id)}
                              className="flex-1 text-red-600 hover:text-red-900 font-medium text-sm py-2 border border-red-600 rounded"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Vue desktop - Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              ID
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Nom
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Email
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Personnes
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sessionBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-900">
                                #{booking.id}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                <div className="flex items-center gap-2">
                                  <span>{booking.name}</span>
                                  {booking.is_waitlist === 1 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                      Liste d'attente
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-600">
                                {booking.email}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-600">
                                {booking.party_size || 1}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-600">
                                {new Date(booking.created_at).toLocaleString('fr-FR', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-right">
                                <button
                                  onClick={() => handleEditBooking(booking)}
                                  className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDelete(booking.id, booking.session_id)}
                                  className="text-red-600 hover:text-red-900 font-medium"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {showModal && (
        <SessionModal
          session={editingSession}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSession}
        />
      )}

      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Modifier la réservation #{editingBooking.id}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Nom: {editingBooking.name}</p>
              <p className="text-sm text-gray-600 mb-3">Email: {editingBooking.email}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="edit_party_size" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de personnes
              </label>
              <select
                id="edit_party_size"
                value={editPartySize}
                onChange={(e) => setEditPartySize(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} personne{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingBooking(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
