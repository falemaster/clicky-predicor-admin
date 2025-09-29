# Architecture de la page de résultats

## Synchronisation entre vue utilisateur et vue admin

### Problème résolu
La page de résultats d'entreprise était dupliquée entre :
- `src/pages/Analysis.tsx` (vue utilisateur)  
- `src/components/admin/CompanyWYSIWYGEditor.tsx` (vue admin)

Cette duplication causait des désynchronisations constantes lors des modifications.

### Solution implémentée

#### 1. Composant partagé unique
- **`src/components/result/ResultPage.tsx`** : Source unique de vérité pour l'UI des résultats
- Mode `user` : Affichage en lecture seule
- Mode `admin` : Mêmes onglets avec capacités d'édition

#### 2. Configuration centralisée
- **`src/components/result/resultTabs.ts`** : Définition des onglets validés
  - "Vue d'ensemble"
  - "Étude approfondie" 
  - "Analyse prédictive"

#### 3. Mapping des données unifié
- **`src/utils/buildCompanyDisplay.ts`** : Fonction unique de transformation API → affichage
- Évite la duplication de logique entre les deux vues

### Règles strictes

⚠️ **INTERDICTIONS**
- NE JAMAIS modifier l'UI dans `Analysis.tsx` ou `CompanyWYSIWYGEditor.tsx`
- NE JAMAIS ajouter d'onglets directement dans les wrappers
- NE JAMAIS dupliquer le mapping de données

✅ **BONNES PRATIQUES**
- Toute modification d'UI → `ResultPage.tsx`
- Tout nouvel onglet → `resultTabs.ts` 
- Toute logique de mapping → `buildCompanyDisplay.ts`

### Usage

#### Vue utilisateur (`Analysis.tsx`)
```tsx
<ResultPage
  mode="user"
  companyData={companyData}
  scores={scores}
  enrichedData={enrichedData}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### Vue admin (`CompanyWYSIWYGEditor.tsx`)
```tsx
<ResultPage
  mode="admin"
  companyData={companyData}
  scores={scores}
  enrichedData={enrichedData}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  onEdit={updateField}
/>
```

### Vérifications de cohérence

1. **Import partagé** : Les deux vues importent `RESULT_TABS` depuis le même fichier
2. **Builder unique** : Les deux vues utilisent `buildCompanyDisplay()` 
3. **Commentaires de garde** : Rappels dans chaque wrapper pour éviter les modifications directes

Cette architecture garantit que toute évolution de la page de résultats sera automatiquement synchronisée entre les deux vues.