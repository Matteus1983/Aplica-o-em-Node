const { Router } = require('express')
// pegando o Router do express e colocando aqui.

const UsersController = require('../controllers/UsersController')
// para utilizar a class construtora aqui e suas funções

const usersController = new UsersController();
// iniciar a class construtora

const usersRoutes = Router();
// iniciar o Router para eu poder utilizar ele.

function myMiddleware( request, response, next ){
    console.log('Você passou pelo Middleware!')

    next()
}

usersRoutes.post("/", myMiddleware, usersController.create)
usersRoutes.put("/:id", myMiddleware, usersController.update)

module.exports = usersRoutes;