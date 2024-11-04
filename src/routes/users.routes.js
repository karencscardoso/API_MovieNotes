const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();

function myMiddleware(request, response, next) {

    if(!request.body.isAdmin) {
        return response.json({ message: "User unauthorized." })
    }

    next();
    
}

const usersController = new UsersController();    

usersRoutes.post("/", myMiddleware, usersController.create)
usersRoutes.get("/", usersController.index)
usersRoutes.put("/:id", usersController.update)
usersRoutes.delete("/:id", usersController.delete)

module.exports = usersRoutes;