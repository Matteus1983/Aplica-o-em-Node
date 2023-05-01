const { Router } = require('express')
// pegando o Router do express e colocando aqui.

const TagsController = require('../controllers/TagsController')
// para utilizar a class construtora aqui e suas funções

const tagsController = new TagsController();
// iniciar a class construtora

const tagsRoutes = Router();
// iniciar o Router para eu poder utilizar ele.

function myMiddleware( request, response, next ){
    console.log('Você passou pelo Middleware!')

    next()
} 

tagsRoutes.get("/:user_id", myMiddleware, tagsController.index)

module.exports = tagsRoutes;