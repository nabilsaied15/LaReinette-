# Tests automatisés — La Reinette

Documentation complète de la suite de tests du site **La Reinette** (ASAD Bourg-la-Reine).

## Objectif

Garantir la fiabilité des fonctionnalités critiques du site :

- Formulaires (contact, réservation, inscription)
- Envoi d’e-mails (EmailJS, FormSubmit)
- Tarifs et horaires de transport
- Administration et sécurité des routes
- Chatbot (réponses de secours)
- Données métier (motifs contact, pièces justificatives)

---

## Prérequis

- **Node.js** 18 ou plus récent
- Dépendances installées : `npm install`

Outils utilisés :

| Outil | Rôle |
|-------|------|
| [Vitest](https://vitest.dev/) 4.x | Lanceur de tests |
| [React Testing Library](https://testing-library.com/react) | Tests de composants React |
| [jsdom](https://github.com/jsdom/jsdom) **24.x** | Environnement DOM pour les pages/composants |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Matchers (`toBeInTheDocument`, etc.) |

> **Note Windows :** jsdom 27 provoque une erreur `ERR_REQUIRE_ESM`. Le projet utilise **jsdom 24.1.3** (voir `package.json`).

---

## Commandes

```bash
# Lancer tous les tests une fois (CI / validation)
npm test

# Mode développement : relance à chaque modification
npm run test:watch

# Rapport de couverture (dossier coverage/ à la racine)
npm run test:coverage
```

**Résultat attendu :**

```
Test Files  15 passed (15)
Tests       66 passed (66)
```

---

## Organisation du projet

Le code source reste dans `src/`. Tous les tests sont centralisés dans `test/`.

```
LaReinette-/
├── src/                          # Code de l’application
│   ├── data/                     # Données métier (motifs, documents)
│   ├── utils/                    # Logique pure (e-mails, tarifs, validation…)
│   ├── pages/                    # Pages React
│   ├── components/               # Composants React
│   └── context/                  # Contexte global (settings, admin)
│
├── test/                         # ← Tous les tests ici
│   ├── README.md                 # Ce fichier
│   ├── setup.js                  # Config globale Vitest
│   ├── helpers.jsx               # Utilitaires de rendu (router, mocks)
│   ├── data/
│   ├── utils/
│   ├── components/
│   └── pages/
│
├── vitest.config.js              # Configuration Vitest
└── package.json                  # Scripts test / test:watch / test:coverage
```

### Imports dans les tests

Les tests importent le code source avec des chemins relatifs :

```javascript
import { validateContactForm } from '../../src/utils/contactValidation.js';
```

---

## Configuration Vitest (`vitest.config.js`)

| Option | Valeur | Explication |
|--------|--------|-------------|
| `environment` | `node` | Par défaut : tests rapides sans DOM |
| `environmentMatchGlobs` | `test/pages/**`, `test/components/**` → `jsdom` | DOM pour React |
| `pool` | `threads` | Meilleure compatibilité Windows |
| `setupFiles` | `test/setup.js` | jest-dom, `matchMedia`, `scrollTo` |
| `include` | `test/**/*.{test,spec}.{js,jsx}` | Fichiers de test |

---

## Fichiers utilitaires (`test/setup.js`, `test/helpers.jsx`)

### `setup.js`

- Active **@testing-library/jest-dom**
- Mock `window.scrollTo` et `matchMedia` (Framer Motion, responsive)

### `helpers.jsx`

| Export | Usage |
|--------|--------|
| `mockSettings` | Paramètres site fictifs (contact, EmailJS) |
| `renderWithRouter(ui, { route })` | Rendu avec `MemoryRouter` pour les pages |

---

## Détail des fichiers de test

### `test/data/` — Données métier

#### `contactSubjects.test.js` (6 tests)

| Test | Vérifie |
|------|---------|
| Motifs attendus | 5 motifs dont `transport-tarifs`, `reservation`, `inscription` |
| Guides par motif | Chaque motif a un guide avec des puces |
| Modèle tarifs | Message prérempli avec « Bonjour », puces, clôture |
| Zone dans le modèle | Injection `?zone=Paris` dans le texte tarifs |
| Motif vide / autre | Chaîne vide pour `autre` ou motif inconnu |
| Libellé sujet | Libellés corrects + « Autre » personnalisé |

**Source :** `src/data/contactSubjects.js`

#### `registrationRequiredDocuments.test.js` (3 tests)

| Test | Vérifie |
|------|---------|
| Pièces obligatoires | Liste ≥ 4 éléments, justificatif de domicile |
| Pièces 60–69 ans | Présence notification APA |
| Lignes PDF | Format `- …`, séparateur, sous-titre « 60 à 69 ans » |

**Source :** `src/data/registrationRequiredDocuments.js`

---

### `test/utils/` — Logique métier

#### `contactValidation.test.js` (6 tests)

| Fonction | Vérifie |
|----------|---------|
| `validateContactForm` | Formulaire valide / erreurs nom, email, téléphone, motif, message |
| `validateContactForm` | Motif `autre` → `subjectOther` obligatoire |
| `isContactSpam` | Honeypot rempli, envoi &lt; 3 s, envoi normal autorisé |

**Source :** `src/utils/contactValidation.js` — utilisé par **Contact** et **Booking**

#### `bookingValidation.test.js` (9 tests)

| Fonction | Vérifie |
|----------|---------|
| `validateEmail` | Email valide / invalide |
| `validatePhone` | 10 chiffres |
| `validateSocialSecurity` | 15 chiffres |
| `isOutOfHours` | Plage 08h00–19h00 |
| `isWeekendDate` | Samedi / dimanche refusés |
| `areAddressesIdentical` | Départ = destination |
| `validateTripSchedule` | Ordre prise en charge / RDV / retour |
| `validateRegistrationSubStep` | Étapes 0, 1, 5 de l’inscription |
| `computeReturnPickupTime` | Calcul heure retour (30 min, 1h, 1h30) |

**Source :** `src/utils/bookingValidation.js` — utilisé par **Booking**

#### `transportPricing.test.js` (5 tests)

| Cas | Tarif attendu |
|-----|----------------|
| Adresses vides | 0 € |
| BLR → BLR aller simple | 5 € |
| BLR → BLR aller-retour | 10 € |
| Hôpital / Clamart aller simple | 10 € |
| Communes voisines aller-retour | 16 € |

**Source :** `src/utils/transportPricing.js` — utilisé par **Booking**

#### `newsletterEmail.test.js` (6 tests)

| Fonction | Vérifie |
|----------|---------|
| `buildNewsletterEmailParams` | `to_email`, `subject`, HTML avec `<br>` |
| `getNewsletterEmailConfig` | Priorité config `newsletter` |
| `getNewsletterEmailConfig` | Repli `clientConfirmation` |
| `getNewsletterEmailConfig` | `null` si config incomplète |
| `sendNewsletterEmail` | Appel EmailJS mocké |
| `sendNewsletterEmail` | Erreur si pas de config |

**Source :** `src/utils/newsletterEmail.js` — **Footer**, **AdminDashboard**

#### `registrationEmail.test.js` (5 tests)

| Fonction | Vérifie |
|----------|---------|
| `getRegistrationEmailConfigs` | Filtre configs EmailJS incomplètes |
| `buildRegistrationEmailParams` | Destinataire, sujet `[INSCRIPTION]`, aides, HTML |
| `sendRegistrationNotification` | Succès EmailJS |
| `sendRegistrationNotification` | Repli FormSubmit si EmailJS échoue |
| `sendRegistrationNotification` | Erreur si tout échoue |

**Source :** `src/utils/registrationEmail.js` — **Booking**

#### `reservationEmailVars.test.js` (6 tests)

| Fonction | Vérifie |
|----------|---------|
| `buildReservationScheduleVars` | Aller simple : récupération `N/A` |
| `buildReservationScheduleVars` | Aller-retour : heure récupération |
| `buildReservationScheduleVars` | Heures absentes → `—` |
| `buildReservationScheduleVarsFromForm` | Depuis formulaire réservation |
| `buildReservationScheduleVarsFromReservation` | Depuis ligne Supabase |
| `EMAILJS_RESERVATION_SCHEDULE_HINT` | Variables `{{heure}}`, etc. |

**Source :** `src/utils/reservationEmailVars.js` — **Booking**, **AdminDashboard**

#### `adminAuth.test.js` (3 tests)

| Fonction | Vérifie |
|----------|---------|
| `verifyAdminCredentials` | Email / mot de passe admin |
| `verifyAdminPin` | Code PIN |
| `shouldAllowAdminRoute` | Accès si admin ou mode développement |

**Source :** `src/utils/adminAuth.js` — **SettingsContext**, **ProtectedRoute**

#### `reservationStats.test.js` (2 tests)

| Fonction | Vérifie |
|----------|---------|
| `getDestinationCityName` | Ville avant la première virgule |
| `incrementReservationStats` | `totalBookings` + compteur par ville |

**Source :** `src/utils/reservationStats.js` — **SettingsContext**

#### `chatbotFallback.test.js` (5 tests)

| Fonction | Vérifie |
|----------|---------|
| `normalizeChatQuery` | Minuscules, sans accents |
| `getChatbotFallbackResponse` | Intention santé (SSIAD, 15) |
| `getChatbotFallbackResponse` | Intention tarifs |
| `getChatbotFallbackResponse` | Intention transport / réservation |
| `getChatbotFallbackResponse` | Réponse par défaut |

**Source :** `src/utils/chatbotFallback.js` — **Chatbot** (si API Gemini indisponible)

---

### `test/components/` — Composants React (jsdom)

#### `ProtectedRoute.test.jsx` (2 tests)

- Affiche le contenu si `shouldAllowAdminRoute` retourne `true`
- Redirige vers `/direction/admin` si non autorisé

**Mocks :** `useSettings`, `shouldAllowAdminRoute`

#### `ErrorBoundary.test.jsx` (2 tests)

- Affiche les enfants sans erreur
- Affiche un message d’erreur si un enfant React plante

#### `RegistrationRequiredDocuments.test.jsx` (2 tests)

- Affiche le titre et la liste des pièces + bouton PDF
- Appelle `onDownloadPdf` au clic

---

### `test/pages/` — Pages React (jsdom)

#### `Contact.test.jsx` (4 tests)

| Test | Vérifie |
|------|---------|
| Affichage formulaire | Titre « Envoyez un message », champ motif |
| Préremplissage URL | `?motif=transport-tarifs&zone=Paris` dans le textarea |
| Validation invalide | Erreurs nom, email, motif si envoi vide |
| Envoi valide | Message de succès après EmailJS mocké |

**Mocks :** `useSettings`, Supabase, SEO, Framer Motion, EmailJS

---

## Modules source couverts

| Fichier `src/` | Testé par |
|----------------|-----------|
| `data/contactSubjects.js` | `test/data/contactSubjects.test.js` |
| `data/registrationRequiredDocuments.js` | `test/data/registrationRequiredDocuments.test.js` |
| `utils/contactValidation.js` | `test/utils/contactValidation.test.js` |
| `utils/bookingValidation.js` | `test/utils/bookingValidation.test.js` |
| `utils/transportPricing.js` | `test/utils/transportPricing.test.js` |
| `utils/newsletterEmail.js` | `test/utils/newsletterEmail.test.js` |
| `utils/registrationEmail.js` | `test/utils/registrationEmail.test.js` |
| `utils/reservationEmailVars.js` | `test/utils/reservationEmailVars.test.js` |
| `utils/adminAuth.js` | `test/utils/adminAuth.test.js` |
| `utils/reservationStats.js` | `test/utils/reservationStats.test.js` |
| `utils/chatbotFallback.js` | `test/utils/chatbotFallback.test.js` |
| `pages/Contact.jsx` | `test/pages/Contact.test.jsx` |
| `components/ProtectedRoute.jsx` | `test/components/ProtectedRoute.test.jsx` |
| `components/ErrorBoundary.jsx` | `test/components/ErrorBoundary.test.jsx` |
| `components/RegistrationRequiredDocuments.jsx` | `test/components/RegistrationRequiredDocuments.test.jsx` |

La logique de **Booking**, **AdminDashboard**, **Footer** et **Chatbot** est testée via les modules `src/utils/` qu’ils appellent.

---

## Bonnes pratiques

1. **Tester le comportement**, pas l’implémentation interne (entrée → sortie).
2. **Placer les tests** dans `test/` en miroir de `src/` (`test/utils/MonModule.test.js`).
3. **Mocker** les services externes : `@emailjs/browser`, `fetch`, Supabase (`vi.mock()`).
4. **Tests unitaires** : pas de DOM → fichier dans `test/utils/` ou `test/data/` (env `node`).
5. **Tests UI** : ajouter en tête du fichier :
   ```javascript
   /**
    * @vitest-environment jsdom
    */
   ```
6. **Ne pas commiter** de clés API réelles dans les tests ; utiliser `mockSettings` dans `helpers.jsx`.

---

## Ajouter un nouveau test

**Exemple — tester une nouvelle fonction dans `src/utils/monModule.js` :**

1. Créer `test/utils/monModule.test.js` :

```javascript
import { describe, it, expect } from 'vitest';
import { maFonction } from '../../src/utils/monModule.js';

describe('monModule', () => {
  it('retourne le résultat attendu', () => {
    expect(maFonction('entrée')).toBe('sortie');
  });
});
```

2. Lancer : `npm test`

**Exemple — tester un composant React :**

1. Créer `test/components/MonComposant.test.jsx` avec `@vitest-environment jsdom`
2. Utiliser `render` de `@testing-library/react` et `screen.getByRole(...)`

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `ERR_REQUIRE_ESM` / `@csstools/css-calc` | Vérifier `jsdom@24.1.3` dans `package.json`, puis `npm install` |
| `document is not defined` | Ajouter `@vitest-environment jsdom` ou placer le fichier dans `test/pages/` ou `test/components/` |
| Import introuvable `../utils/...` | Vérifier que le fichier existe dans `src/utils/` (pas seulement dans `test/`) |
| Tests Contact lents / timers | Les tests utilisent `vi.useFakeTimers` pour le délai anti-spam (3 s) |

---

## Intégration CI (GitHub Actions)

Exemple de workflow :

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## Récapitulatif

| Métrique | Valeur |
|----------|--------|
| Fichiers de test | 15 |
| Tests au total | 66 |
| Environnement unitaire | Node.js |
| Environnement UI | jsdom 24 |
| Dossier des tests | `test/` |

---

*Documentation mise à jour pour le stage La Reinette — ASAD Bourg-la-Reine.*
