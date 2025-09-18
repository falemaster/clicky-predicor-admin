# 🚀 Guide d'Installation Complet - Predicor

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) : https://nodejs.org/
- **npm** ou **yarn** (gestionnaire de paquets)
- **Git** (optionnel, pour la gestion de version)

## 📦 Installation Étape par Étape

### 1. Préparation du Projet

```bash
# Créer un nouveau dossier pour le projet
mkdir predicor-app
cd predicor-app

# Initialiser un projet Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Ou avec yarn
yarn create vite . --template react-ts
```

### 2. Installation des Dépendances

```bash
# Installer toutes les dépendances nécessaires
npm install @hookform/resolvers@^3.10.0 \
  @radix-ui/react-accordion@^1.2.11 \
  @radix-ui/react-alert-dialog@^1.1.14 \
  @radix-ui/react-aspect-ratio@^1.1.7 \
  @radix-ui/react-avatar@^1.1.10 \
  @radix-ui/react-checkbox@^1.3.2 \
  @radix-ui/react-collapsible@^1.1.11 \
  @radix-ui/react-context-menu@^2.2.15 \
  @radix-ui/react-dialog@^1.1.14 \
  @radix-ui/react-dropdown-menu@^2.1.15 \
  @radix-ui/react-hover-card@^1.1.14 \
  @radix-ui/react-label@^2.1.7 \
  @radix-ui/react-menubar@^1.1.15 \
  @radix-ui/react-navigation-menu@^1.2.13 \
  @radix-ui/react-popover@^1.1.14 \
  @radix-ui/react-progress@^1.1.7 \
  @radix-ui/react-radio-group@^1.3.7 \
  @radix-ui/react-scroll-area@^1.2.9 \
  @radix-ui/react-select@^2.2.5 \
  @radix-ui/react-separator@^1.1.7 \
  @radix-ui/react-slider@^1.3.5 \
  @radix-ui/react-slot@^1.2.3 \
  @radix-ui/react-switch@^1.2.5 \
  @radix-ui/react-tabs@^1.1.12 \
  @radix-ui/react-toast@^1.2.14 \
  @radix-ui/react-toggle@^1.1.9 \
  @radix-ui/react-toggle-group@^1.1.10 \
  @radix-ui/react-tooltip@^1.2.7 \
  @tanstack/react-query@^5.83.0 \
  class-variance-authority@^0.7.1 \
  clsx@^2.1.1 \
  cmdk@^1.1.1 \
  date-fns@^3.6.0 \
  embla-carousel-react@^8.6.0 \
  input-otp@^1.4.2 \
  lucide-react@^0.462.0 \
  next-themes@^0.3.0 \
  react@^18.3.1 \
  react-day-picker@^8.10.1 \
  react-dom@^18.3.1 \
  react-hook-form@^7.61.1 \
  react-resizable-panels@^2.1.9 \
  react-router-dom@^6.30.1 \
  recharts@^2.15.4 \
  sonner@^1.7.4 \
  tailwind-merge@^2.6.0 \
  tailwindcss-animate@^1.0.7 \
  vaul@^0.9.9 \
  zod@^3.25.76

# Avec yarn
yarn add [tous les packages ci-dessus]
```

### 3. Configuration Tailwind CSS

```bash
# Installer Tailwind CSS
npm install -D tailwindcss@^3.4.4 postcss@^8.4.38 autoprefixer@^10.4.19

# Initialiser la configuration Tailwind
npx tailwindcss init -p
```

### 4. Copie des Fichiers

Copiez tous les fichiers du dossier `COMPLETE_CODE/` dans votre projet :

```
src/
├── components/
├── pages/
├── hooks/
├── lib/
├── App.tsx
├── main.tsx
└── index.css

# Fichiers de configuration à la racine :
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── components.json
├── postcss.config.js
├── eslint.config.js
├── package.json
├── index.html
└── README.md
```

### 5. Vérification de la Configuration

```bash
# Vérifier que tout compile correctement
npm run build

# Si des erreurs TypeScript apparaissent :
npm run lint
```

### 6. Lancement du Projet

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173 dans votre navigateur
```

## 🔧 Configuration des Path Aliases

Assurez-vous que `vite.config.ts` contient :

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 🎨 Configuration Tailwind

Votre `tailwind.config.ts` doit inclure :

```typescript
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // ... reste de la configuration
}
```

## 🚨 Résolution des Problèmes Courants

### Erreur : "Cannot resolve module"
```bash
# Vérifier les imports
npm install --save-dev @types/node
```

### Erreur Tailwind CSS
```bash
# Regénérer la configuration
npx tailwindcss init --full
```

### Erreur de Build
```bash
# Nettoyer les caches
rm -rf node_modules package-lock.json
npm install
```

### Erreur TypeScript
```bash
# Vérifier la configuration des paths
# Dans tsconfig.app.json, assurez-vous d'avoir :
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📱 Test sur Différents Appareils

```bash
# Pour tester sur mobile/tablet en réseau local
npm run dev -- --host 0.0.0.0
# Puis accédez via votre IP locale : http://192.168.x.x:5173
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
# Les fichiers compilés seront dans le dossier 'dist/'
```

### Aperçu du Build
```bash
npm run preview
```

### Déploiement sur Vercel
```bash
npm install -g vercel
vercel --prod
```

### Déploiement sur Netlify
```bash
npm run build
# Glissez-déposez le dossier 'dist/' sur netlify.com
```

## ✅ Checklist Finale

- [ ] Node.js installé (v18+)
- [ ] Dépendances installées sans erreur
- [ ] Configuration Tailwind opérationnelle
- [ ] Path aliases configurés
- [ ] Projet compile sans erreur (`npm run build`)
- [ ] Serveur dev fonctionne (`npm run dev`)
- [ ] Interface responsive sur mobile/desktop
- [ ] Navigation entre les pages fonctionne
- [ ] Tous les composants s'affichent correctement

## 🆘 Support

Si vous rencontrez des difficultés :

1. Vérifiez les versions des dépendances
2. Consultez les logs d'erreur dans la console
3. Assurez-vous que tous les fichiers sont bien copiés
4. Testez avec `npm run build` avant le déploiement

**Support technique :**
- Email : tech@predicor.com
- Documentation : https://docs.predicor.com
- Issues : Créez un ticket GitHub avec le log d'erreur complet