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
      <div className="bg-black/40 backdrop-blur-md border-2 rounded-md shadow-lg p-8 text-center max-w-md mx-auto" style={{ borderColor: '#FFD700' }}>
        <div className={`${isWaitlist ? 'text-orange-400' : 'text-green-400'} text-5xl mb-4`}>
          {isWaitlist ? '⏳' : '✓'}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isWaitlist ? t.booking.waitlistSuccessTitle : t.booking.successTitle}
        </h2>
        <p className="text-gray-200 mb-6">
          {isWaitlist ? t.booking.waitlistSuccessMessage : t.booking.successMessage}
        </p>

        <div className="border rounded-md p-4 mb-6" style={{ borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
          <p className="text-sm font-medium text-gray-100 mb-2">
            {language === 'fr'
              ? 'Pour modifier votre réservation, utilisez ce lien :'
              : 'To edit your booking, use this link:'}
          </p>
          <div className="bg-black/50 border rounded px-3 py-2 mb-3 break-all text-sm" style={{ borderColor: '#FFD700', color: '#FFD700' }}>
            {editUrl}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(editUrl)
              alert(language === 'fr' ? 'Lien copié !' : 'Link copied!')
            }}
            className="text-sm underline font-medium hover:opacity-80"
            style={{ color: '#FFD700' }}
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
          className="border-2 text-black px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }}
        >
          {t.booking.back}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border-2 rounded-md shadow-lg p-6 max-w-md mx-auto" style={{ borderColor: '#FFD700' }}>
      <button
        onClick={onCancel}
        className="text-white mb-4 flex items-center font-medium hover:opacity-80"
        style={{ color: '#FFD700' }}
      >
        ← {t.booking.back}
      </button>

      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {t.booking.title} : {session.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {session.available_slots < formData.party_size && (
          <div className="border rounded-md px-4 py-3" style={{ borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700' }}>
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
            className="w-full px-4 py-2 bg-white/90 border rounded-md focus:ring-2 text-gray-900"
            style={{ borderColor: '#FFD700', '--tw-ring-color': '#FFD700' }}
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
            className="w-full px-4 py-2 bg-white/90 border rounded-md focus:ring-2 text-gray-900"
            style={{ borderColor: '#FFD700', '--tw-ring-color': '#FFD700' }}
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
            className="w-full px-4 py-2 bg-white/90 border rounded-md focus:ring-2 text-gray-900"
            style={{ borderColor: '#FFD700', '--tw-ring-color': '#FFD700' }}
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
            className="w-full px-4 py-2 bg-white/90 border rounded-md focus:ring-2 text-gray-900"
            style={{ borderColor: '#FFD700', '--tw-ring-color': '#FFD700' }}
            placeholder={language === 'fr' ? '+33 6 12 34 56 78' : '+1 234 567 8900'}
          />
        </div>

        {error && (
          <div className="border rounded-md px-4 py-3" style={{ borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 text-black py-3 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }}
        >
          {loading ? t.booking.submitting : t.booking.confirmButton}
        </button>
      </form>
    </div>
  )
}

export default BookingForm
