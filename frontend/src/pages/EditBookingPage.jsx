import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../locales/translations'
import api from '../services/api'
import LanguageSwitcher from '../components/LanguageSwitcher'

function EditBookingPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = useTranslation(language)

  const [booking, setBooking] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    party_size: 1
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadBooking()
  }, [token])

  const loadBooking = async () => {
    try {
      const data = await api.getBookingByToken(token)
      setBooking(data)
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        party_size: data.party_size || 1
      })
    } catch (err) {
      setError(err.message || 'Réservation non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.updateBookingByToken(token, formData)
      setSuccess(true)
      // Reload booking to get updated available slots
      await loadBooking()
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Réservation introuvable' : 'Booking not found'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/werewolfhunt')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Réservation modifiée' : 'Booking updated'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'fr'
              ? 'Votre réservation a été modifiée avec succès.'
              : 'Your booking has been updated successfully.'}
          </p>
          <button
            onClick={() => navigate('/werewolfhunt')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl flex-1">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'fr' ? 'Modifier ma réservation' : 'Edit my booking'}
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'fr' ? 'Détails de la session' : 'Session details'}
            </h3>
            <p className="text-gray-700">{booking.session_name}</p>
            <p className="text-sm text-gray-600">
              {new Date(booking.start_time).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t.booking.fullName} {t.booking.required}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="party_size" className="block text-sm font-medium text-gray-700 mb-1">
                {t.booking.partySize} {t.booking.required}
              </label>
              <select
                id="party_size"
                required
                value={formData.party_size}
                onChange={(e) => setFormData({ ...formData, party_size: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? (language === 'fr' ? 'personne' : 'person') : (language === 'fr' ? 'personnes' : 'people')}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'fr'
                  ? `${booking.available_slots} place(s) disponible(s) dans la session`
                  : `${booking.available_slots} slot(s) available in session`}
              </p>
              {formData.party_size > booking.available_slots + (booking.party_size || 1) && (
                <p className="text-sm text-orange-600 mt-1">
                  ⚠️ {language === 'fr'
                    ? 'Vous serez placé sur liste d\'attente'
                    : 'You will be added to the waitlist'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.booking.email} {t.booking.required}
              </label>
              <input
                type="email"
                id="email"
                required
                pattern="[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title={language === 'fr' ? 'Entrez une adresse email valide (ex: nom@exemple.com)' : 'Enter a valid email address (e.g., name@example.com)'}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t.booking.phone} {t.booking.required}
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/werewolfhunt')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {saving ? (language === 'fr' ? 'Enregistrement...' : 'Saving...') : (language === 'fr' ? 'Enregistrer' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditBookingPage
