const { Router } = require('express')
// pegando o Router do express e colocando aqui.

const NotesController = require('../controllers/NotesController')
// para utilizar a class construtora aqui e suas funções

const notesController = new NotesController();
// iniciar a class construtora

const notesRoutes = Router();
// iniciar o Router para eu poder utilizar ele.

function myMiddleware( request, response, next ){
    console.log('Você passou pelo Middleware!')

    next()
} 

notesRoutes.get("/", myMiddleware, notesController.index)
notesRoutes.post("/:user_id", myMiddleware, notesController.create)
notesRoutes.get("/:id", myMiddleware, notesController.show)
notesRoutes.delete("/:id", myMiddleware, notesController.delete)

module.exports = notesRoutes;