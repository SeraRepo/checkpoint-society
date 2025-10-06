import { useState, useEffect } from 'react'
import SessionList from '../components/SessionList'
import BookingForm from '../components/BookingForm'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../locales/translations'
import api from '../services/api'

function HomePage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [eventDate, setEventDate] = useState('Placeholder dates')
  const [invitesText, setInvitesText] = useState('')

  useEffect(() => {
    loadSessions()
    loadSettings()
  }, [])

  const loadSessions = async () => {
    try {
      const data = await api.getSessions()
      setSessions(data)
    } catch (error) {
      console.error('Erreur chargement sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings()
      if (settings.event_date) {
        setEventDate(settings.event_date)
      }
      // Charger le texte d'invitation selon la langue
      const inviteKey = language === 'fr' ? 'invites_fr' : 'invites_en'
      if (settings[inviteKey]) {
        setInvitesText(settings[inviteKey])
      }
    } catch (error) {
      console.error('Erreur chargement settings:', error)
    }
  }

  // Recharger les settings quand la langue change
  useEffect(() => {
    loadSettings()
  }, [language])

  const handleBookingSuccess = () => {
    setSelectedSession(null)
    loadSessions()
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Image de fond WWF */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <object
          data="/wwf.svg"
          type="image/svg+xml"
          className="w-[90%] sm:w-[60%] max-w-3xl object-contain"
          aria-label="WWF Background"
        />
      </div>

      {/* Drapeaux en haut à droite */}
      <div className="absolute top-6 right-4 sm:top-8 sm:right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 max-w-2xl flex-1 relative z-10 flex flex-col py-0">
        {/* Logo blason */}
        <div className="text-center pt-6">
          <object
            data="/blason2.svg"
            type="image/svg+xml"
            className="blason w-[70vw] sm:w-[35vw] lg:w-[30vw] max-w-sm mx-auto"
            style={{ height: '300px', objectFit: 'contain', objectPosition: 'top' }}
            aria-label="Blason"
          />
        </div>

        {/* Textes avec hiérarchie */}
        <div className="text-center font-kings space-y-2 -mt-16">
          <p className="text-white text-2xl sm:text-3xl">
            {invitesText || t.booking.invites}
          </p>
          <p className="text-4xl sm:text-5xl font-bold" style={{ color: '#FFD700' }}>
            {eventDate}
          </p>
          <p className="text-white text-2xl sm:text-3xl">
            {t.booking.location}
          </p>
          <p className="text-xl sm:text-2xl" style={{ color: '#FFD700' }}>
            {t.booking.appointment}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          </div>
        ) : selectedSession ? (
          <BookingForm
            session={selectedSession}
            onCancel={() => setSelectedSession(null)}
            onSuccess={handleBookingSuccess}
          />
        ) : (
          <SessionList
            sessions={sessions}
            onSelectSession={setSelectedSession}
          />
        )}
      </div>

      {/* Logo rond en bas */}
      <footer className="flex justify-center relative z-10 mt-12 pb-6">
        <object
          data="/rond.svg"
          type="image/svg+xml"
          className="rond w-[70vw] sm:w-[35vw] lg:w-[30vw] max-w-sm mx-auto rounded-full aspect-square"
          aria-label="Logo"
        />
      </footer>
    </div>
  )
}

export default HomePage
