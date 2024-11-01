const { Router } = require("express");

const usersRouter = require("./users.routes");
const moviesNotesRouter = require("./moviesNotes.routes");
const tagsRouter = require("./tags.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/moviesNotes", moviesNotesRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;