
exports.up = knex => knex.schema.createTable("moviesNotes", table => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description").nullable();
    table.integer("rating").nullable();
    
    table.integer("user_id").unsigned().references('id').inTable('users').onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("moviesNotes");
