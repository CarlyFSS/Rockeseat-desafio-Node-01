const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];



// Routes

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const likes = 0;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateID, (request, response) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id === id);

  let { title, url, techs } = request.body;

  if(title) {
    repositories[repositoryIdx].title = title;
  } 

  if(url) {
    repositories[repositoryIdx].url = url;
  }

  if(techs) {
    repositories[repositoryIdx].techs = techs;
  }

  return response.json(repositories[repositoryIdx]);
});

app.delete("/repositories/:id", validateID, (request, response) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIdx, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateID, (request, response) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIdx].likes++;

  return response.json(repositories[repositoryIdx]);
});

// End Routes

// Functions

function validateID(request, response, next) {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({error: "No repository ID was informed!"})
  }

  if(!isUuid(id)) {
    return response.status(400).json({error: "Please insert a valid repository ID!"})
  }

  repositoryIdx = repositories.findIndex(repository => repository.id === id);

  if(repositoryIdx < 0) {
    return response.status(400).json({error: "No repository found with the informed ID!"})
  }

  return next();
}

// End Functions

module.exports = app;
