# Les Chalets Gourmands — site vitrine

Site d'une page pour une pizzeria au feu de bois à Loisin (74). Objectif n°1 : référencement local
(« pizzeria Loisin », communes voisines). Site statique, déployé à la main par le propriétaire.

## Stack
- Astro en génération statique (`npm run build` → `dist/`). CSS simple (`src/styles/global.css`), aucun framework UI.
- Zéro JS côté client sauf l'indispensable : un seul script inline dans `index.astro`
  (mise en avant du jour courant dans les horaires).
- Polices auto-hébergées via `@fontsource-variable` : Oswald (titres, majuscules) et Source Sans 3 (texte).

## Données : `src/data/` (source unique, jamais de contenu commerce en dur dans le code)
- `business.json` : nom, URL du site, téléphone, adresse, GPS, prix, communes, liens externes.
- `hours.json` : une clé par jour (`lundi`…`dimanche`), liste de créneaux `["HH:MM","HH:MM"]`, `[]` = fermé.
- `menu.json` : carte fournie par le propriétaire (pizzas avec `base`, desserts, suppléments).
- Nom, adresse, téléphone et horaires doivent rester **identiques au caractère près** à la fiche Google.
- Les valeurs à remplacer contiennent `A-REMPLACER` (domaine, Facebook, Instagram, fiche Google, avis, livraison).

## Règles SEO (prioritaires)
- Title : « Les Chalets Gourmands – Pizzeria au feu de bois à Loisin (74) », meta description ~150 caractères.
- Un seul `<h1>` par page, `<h2>` par section. `lang="fr"`, canonical, Open Graph, favicon.
- JSON-LD `Restaurant` généré depuis les JSON dans `src/layouts/Base.astro`.
- `sitemap.xml` et `robots.txt` sont des endpoints dans `src/pages/`.
- Images via `astro:assets` (`<Picture>` AVIF/WebP). Objectif Lighthouse mobile > 90 sur les 4 catégories.
- Accessibilité : contrastes AA minimum, `alt` sur les images, navigation clavier, focus visible.

## Contraintes légales (France)
- `/mentions-legales/` avec placeholders éditeur, SIRET, hébergeur.
- Aucun cookie tiers : pas d'iframe Google Maps (lien « Itinéraire » à la place). Pas de statistiques.
- Ne jamais inventer de témoignages clients.

## Design
Suivre le design system « Les Chalets Gourmands » : https://claude.ai/artifact/Sx5b3mk4w61Pi9c6gQ7nwo
- Tokens repris tels quels dans `src/styles/global.css` (thème Jour, thème Soir via `prefers-color-scheme`). Pas de couleur en dur.
- `braise` : marque (bouton principal, prix, liens). `flamme` (jaune) : réservé au téléphone. `surface-deep` : héros, chalets, pied de page.
- Composants Button / Badge / CarteItem : classes `cg-btn`, `cg-badge`, `cg-carte`/`cg-item`.
- Vouvoiement, ton simple « comme au comptoir », pas d'emoji, prix `12,50 €`. Numéro visible en haut et en bas de chaque page.
- Logo : `src/assets/logo/les-chalets-gourmands-logo-blanc.svg`, en `<img>`, jamais recoloré ni déformé.
- Photos réelles dans `src/assets/photos/` (`pizza-signature.jpg`, `chalet-pizza.jpg`).

## Commandes
- `npm run dev` — serveur local
- `npm run build` — build statique dans `dist/` (doit passer sans erreur)
- `npm run preview` — sert `dist/`
- Déploiement : automatique à chaque push sur `main` (GitHub Actions → FTPS o2switch, `.github/workflows/deploy.yml`).
