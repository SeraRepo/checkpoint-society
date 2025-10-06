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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25" style={{ /* Ajustez opacity-XX : 25 = 25% visible, 40 = plus visible */ }}>
        <object
          data="/wwf.svg"
          type="image/svg+xml"
          className="w-[90%] sm:w-[60%] max-w-3xl object-contain"
          aria-label="WWF Background"
        />
      </div>

      <div className="container mx-auto px-4 py-2 sm:py-4 max-w-2xl flex-1 relative z-10">
        {/* Logo et textes placeholder */}
        <div className="text-center mb-2 sm:mb-3">
          <div className="mb-1 flex justify-center relative">
            <object
              data="/blason.svg"
              type="image/svg+xml"
              className="blason w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] max-w-md max-h-md"
              aria-label="Blason"
              style={{ /* Ajustez ces valeurs : w-[XXvw] = XX% de largeur écran */ }}
            />
            <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="space-y-0.5 text-gray-300 text-sm sm:text-base mb-2">
            <p>{invitesText || t.booking.invites}</p>
            <p>{eventDate}</p>
            <p>{t.booking.location}</p>
            <p>{t.booking.appointment}</p>
          </div>
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
      <footer className="py-2 flex justify-center relative z-10">
        <object
          data="/rond.svg"
          type="image/svg+xml"
          className="rond w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] max-w-md max-h-md rounded-full"
          aria-label="Logo"
          style={{ /* Ajustez ces valeurs : w-[XXvw] = XX% de largeur écran */ }}
        />
      </footer>
    </div>
  )
}

export default HomePage
