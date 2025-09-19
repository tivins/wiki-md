# WikiMD - Gestionnaire de notes de cours

Une application locale moderne pour gérer ses notes de cours en format Markdown avec prévisualisation en temps réel.

## 🚀 Fonctionnalités

- **Édition Markdown** avec prévisualisation en temps réel
- **Gestion complète des notes** : créer, modifier, supprimer, afficher
- **Organisation avancée** : catégories, tags, statuts
- **Filtrage et recherche** : par catégorie, tag, statut, ou texte
- **Design responsive** : optimisé pour mobile, tablet et desktop
- **Interface moderne** : stylisée avec Tailwind CSS

## 🛠️ Technologies

### Backend
- **Node.js** avec Express
- **SQLite** base de données locale
- **API REST** complète

### Frontend
- **React 18** avec hooks
- **Tailwind CSS** pour le styling
- **React Markdown** pour le rendu
- **Axios** pour les appels API

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd wikimd
```

2. **Installer les dépendances**
```bash
npm run install-all
```

3. **Configuration**
   - Aucune configuration de base de données requise
   - SQLite se configure automatiquement
   - Optionnel : créer un fichier `.env` dans le dossier `server/` :
```env
PORT=5000
```

4. **Démarrer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

**Avantages de SQLite :**
- ✅ Aucune installation de serveur de base de données requise
- ✅ Base de données locale et portable
- ✅ Démarrage instantané
- ✅ Parfait pour les applications de notes personnelles

## 🎯 Utilisation

### Créer une note
1. Cliquer sur "Nouvelle note" dans l'en-tête
2. Remplir le titre, catégorie, tags et statut
3. Écrire le contenu en Markdown
4. Utiliser le bouton "Aperçu" pour voir le rendu
5. Sauvegarder

### Modifier une note
1. Sélectionner une note dans la liste
2. Cliquer sur "Modifier"
3. Apporter les modifications
4. Sauvegarder

### Filtrer les notes
- Utiliser la barre de filtres dans la sidebar
- Filtrer par catégorie, statut, tag
- Rechercher dans le contenu des notes

## 📝 Format Markdown supporté

- **Titres** : `# H1`, `## H2`, `### H3`
- **Texte** : *italique*, **gras**, ~~barré~~
- **Listes** : à puces et numérotées
- **Code** : `code inline` et blocs de code
- **Citations** : `> citation`
- **Liens** : `[texte](url)`
- **Images** : `![alt](url)`

## 🎨 Personnalisation

Le design utilise Tailwind CSS et peut être facilement personnalisé en modifiant :
- `client/tailwind.config.js` pour la configuration
- `client/src/index.css` pour les styles personnalisés

## 📱 Responsive Design

L'application s'adapte automatiquement à :
- **Mobile** : interface optimisée pour les petits écrans
- **Tablet** : mise en page adaptée
- **Desktop** : interface complète avec sidebar

## 🔧 Scripts disponibles

```bash
# Démarrer l'application complète
npm start

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Installer toutes les dépendances
npm run install-all
```

## 📄 Structure du projet

```
wikimd/
├── client/                 # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── services/       # Services API
│   │   └── ...
│   └── public/
├── server/                 # API Node.js
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes Express
│   └── ...
└── package.json           # Configuration principale
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
