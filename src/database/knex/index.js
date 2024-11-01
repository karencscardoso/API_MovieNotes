const config = require("../../../knexfile");
const knex = require("knex");

const conection = knex(config.development);

module.exports = conection;
