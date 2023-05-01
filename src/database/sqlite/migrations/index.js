const sqliteConnection = require('../../sqlite');
// importar o sql connection, a nossa coneção

const createUsers = require('./createUsers');
// importar o createusers, que cria o usuário no banco de dados

async function migrationsRun(){
    const schemas = [
        createUsers,
    ].join('');
// as tabelas que o meu banco vai ter
// join vai juntar todas elas
    sqliteConnection()
     .then(db => db.exec(schemas))
     .catch(error => console.error(error))
}

module.exports = migrationsRun;

