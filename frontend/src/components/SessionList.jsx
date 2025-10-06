import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../locales/translations'

function SessionList({ sessions, onSelectSession }) {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-white mb-3">
        {t.sessions.available}
      </h2>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-300 py-8">
          {t.sessions.noSessions}
        </p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            className="bg-black/40 backdrop-blur-md border-2 border-orange-500 rounded-lg shadow-lg p-4 hover:bg-black/50 transition-all"
            style={{ /* Ajustez bg-black/XX : 40 = très transparent, 60 = moins transparent */ }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {session.name}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                session.available_slots > 0
                  ? 'bg-green-500/80 text-white'
                  : 'bg-red-500/80 text-white'
              }`}>
                {session.available_slots} {t.sessions.slots}
              </span>
            </div>

            <button
              onClick={() => onSelectSession(session)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors border-2 ${
                session.available_slots > 0
                  ? 'bg-orange-600 border-orange-400 text-white hover:bg-orange-700'
                  : 'bg-orange-500/80 border-orange-400 text-white hover:bg-orange-600'
              }`}
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
