import { useLanguage } from '../contexts/LanguageContext'

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-1 py-0.5 rounded text-lg transition-all ${
          language === 'fr'
            ? 'opacity-100 scale-110'
            : 'opacity-40 hover:opacity-70'
        }`}
        title="Français"
      >
        🇫🇷
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-1 py-0.5 rounded text-lg transition-all ${
          language === 'en'
            ? 'opacity-100 scale-110'
            : 'opacity-40 hover:opacity-70'
        }`}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  )
}

export default LanguageSwitcher
