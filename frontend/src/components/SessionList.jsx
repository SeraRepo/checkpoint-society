import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../locales/translations'

function SessionList({ sessions, onSelectSession }) {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="max-w-md mx-auto space-y-4">
      {sessions.length === 0 ? (
        <p className="text-center text-gray-300 py-8">
          {t.sessions.noSessions}
        </p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            className="bg-black/30 backdrop-blur-sm border-2 rounded-md shadow-lg p-4 hover:bg-black/40 transition-all"
            style={{ borderColor: '#FFD700' }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">
                {session.name}
              </h3>
              <span className="text-sm text-gray-300">
                {session.available_slots} {t.sessions.slots}
              </span>
            </div>

            <button
              onClick={() => onSelectSession(session)}
              className="w-full py-2 px-4 rounded-md font-medium transition-colors border-2 text-white hover:opacity-90"
              style={{
                backgroundColor: session.available_slots > 0 ? '#FFD700' : '#B8860B',
                borderColor: '#FFD700',
                color: '#000'
              }}
            >
              {session.available_slots > 0 ? t.sessions.reserve : t.sessions.waitlist}
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default SessionList
