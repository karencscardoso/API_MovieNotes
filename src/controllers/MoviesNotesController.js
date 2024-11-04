const knex = require("../database/knex")

class MoviesNotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;


            const [ movieNotes_id ] = await knex("moviesNotes").insert({
                title,
                description,
                rating,
                user_id,
            });

            const tagsInsert = tags.map(name => {
                return {
                    movieNotes_id,
                    name,
                    user_id
                }
            });

            await knex("tags").insert(tagsInsert);

            response.status(201).json({message: "Nota do filme inserido com sucesso!"});

    }
    
    async show(request, response) {
        const { id } = request.params;

        const movieNotes = await knex("moviesNotes").where({ id }).first();
        const tags = await knex("tags").where({ movieNotes_id: id }).orderBy("name");

        return response.json({
            ...movieNotes,
                tags
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("moviesNotes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { user_id, title, tags } = request.query;

        let moviesNotes;

        if(tags) {
            const filterTags = tags.split(",").map(tag => tag.trim());

            moviesNotes = await knex("tags")
            .select([
                "moviesNotes.id",
                "moviesNotes.title",
                "moviesNotes.description",
                "moviesNotes.rating",
                "moviesNotes.user_id"
            ])
            .where("moviesNotes.user_id", user_id )
            .whereIn("name", filterTags)
            .innerJoin("moviesNotes", "moviesNotes.id", "tags.movieNotes_id")
        } else {

            moviesNotes = await knex("moviesNotes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title")
        }

        console.log(moviesNotes);
        
        const userTags = await knex("tags").where({ user_id })

        const moviesNotesWithTags = moviesNotes.map(movieNote => {
            const movieNotesTags = userTags.filter(tag => {
                
               return tag.movieNotes_id === movieNote.id

            });

            return {
                ...movieNote,
                tags: movieNotesTags
            }
        });

        return response.json(moviesNotesWithTags)
        
    }
}
    

module.exports = MoviesNotesController;
