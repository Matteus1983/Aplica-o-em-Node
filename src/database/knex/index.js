const config = require("../../../knexfile");
// receber as nossas configurações
const knex = require('knex');
// importando o knex, para utilizar ele nesse arquivo

const connection = knex(config.development)
// criar a minha conexão, passando para o knex quais as minhas configurações

module.exports = connection;