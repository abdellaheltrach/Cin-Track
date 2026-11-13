# CinéTrack — Catalogue de Films et Séries

Application web interactive de découverte et de gestion de films et séries, développée en JavaScript vanilla (modules ES6) avec persistance via `localStorage` et intégration d'une API MockAPI.

## Démo & Liens
- **Site en ligne :** [Lien Vercel](https://cin-track.vercel.app/)
- **Planification :** [Tableau Jira](https://abdellaheltrach.atlassian.net/jira/software/projects/SCRUM/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiZmQxNmU2OTFhNzY2NGM5NmI5ZTMzOWQ2MzNmYzI5NDciLCJwIjoiaiJ9)

---

## Fonctionnalités Clés
- **Catalogue & Cartes (`Index.html`) :** Affichage dynamique sous forme de cartes élégantes avec image, titre, année de sortie et type (film ou série).
- **Recherche & Filtres Avancés :** Recherche textuelle en temps réel et filtres combinés par type (*Tous*, *Films*, *Séries*) avec réinitialisation automatique de la pagination.
- **Pagination Intelligente :** Navigation fluide affichant 8 éléments par page.
- **Fenêtre Modale Détaillée :** Affichage complet des informations au clic sur une carte (image grand format, synopsis, genres, réalisateurs, pays de production, et durée ou saisons selon le type).
- **Gestion des Favoris & Sidebar :** Ajout et suppression de favoris sans doublon via un bouton cœur (avec `stopPropagation` pour éviter l'ouverture intempestive de la modale), affichage dans une sidebar fixe et persistance avec `localStorage`.
- **Gestion des Erreurs :** Affichage d'un message clair en cas d'échec de chargement des données de l'API.

---

## Technologies Utilisées
- HTML5 / Tailwind CSS
- JavaScript ES6+ (Modules ES, `async/await`, `Fetch API`, `try/catch`, méthodes de tableaux `map`, `filter`, `find`, `reduce`)
- Persistance locale (`localStorage`, `JSON.stringify`, `JSON.parse`)
- Git & GitHub

---

## Structure du Projet

```text
Cin-Track/
├── Index.html          # Page principale de l'application
├── .gitignore          # Fichiers ignorés par Git
├── README.md           # Documentation du projet
├── img/                # Ressources graphiques (logos, icônes)
│   ├── Logo.png        #
│   └── Phone Logo.png  #
└── js/                 # Logique JavaScript modulaire
    ├── data.js         # Récupération des données via Fetch API et gestion des erreurs
    ├── main.js         # Point d'entrée principal et initialisation des écouteurs
    └── ui.js           # Rendu dynamique du DOM (cartes, modale, sidebar, pagination)