# Widget Dessin Avancé (Draw Advanced) — ArcGIS Experience Builder

Widget personnalisé de dessin, d'annotation et de mesure avancés pour **ArcGIS Experience Builder** (version Developer Edition 1.21 / ArcGIS Enterprise & ArcGIS Online).

---

## 👥 Crédits et Propriété Intellectuelle

- **Auteurs originaux** :
  - **Brian McLeer** (City of Grand Junction, CO)
  - **Jeffrey Thompson** (City of Arlington, TX)
- **Contributeurs** : Robert Scheitlin, Adrien Hoff, Mattias Ekström, Jérôme Ray.
- **Dépôt source original** : [https://github.com/brianmcleer/draw-advanced-widget](https://github.com/brianmcleer/draw-advanced-widget)
- **Licence** : Apache License 2.0 (voir fichier `LICENSE`).
- **Adaptation & Personnalisation** : Division de la géomatique, Ville de Rivière-du-Loup.

---

## 📐 Fonctionnalités Principales

- **Outils de géométrie vectorielle** : Points, lignes simples, lignes à main levée, rectangles, polygones, polygones à main levée, cercles.
- **Annotations textuelles avancées** : Choix de police, taille, couleur, alignement horizontal et vertical, rotation libre ou verrouillée, halo et opacité.
- **Zones tampons dynamiques (Buffers)** :
  - Génération de tampons métriques (mètres, kilomètres, pieds, etc.) pour points, lignes et polygones.
  - Visualisation en temps réel sur la carte et intégration dans le gestionnaire.
- **Mesures intégrées** : Calcul automatique des périmètres, longueurs et superficies avec affichage d'étiquettes dynamiques ou permanentes.
- **Gestionnaire « Mes Dessins » (My Drawings)** :
  - Liste, sélection multiple, zoom, renommage, suppression et modification des styles.
  - Persistance locale dans le navigateur.
- **Importation & Exportation multi-formats** : GeoJSON, Shapefile (ZIP), JSON (Dessin standard ExB) et KML.

---

## 🌐 Formats d'Exportation et Systèmes de Coordonnées (CRS)

| Format | Système de Coordonnées (SCR) | Unités | Remarques / Compatibilité |
| :--- | :--- | :--- | :--- |
| **KML** | **EPSG:4269 (NAD83 Lat/Long)** | Degrés décimaux | Coordonnées géographiques en latitude/longitude selon le référentiel nord-américain **NAD83 (EPSG:4269)**. Conforme au format KML 2.2 pour affichage immédiat dans Google Earth, ArcGIS Earth, QGIS et ArcGIS Pro. |
| **GeoJSON** | **EPSG:2949 (MTM Zone 7)** | Mètres | Exporté avec la balise URN officielle `urn:ogc:def:crs:EPSG::2949`. Compatible avec QGIS, ArcGIS Pro, FME et le web SIG municipal. |
| **JSON (ExB Draw)** | **EPSG:2949 (MTM Zone 7)** | Mètres | Format natif ArcGIS Feature JSON (`{ wkid: 2949 }`). Directement compatible avec le widget Dessin standard d'ArcGIS Experience Builder. |
| **Shapefile (ZIP)**| **EPSG:2949 (MTM Zone 7)** | Mètres | Archive ZIP complète incluant les fichiers `.shp`, `.shx`, `.dbf` et le fichier de projection `.prj` (NAD83 CSRS MTM Zone 7). |

---

## 📁 Structure du Dossier

Le widget est structuré de façon identique aux autres widgets du dépôt (ex. `filtre-calendrier`) :

```text
draw-advanced/
├── config.json          # Configuration par défaut du widget
├── icon.svg             # Icône vectorielle pour l'interface Experience Builder
├── icon.png             # Icône matricielle
├── manifest.json        # Métadonnées et déclaration d'extension ExB
├── LICENSE              # Licence Apache 2.0
├── README.md            # Documentation
├── dist/                # Fichiers compilés prêts pour la production
│   ├── runtime/
│   │   ├── widget.js
│   │   └── translations/
│   └── setting/
│       ├── setting.js
│       └── translations/
├── chunks/              # Morceaux de code optimisés (ex. parser Shapefile)
└── src/                 # Code source TypeScript / React
    ├── config.ts
    ├── runtime/
    └── setting/
```

---

## 🚀 Déploiement dans GitHub (`rdlqcgeomatiquerdl-ctrl/widgets-arcgis`)

Pour ajouter ce widget au dépôt GitHub municipal :

1. Cloner ou ouvrir votre dépôt GitHub local :
   ```bash
   git clone https://github.com/rdlqcgeomatiquerdl-ctrl/widgets-arcgis.git
   cd widgets-arcgis
   ```

2. Copier le dossier `draw-advanced/` à la racine du dépôt (aux côtés de `filtre-calendrier/`).

3. Ajouter les fichiers et créer le commit :
   ```bash
   git add draw-advanced
   git commit -m "Ajout du widget Dessin Avancé (draw-advanced) v4.6.0"
   git push origin main
   ```

---

## 🏛️ Importation et Enregistrement dans ArcGIS Enterprise

Pour utiliser le widget dans votre portail ArcGIS Enterprise (Portal for ArcGIS) :

### Étape 1 : Hébergement des fichiers
Déposez le dossier `draw-advanced/` (avec ses sous-dossiers `dist/`, `chunks/`, ainsi que `manifest.json`, `config.json`, `icon.svg`) sur votre serveur Web (IIS, Apache, Nginx) accessible par vos utilisateurs d'ArcGIS Enterprise.
- Assurez-vous que le serveur web autorise les requêtes CORS (`Access-Control-Allow-Origin: *`) et le protocole HTTPS.
- Exemple d'URL d'accès : `https://sig.ville.riviere-du-loup.qc.ca/widgets/draw-advanced/manifest.json`

### Étape 2 : Enregistrement comme Extension dans le Portail
1. Connectez-vous à votre portail ArcGIS Enterprise avec un compte administrateur ou créateur.
2. Allez dans l'onglet **Contenu** (**Content**).
3. Cliquez sur **Nouvel élément** (**New item**).
4. Sélectionnez **Application** > **Extension Experience Builder** (**Experience Builder extension**).
5. Collez l'URL complète pointant vers le fichier `manifest.json` :
   `https://<votre-serveur>/widgets/draw-advanced/manifest.json`
6. Donnez un titre à l'élément (ex: *Widget Dessin Avancé*) et enregistrez.
7. Partagez l'élément avec l'organisation ou les groupes concernés.

### Étape 3 : Utilisation dans Experience Builder
Ouvrez n'importe quelle application Experience Builder en mode édition : le widget **Dessin Avancé** apparaît désormais dans la section **Personnalisé** (**Custom**) de la palette de widgets, prêt à être glissé-déposé sur la page !
