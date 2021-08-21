const express = require('express');
const OngController = require('./controllers/OngController'); // Importando o controlador de ONgs
const IncidentController = require('./controllers/IncidentController'); // Importando o controlador de Incidents
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');
const routes = express.Router();

routes.post('/sessions', SessionController.create); //criando sessão

routes.get('/ongs', OngController.index); // chama o método listar ongs
routes.post('/ongs', OngController.create); // chama o método criar ongs

routes.get('/profile', ProfileController.index);

routes.get('/incidents', IncidentController.index)  // chama o método listar incidents
routes.post('/incidents', IncidentController.create); // chama o método de criar Incident
routes.delete('/incidents/:id', IncidentController.delete);

module.exports = routes;