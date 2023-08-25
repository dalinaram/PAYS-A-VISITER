//Mise en place du serveur
const express = require('express');
const app = express();
const fs =require('fs');
const tasks = JSON.parse(fs.readFileSync('db.json')).tasks

//Page d'accueil
app.get('/', (req, res) => {
    res.redirect('/pays');
});

app.get('/pays', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays; 
    let message = '';
    res.render('pays', { pays, message });
});

//Page de création d'un élément
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


//Page pour un seul élément
app.get('/pays/:id', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays;
    const selectedPays = pays.find(p => p.id === parseInt(req.params.id));

    if (!selectedPays) {
        res.status(404).send('Pays non trouvé');
        return;
    }

    res.render('details', { pays: selectedPays });
});


//Page pour supprimer un élément
app.get('/pays/delete/:id', (req, res) => {
    const pays = JSON.parse(fs.readFileSync('db.json')).pays; 
    const newpays = pays.filter(task => task.id !== parseInt(req.params.id)); 
    fs.writeFileSync('db.json', JSON.stringify({ pays: newpays }));
    // let message = 'La tâche a bien été supprimée';
    res.redirect('/pays');
});

module.exports=app