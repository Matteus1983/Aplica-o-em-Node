const { Router } = require('express');

const usersRoutes  = require('./users.routes')
const notesRoutes  = require('./notes.routes')
const tagsRoutes  = require('./tags.routes')

const routes = Router();

routes.use('/users', usersRoutes)
routes.use('/tags', tagsRoutes)
routes.use('/notes', notesRoutes)
// quando chegar pela /notes, vai ser direcionado para o notesRoutes

module.exports = routes;