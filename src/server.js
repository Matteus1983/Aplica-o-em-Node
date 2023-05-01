require('express-async-errors');
const migrationsRun = require('./database/sqlite/migrations')

const AppError = require('./utils/AppError')

const express = require('express');
// pegando o express do node_modules e colocando aqui.

const routes = require("./routes")

migrationsRun()

const app = express();
// iniciar o express para eu poder utilizar ele.

app.use(express.json());
// dizendo para a api/express qual o padrão vai utilizar (json)

app.use(routes);

app.use(( error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error);

    return response.status(500).json({
        status:"error",
        message: "Internal server error",
    })
});

const PORT = 3333;
// definiu qual a porta a nossa Api vai ficar observando (garçon), esperando requisições e enviando respostas.
app.listen(PORT, ()=> console.log(`Server is running on Port ${PORT}`));
// fica ouvindo essa porta, e quando iniciar vai enviar essa mensagem no terminal.