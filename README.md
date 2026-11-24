# Les Chalets Gourmands — site vitrine

Site statique d'une page (Astro) pour la pizzeria au feu de bois de Loisin (74).

## Prérequis

- Node.js 22 ou plus récent
- `npm install` une première fois

## Commandes

| Commande          | Rôle                                                 |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Serveur local avec rechargement : http://localhost:4321 |
| `npm run build`   | Génère le site final dans `dist/`                    |
| `npm run preview` | Sert le contenu de `dist/` pour vérifier le build    |

## Avant la mise en ligne : valeurs à remplacer

Toutes les valeurs provisoires contiennent `A-REMPLACER` :

```sh
grep -rn "A-REMPLACER" src/
```

- `src/data/business.json` → `url` (domaine définitif, utilisé pour la balise canonique, le sitemap, Open Graph et le JSON-LD), `links.facebook`, `links.instagram`, `links.googleMaps` (lien de la fiche), `links.googleReview` (lien « Laisser un avis »), `links.delivery` (lien de livraison).
- `src/pages/mentions-legales.astro` → raison sociale, SIRET, TVA, directeur de publication, hébergeur.
- Photos : `src/assets/photos/pizza-signature.jpg` (fond du haut de page, image de partage) et `chalet-pizza.jpg` (section « Nos chalets »). Pour en changer, remplacez le fichier en gardant le nom, puis adaptez le texte `alt` dans `src/pages/index.astro`. Elles sont converties automatiquement en AVIF/WebP au build.

> Le nom, l'adresse, le téléphone et les horaires doivent rester **identiques au caractère près** à la fiche Google Business.

## Modifier la carte : `src/data/menu.json`

- **Ajouter une pizza** : ajouter un objet dans `pizzas`.
  ```json
  { "nom": "Montagnarde", "prix": 16.00, "base": "crème fraîche", "ingredients": ["crème fraîche", "mozzarella", "tomme", "jambon cru"] }
  ```
  - `prix` est un nombre avec un point (`16.00` ou `16.5`). Il est affiché « 16,00 € ».
  - `base` vaut `"tomate"` ou `"crème fraîche"`. Elle détermine la rubrique où la pizza apparaît.
  - `"en_chausson": true` (facultatif) ajoute l'étiquette « en chausson ».
- **Retirer une pizza** : supprimer son objet. Attention à la virgule entre deux objets : il en faut une entre chaque objet, mais pas après le dernier.
- **Desserts, suppléments** : même principe, dans `desserts` et `supplements`.
- Les pizzas s'affichent dans l'ordre du fichier.

## Modifier les horaires : `src/data/hours.json`

Une ligne par jour, avec la liste des créneaux d'ouverture au format `"HH:MM"` :

```json
"jeudi":  [["11:30", "14:00"], ["17:30", "21:30"]],
"lundi":  []
```

- `[]` signifie que la pizzeria est fermée ce jour-là. La mention « Ouvert 7 jours sur 7 » disparaît alors automatiquement.
- Les horaires du tableau et ceux des données structurées Google (JSON-LD) sont générés à partir de ce fichier. Il n'y a rien d'autre à modifier.
- Le jour courant est mis en avant dans le navigateur, à l'heure de Paris.

Après chaque modification : `npm run build`, puis redéployer.

## Déployer

### Chez o2switch (hébergement actuel)

1. `npm run build`, puis compresser le **contenu** de `dist/` (fichier `.htaccess` compris) :
   `cd dist && zip -r ../site-a-deployer.zip . && cd ..`
2. cPanel → **Gestionnaire de fichiers** → dossier du domaine `leschaletsgourmands.fr` (souvent `public_html/`) → vider l'ancien contenu → **Charger** le zip → clic droit → **Extraire**.
3. cPanel → **SSL/TLS Status** : vérifier que le certificat (AutoSSL) couvre `leschaletsgourmands.fr` et `www.leschaletsgourmands.fr`. Le `.htaccess` redirige tout vers `https://www.`.

Variante en ligne de commande (après avoir autorisé son IP dans cPanel → **Autorisation SSH**) :
`rsync -av --delete dist/ identifiant@serveur.o2switch.net:public_html/`

### Autres hébergeurs

Le site est 100 % statique : il suffit de publier le **contenu** du dossier `dist/`.

1. Renseigner le vrai domaine dans `src/data/business.json` (`url`).
2. `npm run build`
3. Envoyer le contenu de `dist/` à la racine du site, selon l'hébergeur :
   - **Netlify / Cloudflare Pages / Vercel** : connecter le dépôt Git avec la commande de build `npm run build` et le dossier de publication `dist`, ou glisser-déposer `dist/` dans Netlify Drop.
   - **Hébergement mutualisé (OVH, o2switch…)** : copier le contenu de `dist/` dans `www/` ou `public_html/` par FTP/SFTP, par exemple avec `rsync -av --delete dist/ user@serveur:www/`.
   - **Serveur perso (nginx)** : `root` pointé vers le dossier, avec `try_files $uri $uri/ =404;`.
4. Renseigner l'hébergeur dans les mentions légales.

### Après la mise en ligne

- Ajouter l'URL du site dans la fiche Google Business Profile.
- Déclarer le site dans [Google Search Console](https://search.google.com/search-console) et soumettre `https://votre-domaine/sitemap.xml`.
- Valider les données structurées avec le [test des résultats enrichis](https://search.google.com/test/rich-results).

## Choix techniques

- **Aucun cookie** : pas de carte Google intégrée (un simple lien « Itinéraire ») et aucun outil de statistiques, donc aucun bandeau cookies n'est nécessaire.
- **Un seul petit script inline**, en bas de `index.astro` : mise en avant du jour courant dans les horaires.
- **Design system** : https://claude.ai/artifact/Sx5b3mk4w61Pi9c6gQ7nwo. Ses tokens sont repris dans `src/styles/global.css`, avec un thème sombre automatique.
- **Polices auto-hébergées** (`@fontsource-variable`) : Oswald pour les titres, Source Sans 3 pour le texte.
- `sitemap.xml` et `robots.txt` sont générés par `src/pages/sitemap.xml.ts` et `src/pages/robots.txt.ts`. Toute nouvelle page `.astro` est ajoutée automatiquement au sitemap.
- Lighthouse mobile, mesuré en local : 99 en Performance, 100 en Accessibilité, Bonnes pratiques et SEO.
