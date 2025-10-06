import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../locales/translations'
import api from '../services/api'

function BookingForm({ session, onCancel, onSuccess }) {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    party_size: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [bookingToken, setBookingToken] = useState('')
  const [isWaitlist, setIsWaitlist] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const booking = await api.createBooking({
        session_id: session.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        party_size: formData.party_size
      })
      setBookingToken(booking.token)
      setIsWaitlist(booking.is_waitlist === 1)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const editUrl = `${window.location.origin}/booking/${bookingToken}`

    return (
      <div className="bg-black/40 backdrop-blur-md border-2 border-orange-500 rounded-lg shadow-lg p-8 text-center" style={{ /* Ajustez bg-black/XX : 40 = très transparent */ }}>
        <div className={`${isWaitlist ? 'text-orange-400' : 'text-green-400'} text-5xl mb-4`}>
          {isWaitlist ? '⏳' : '✓'}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isWaitlist ? t.booking.waitlistSuccessTitle : t.booking.successTitle}
        </h2>
        <p className="text-gray-200 mb-6">
          {isWaitlist ? t.booking.waitlistSuccessMessage : t.booking.successMessage}
        </p>

        <div className="bg-orange-900/40 border border-orange-400 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-100 mb-2">
            {language === 'fr'
              ? 'Pour modifier votre réservation, utilisez ce lien :'
              : 'To edit your booking, use this link:'}
          </p>
          <div className="bg-black/50 border border-orange-400 rounded px-3 py-2 mb-3 break-all text-sm text-orange-300">
            {editUrl}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(editUrl)
              alert(language === 'fr' ? 'Lien copié !' : 'Link copied!')
            }}
            className="text-sm text-orange-300 hover:text-orange-200 underline font-medium"
          >
            {language === 'fr' ? '📋 Copier le lien' : '📋 Copy link'}
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-6">
          {language === 'fr'
            ? 'Conservez ce lien précieusement, il vous permettra de modifier votre réservation.'
            : 'Keep this link safe, it will allow you to edit your booking.'}
        </p>

        <button
          onClick={onCancel}
          className="bg-orange-600 border-2 border-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          {t.booking.back}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border-2 border-orange-500 rounded-lg shadow-lg p-6" style={{ /* Ajustez bg-black/XX : 40 = très transparent */ }}>
      <button
        onClick={onCancel}
        className="text-white hover:text-orange-300 mb-4 flex items-center font-medium"
      >
        ← {t.booking.back}
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">
        {t.booking.title} : {session.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {session.available_slots < formData.party_size && (
          <div className="bg-orange-900/40 border border-orange-400 text-orange-200 px-4 py-3 rounded-lg">
            ⚠️ {t.booking.waitlistWarning}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
            {t.booking.fullName} {t.booking.required}
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-white/90 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            placeholder={language === 'fr' ? 'Jean Dupont' : 'John Doe'}
          />
        </div>

        <div>
          <label htmlFor="party_size" className="block text-sm font-medium text-white mb-1">
            {t.booking.partySize} {t.booking.required}
          </label>
          <select
            id="party_size"
            required
            value={formData.party_size}
            onChange={(e) => setFormData({ ...formData, party_size: parseInt(e.target.value) })}
            className="w-full px-4 py-2 bg-white/90 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? (language === 'fr' ? 'personne' : 'person') : (language === 'fr' ? 'personnes' : 'people')}
              </option>
            ))}
          </select>
          {session.available_slots > 0 && (
            <p className="text-sm text-gray-300 mt-1">
              {language === 'fr'
                ? `${session.available_slots} place(s) disponible(s)`
                : `${session.available_slots} slot(s) available`}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
            {t.booking.email} {t.booking.required}
          </label>
          <input
            type="email"
            id="email"
            required
            pattern="[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-white/90 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            placeholder={language === 'fr' ? 'jean.dupont@example.com' : 'john.doe@example.com'}
            title={language === 'fr' ? 'Entrez une adresse email valide (ex: nom@exemple.com)' : 'Enter a valid email address (e.g., name@example.com)'}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
            {t.booking.phone} {t.booking.required}
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-white/90 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            placeholder={language === 'fr' ? '+33 6 12 34 56 78' : '+1 234 567 8900'}
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-400 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 border-2 border-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-600 disabled:border-gray-500 transition-colors"
        >
          {loading ? t.booking.submitting : t.booking.confirmButton}
        </button>
      </form>
    </div>
  )
}

export default BookingForm
