const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try {
            const checkUserExist = await knex("users").where({ email }).first();

            if (checkUserExist) {
                throw new AppError("Este e-mail já está em uso.", 400);
            }

            const hashedPassword = await hash(password, 8);

            await knex('users').insert({
              name, email, password: hashedPassword,
            });
      
            throw new AppError("Usuário criado com sucesso!", 201);
            
          } catch (error) {
            console.error("Erro ao criar usuário:", error);
        
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({ message: error.message });
            }
        
            return response.status(500).json({ error: "Erro interno do servidor" });
        }
        }

    async update(request, response) {
        const { name, email, password, oldPassword } = request.body;
        const { id } = request.params;

        const user = await knex('users').select('*').where({ id }).first();

        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const userWithUpdatedEmail = await knex("users").select("*").where({ email }).first();

        if(userWithUpdatedEmail && userWithUpdatedEmail.id != user.id ) {
            throw new AppError("Este e-mail, já está em uso");
        }

        user.name = name;
        user.email = email;

        await knex("users").update({
            name: user.name,
            email: user.email,
            updated_at: knex.fn.now()
        })
        .where({ id });

        if(password && !oldPassword) {
            throw new AppError("Precisa informar a senha antiga para definir a senha nova.")           
        }

        if(password && oldPassword) {
            const checkOldPassword = await compare(oldPassword, user.password);

            if(!checkOldPassword) {
                throw new AppError("Senha antiga não confere.")
            }

            user.password = await hash(password, 8);
        }

        await knex("users").update({
            name: user.name,
            email: user.email,
            password: user.password,
            oldPassword: user.oldPassword,
            updated_at: knex.fn.now()
        })
        .where({ id });

        return response.status(200).json();

    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("moviesNotes").where({ user_id: id }).delete();
        await knex("users").where({id}).delete();

        return response.status(200).json({ message: "Usuário deletado com sucesso." });
    }
}

module.exports = UsersController;