# Bar Event - Système de Réservation

Application web de réservation pour événements dans un bar, optimisée pour mobile et accessible via QR code.

## 📋 Fonctionnalités

- 📱 Interface mobile-first accessible via QR code
- 📅 Affichage des sessions disponibles avec horaires
- 🎫 Système de réservation de créneaux
- ✅ Validation des réservations (nom, email)
- 🔄 Mise à jour en temps réel des places disponibles

## 🛠️ Stack Technique

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (API calls)

**Backend:**
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Architecture REST API

## 📁 Structure du Projet

```
wwf/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   └── services/      # Services API
│   ├── package.json
│   └── vite.config.js
│
└── backend/               # API Express
    ├── src/
    │   ├── routes/        # Routes API
    │   ├── controllers/   # Logique métier
    │   └── models/        # Modèles de données
    ├── scripts/           # Scripts utilitaires
    ├── database/          # Base de données SQLite
    ├── package.json
    └── server.js
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

### Installation du Backend

```bash
cd backend
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Initialiser la base de données avec des données de test
npm run init-db

# Démarrer le serveur en mode développement
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### Installation du Frontend

```bash
cd frontend
npm install

# Copier le fichier d'environnement (optionnel)
cp .env.example .env

# Démarrer l'application en mode développement
npm run dev
```

L'application frontend sera accessible sur `http://localhost:3000`

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Sessions

- `GET /api/sessions` - Récupérer toutes les sessions
- `GET /api/sessions/:id` - Récupérer une session par ID
- `POST /api/sessions` - Créer une nouvelle session

### Réservations

- `GET /api/bookings` - Récupérer toutes les réservations
- `POST /api/bookings` - Créer une nouvelle réservation

### Exemple de requête POST /api/bookings

```json
{
  "session_id": 1,
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com"
}
```

## 🗄️ Schéma de Base de Données

### Table `sessions`

| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Nom de la session |
| start_time | TEXT | Date/heure de début (ISO) |
| end_time | TEXT | Date/heure de fin (ISO) |
| total_slots | INTEGER | Nombre total de places |
| available_slots | INTEGER | Places disponibles |
| created_at | TEXT | Date de création |

### Table `bookings`

| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| session_id | INTEGER | Foreign key vers sessions |
| name | TEXT | Nom du participant |
| email | TEXT | Email du participant |
| created_at | TEXT | Date de création |

## 📱 Utilisation Mobile

1. Générer un QR code pointant vers l'URL de l'application (ex: `http://votredomaine.com`)
2. Les utilisateurs scannent le QR code avec leur smartphone
3. L'interface mobile-first s'affiche automatiquement
4. Sélection de session et réservation en quelques clics

## 🏗️ Build pour Production

### Frontend

```bash
cd frontend
npm run build
```

Les fichiers de production seront dans le dossier `frontend/dist/`

### Backend

Le backend peut être déployé tel quel. Assurez-vous de:
- Configurer les variables d'environnement
- Créer la base de données avec `npm run init-db`
- Utiliser un process manager comme PM2 pour la production

## 📝 Scripts Disponibles

### Backend

- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer en mode développement (avec nodemon)
- `npm run init-db` - Initialiser la base de données avec des données de test

### Frontend

- `npm run dev` - Démarrer en mode développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build de production

## 🔐 Sécurité

- Validation des emails côté backend
- Protection CORS configurée
- Vérification des places disponibles avant réservation
- Foreign keys activées sur SQLite

## 📄 Licence

ISC
