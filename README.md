# IHM - Projet

###### Thierry Otto & Thibaud Alt

## Interface

Pour que l'interface soit la plus simple possible, nous l'avons imaginé sur une page unique et divisée en 4 zones d’affichages simples :

1. **En haut à gauche** : Les « hot post-it », il s'agit de post-it mis en avant à un certain moment en fonction de l’échéance ou de l’importance.

2. **En haut à droite** : Un bouton d'ajout de post-it

3. **En bas à gauche** : les post-it toujours affichés, il peut y'en avoir jusqu'a 4

4. **En bas à droite** : les post-it unique et répétitifs, pour ceux-ci 3 sont affichés directement, les suivants sont disponnible en appuyant sur le dossier.

![](Mockups/1.Home.png)

Les post-it important apparaissent avant les autres post-it.

Par soucis de simplicitée il y a uniquement deux actions possibles sur cette interface :

- Afficher un post-it en cliquant dessus
- Ajout d’un post-il en cliquant sur le boutton "+"

### New post-it

Lors d'un clic sur le bouton d'ajout de post-it, on peut choisir entre les 3 types de post-it disponnibles.

![](Mockups/2.Add.png)

Un nouveau post-it vierge est alors créé, l'interface de celui-ci est identique à celle du point suivant.

### View / edit post-it

Lors d'un clic sur un post-it, celui-ci s'ouvre en grand. On peut alors directement modifier les donnes affichées (titre, texte, date). Le champ titre est le seul champ obligatoire.

Les types de post-it proposés sont les suivants :

- Simple texte avec Emoji

![](Mockups/3.View-once.png)

- Liste de tâches partielles

![](Mockups/3.View-repeat.png)

Dans cette vue il est possible de cliquer sur la roue de réglage. A ce moment la le post-it tourne et les réglages de celui-ci s'affichent.

### Post-it settings

Les configurations possibles possible d’un post-it sont :

- Le changement de type (remains, repeat, once)
- Le marquage comme "important"

Nous avons décidé de fixer les couleurs pour éviter des confusions et d’avoir un arc-en-ciel au niveau de l’interface.

![](Mockups/4.Settings.png)

C'est également dans cette vue que l'on peut supprimer un post-it.

### Fonctionnalité suplémentaire

Comme fonctionnalité supplémentaire par rapport aux spécifications de base, nous avons imaginé un type de post-it supplémentaire. Celui-ci propose d'ajouter une URL à la place de son texte. 

Au clic sur ce post-it, l'url spécifiée est directement ouvert dans le navigateur web et affiche par exemple un journal ou une autre application web. Pour les personnes âgées, cela nous semble un moyen simple et efficace de leur créer des raccourcis vers leurs sites préférés.

## Technologie

Nous avons choisi d'utiliser les frameworks [React.js](https://fr.reactjs.org/) et [Bootstrap](https://getbootstrap.com/) afin de réaliser cette interface web. Celle-ci sera alors disponible tant sur un ordinateur que sur une tablette.
La persistance des données sera fait dans une base de données type [MySQL](https://www.mysql.com/fr/) ou [SQLLite](https://www.sqlite.org/index.html).
Une fois terminée, notre application ser déployé sur un serveur web de type [Netlify](https://www.netlify.com/) puis sera accessible via tout navigateur moderne.

## Développement

### Adaptations

Lors du développement de l'application, nous avons quelques peu modifié notre interface notamment les points suivants

- Sur la page principale, nous avons pu afficher 6 post-its par catégorie au lieu des 4 prévus initialement.

- Nous avons décidé de remplacer les "dossiers de posts-its" par un simple défilement verticale qui nous semble plus cohérent.

Après de multiples heures de développement, nous avons pu réaliser l'interface suivante. Celle-ci est actuellemnt adapté pour un iPad en mode paysage.

![5.Interface.png](/Users/thibaud/Documents/HEIG/Cours/IHM/Labos/01-IHM-Projet/Mockups/5.Interface.png)

### Améliorations possibles

- Placement des post-its lors de modifications de type

### Environement (React.js)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Inspirations

- [https://github.com/ajainvivek/react-stickies](https://github.com/ajainvivek/react-stickies)
- [https://github.com/cosmicjs/sticky-notes](https://github.com/cosmicjs/sticky-notes)
- [https://github.com/gemmi-arts/react-sticky-notes](https://github.com/gemmi-arts/react-sticky-notes)
- [https://github.com/jeffsdev/React-StickyNotes](https://github.com/jeffsdev/React-StickyNotes)
