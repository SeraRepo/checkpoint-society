import { useState, useEffect } from 'react'

function SessionModal({ session, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    total_slots: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      // Edit mode - populate form
      setFormData({
        name: session.name,
        start_time: new Date(session.start_time).toISOString().slice(0, 16),
        end_time: new Date(session.end_time).toISOString().slice(0, 16),
        total_slots: session.total_slots
      })
    } else {
      // Create mode - empty form
      setFormData({
        name: '',
        start_time: '',
        end_time: '',
        total_slots: ''
      })
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.name || !formData.start_time || !formData.end_time || !formData.total_slots) {
      setError('Tous les champs sont obligatoires')
      setLoading(false)
      return
    }

    if (parseInt(formData.total_slots) <= 0) {
      setError('Le nombre de places doit être supérieur à 0')
      setLoading(false)
      return
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      setError('L\'heure de fin doit être après l\'heure de début')
      setLoading(false)
      return
    }

    try {
      const sessionData = {
        name: formData.name,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        total_slots: parseInt(formData.total_slots)
      }

      await onSave(sessionData, session?.id)
      onClose()
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {session ? 'Modifier la session' : 'Créer une session'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la session *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Session du soir - 18h00"
            />
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de début *
            </label>
            <input
              type="datetime-local"
              id="start_time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de fin *
            </label>
            <input
              type="datetime-local"
              id="end_time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="total_slots" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de places *
            </label>
            <input
              type="number"
              id="total_slots"
              min="1"
              value={formData.total_slots}
              onChange={(e) => setFormData({ ...formData, total_slots: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm sm:text-base"
            >
              {loading ? 'Enregistrement...' : session ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SessionModal
