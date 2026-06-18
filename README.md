# La Reinette - Service d'Aide à Domicile Premium

Bienvenue sur le dépôt officiel de **La Reinette**, votre partenaire d'excellence pour l'accompagnement des seniors à Bourg-la-Reine.

## ✨ Notre Vision
Offrir une vie sereine et digne à nos aînés dans le confort de leur foyer, grâce à une expertise médicale de pointe et une chaleur humaine inégalée.

## 🚀 Technologie
- **React 19** & **Vite 6**
- **Framer Motion** for premium animations
- **Lucide React** for iconography
- **CSS3 Variables** for a robust design system

## 🛡️ Accessibilité
Le site est conçu avec des fonctionnalités spécifiques pour les seniors :
- Taille de police adaptable.
- Haut contraste natif.
- Navigation simplifiée.

## 🧪 Tests automatisés

**66 tests** répartis en **15 fichiers** dans le dossier `test/` (Vitest + React Testing Library).

Couverture : formulaires contact/réservation/inscription, e-mails (EmailJS, FormSubmit), tarifs transport, horaires, admin, chatbot, composants critiques.

```bash
npm install           # une fois (inclut jsdom 24 pour les tests)
npm test              # 66 tests — exécution unique
npm run test:watch    # mode développement
npm run test:coverage # rapport de couverture (dossier coverage/)
```

📖 **Documentation complète :** [test/README.md](test/README.md) (structure, liste de chaque test, dépannage, CI).

Résumé rapide : [docs/TESTS.md](docs/TESTS.md).

---
© 2026 La Reinette - Tous droits réservés.