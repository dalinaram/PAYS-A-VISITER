// ------------------ IMPORTS ------------------ //

/**
 * Express est un framework pour Node.js qui permet de créer des applications web.
 * Il s'agit d'un framework minimaliste, flexible et rapide, avec lequel on peut créer des applications web, des API et des sites web.
 */
const express = require('express');

/**
 * fs est un module de Node.js qui permet de lire et d'écrire des fichiers.
 * C'est un module qui est installé par défaut avec Node.js, il n'est donc pas nécessaire de l'installer.
 */
const fs = require('fs');

/**
 * Le moteur de template EJS permet de créer des vues HTML à partir de données.
 * Cela permet de créer des pages web dynamiques, c'est-à-dire des pages web qui s'adaptent en fonction des données.
 */
const bodyParser = require('body-parser');

/**
 * json-server est un module qui permet de créer une API REST complète à partir d'un fichier JSON.
 * Cela simplifie grandement la création d'une API REST, car il suffit de créer un fichier JSON pour avoir une API fonctionnelle.
 */
const jsonServer = require('json-server');

// ------------------ VARIABLES ------------------ //
/**
 * Le Middleware est un terme générique qui désigne une fonction qui va être exécutée entre la requête et la réponse.
 * C'est une fonction qui va être exécutée à chaque fois qu'une requête est reçue par le serveur.
 * jsm est juste un nom de variable, on aurait pu l'appeler comme on voulait.
 */
const jsm = jsonServer.router('db.json');

/**
 * Ici, on crée une application Express qui va utiliser le Middleware json-server.
 * Cela signifie que toutes les requêtes reçues par notre serveur seront traitées par le Middleware json-server.
 */
const app = express();


// ------------------ APP USE AND SET ------------------ //

/** 
 * Ici, urlencoded() est une méthode qui permet de traiter les données reçues dans les requêtes.
 * On indique "extended: false" pour indiquer que l'on ne veut pas traiter les données reçues dans les requêtes comme des objets complexes.
 */
app.use(bodyParser.urlencoded({ extended: false })); 

/**
 * Ici, json() est une méthode qui permet de traiter les données reçues dans les requêtes.
 * Cela permet de traiter les données reçues dans les requêtes au format JSON.
 */
app.use(bodyParser.json()); 

/**
 * Ici, on indique que l'on veut utiliser le Middleware json-server pour toutes les requêtes reçues sur la route "/api".
 * Cela signifie que toutes les requêtes reçues sur la route "/api" seront traitées par le Middleware json-server.
 */
app.use('/api', jsm); 
app.use("/images",express.static("images"))
/**
 * On définit le moteur de template que l'on va utiliser.
 * Ici, on va utiliser le moteur de template EJS. 
 */
app.set('view engine', 'ejs');


// ------------------ ROUTES ------------------ //

/**
 * Lorsqu'un internaute accède à la route "/", on va le rediriger vers la route "/pays".
 */
app.get('/', (req, res) => {
    res.redirect('/pays');
});

/**
 * On va retourner une vue en ejs pour la route "/pays".
 */
app.get('/pays', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays; // On récupère les tâches dans le fichier JSON.
    let message = '';
    res.render('pays', { pays, message }); // On retourne la vue "pays.ejs" en lui passant les tâches en paramètre.
});

/**
 * Création d'une nouvelle tâche.
 * On va créer une nouvelle tâche dans le fichier JSON.
 */
app.post('/pays/create', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays; // On récupère les tâches dans le fichier JSON.
    const newTask = { // On crée une nouvelle tâche.
        id: Date.now(), // On génère un id unique pour la nouvelle tâche.
        title: req.body.title, // On récupère le titre de la nouvelle tâche.
        description: req.body.description, // On récupère la description de la nouvelle tâche.
        status: req.body.status, // On récupère le statut de la nouvelle tâche.
        visited: req.body.visited,
    };
    pays.push(newTask); // On ajoute la nouvelle tâche dans le tableau des tâches.
    fs.writeFileSync('db.json', JSON.stringify({ pays })); // On enregistre les tâches dans le fichier JSON.
    res.redirect('/pays'); // On redirige l'internaute vers la page des tâches.
});

/**
 * Supprimer une tâche en fonction de son id.
 * On va supprimer la tâche dans le fichier JSON.
 */
app.get('/', (req, res) => {
    res.redirect('/pays')
})

app.get('/pays', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays
    let message = ''
    console.log(pays)
    res.render('pays', { pays, message })
})

app.get('/pays/:id', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays
    const paysSolo=pays.find(P=> parseInt(P.id) === parseInt(req.params.id));
    res.send(paysSolo)
})

app.post('/pays/create', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays;
    const newTask = { 
        id: Date.now(), 
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    };
    pays.push(newTask);
    fs.writeFileSync('db.json', JSON.stringify({ pays }));
    // let message = 'La tâche a bien été ajoutée';
    res.redirect('/pays');
});

app.get('/pays/delete/:id', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays; 
    const newpays = pays.filter(task => task.id !== parseInt(req.params.id)); 
    fs.writeFileSync('db.json', JSON.stringify({ pays: newpays }));
    // let message = 'La tâche a bien été supprimée';
    res.redirect('/pays');
});

app.get('/pays/:id', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays;
    const selectedPays = pays.find(p => p.id === parseInt(req.params.id));

    if (!selectedPays) {
        res.status(404).send('Pays non trouvé');
        return;
    }

    res.render('details', { pays: selectedPays });
});







// ------------------ SERVER ------------------ //
/**
 * Ici, on indique que l'on veut que le serveur écoute les requêtes reçues sur le port 3000.
 * Cela signifie que notre serveur va pouvoir recevoir des requêtes à l'adresse "http://localhost:3000".
 */
app.listen(3001, () => console.log('Le serveur est lancé sur le port 3001'));