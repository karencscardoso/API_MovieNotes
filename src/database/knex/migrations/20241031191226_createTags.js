exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id").primary();
    table.string("name").notNullable();

    table.integer("movieNotes_id").unsigned().references('id').inTable('moviesNotes').onDelete("CASCADE");
    table.integer("user_id").unsigned().references('id').inTable('users');

});


exports.down = knex => knex.schema.dropTable("tags");
