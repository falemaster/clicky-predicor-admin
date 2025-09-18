# Predicor - Plateforme d'Évaluation des Risques d'Entreprise

## 📋 Description

Predicor est une plateforme SaaS complète d'analyse prédictive pour évaluer la santé financière et les risques de défaillance de vos clients et fournisseurs. L'application propose des analyses détaillées, des scores de risque et des recommandations personnalisées.

## 🚀 Fonctionnalités

### 🔍 Étude Complète d'Entreprise
- **Identité** : Informations légales, dirigeants, actionnariat
- **Analyse Financière** : Bilans, ratios, évolution du CA
- **Évaluation Commerciale** : Portefeuille clients, analyse sectorielle
- **Conformité Juridique** : Procédures, conformité réglementaire
- **Matrice des Risques** : Évaluation multi-critères
- **Synthèse & Recommandations** : Plan d'actions personnalisé

### 📊 Analyse Prédictive
- Score de défaillance sur 10
- Probabilité de défaillance à 12 mois
- Projections et scénarios
- Alertes automatiques
- Surveillance continue

### 🎨 Interface Utilisateur
- Design moderne et responsive
- Navigation par onglets intuitive
- Visualisations interactives
- Exports PDF et Excel

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS + Shadcn/ui
- **Routing** : React Router
- **State Management** : TanStack Query
- **Icons** : Lucide React
- **Forms** : React Hook Form + Zod

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone [votre-repo]
   cd predicor-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Ouvrir** http://localhost:5173 dans votre navigateur

## 🏗️ Structure du Projet

```
predicor-app/
├── src/
│   ├── components/
│   │   ├── ui/              # Composants UI réutilisables
│   │   ├── predictive/      # Analyse prédictive
│   │   └── study/           # Étude complète
│   ├── pages/               # Pages principales
│   ├── hooks/               # Hooks personnalisés
│   ├── lib/                 # Utilitaires
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── public/                  # Assets statiques
├── package.json
├── tailwind.config.ts      # Configuration Tailwind
├── vite.config.ts          # Configuration Vite
└── tsconfig.json          # Configuration TypeScript
```

## 🎯 Pages & Composants Principaux

### 🏠 Page d'Accueil (`/`)
- Hero section avec présentation
- Aperçu des fonctionnalités
- Section démo interactive
- Call-to-action

### 📊 Analyse Prédictive
Composant : `PredictiveAnalysis.tsx`
- Score de risque principal
- Onglets : Vue d'ensemble, Financier, Commercial, Prédictif
- Indicateurs clés de performance
- Projections et recommandations

### 📋 Étude Avancée
Composant : `AdvancedStudy.tsx`
- 6 onglets d'analyse :
  1. **Identité** : Infos générales, dirigeants, capital
  2. **Financier** : Bilans, ratios, évolution
  3. **Commercial** : Clients, secteur, performance
  4. **Juridique** : Conformité, procédures
  5. **Risques** : Matrice, signaux d'alerte
  6. **Synthèse** : Score global, plan d'actions

## 🎨 Design System

### Couleurs Principales
- **Primary** : Bleu (#2563eb)
- **Success** : Vert (#16a34a)
- **Warning** : Orange (#ea580c)
- **Destructive** : Rouge (#dc2626)

### Composants UI
- Utilisation de Shadcn/ui
- Design cohérent et accessible
- Variants personnalisés
- Animations fluides

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Aperçu du Build
```bash
npm run preview
```

### Déploiement
Le projet peut être déployé sur :
- Vercel
- Netlify
- GitHub Pages
- Serveur web classique

## 📱 Responsive Design

L'application est entièrement responsive :
- **Mobile** : Navigation optimisée, grilles adaptatives
- **Tablet** : Layout intermédiaire
- **Desktop** : Expérience complète

## 🔧 Personnalisation

### Modifier les Couleurs
Éditez `src/index.css` et `tailwind.config.ts`

### Ajouter des Composants
Utilisez la CLI Shadcn/ui :
```bash
npx shadcn-ui@latest add [component-name]
```

### Modifier les Données
Les données d'exemple sont dans les composants. Intégrez votre API dans les hooks correspondants.

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add: Amazing Feature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📞 Support

Pour toute question ou support :
- Email : support@predicor.com
- Documentation : https://docs.predicor.com
- Issues GitHub : [Lien vers les issues]