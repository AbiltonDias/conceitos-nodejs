const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function blockLikesUpdate(request, response, next) {
  const { likes } = request.body;
  
  
  if (likes) {
    return response.status(400).json({ error: `Likes can't be changed manually.`});
  }
  
  return next();
  
}

function likesRequest( request, response, next){
    const { id } = request;
    
   const indexReposity = repositories.findIndex(item => item.id === id);
  
    const repository = repositories.filter(item =>
      item.id === id ? item.likes += 1 : []
    );
    console.log(repository)
    repositories[indexReposity] = repository;
    
    next();

    console.timeEnd(logLabel);
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

   const repository = {
     id : uuid(),
     title,
     url,
     techs,
    likes: 0
   } 
    repositories.push(repository);
    return response.json(repository);

});

app.put ("/repositories/:id",(request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexReposity = repositories.findIndex(item=> item.id === id);

  if(indexReposity < 0){
    return response.status(400).json(
      {
        error: 'Reposity not found!'
      }
    )
  }
  const repositoryLikes = repositories.find(item => item.id=== id); 
  
  const repository ={
    id,
    title,
    url,
    techs,
    likes: repositoryLikes.likes
  }

  repositories[indexReposity] = repository;
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexReposity = repositories.findIndex(item => item.id === id);

  if(indexReposity < 0){
    return response.status(400).json({
      error: 'Repository not found!'
    })
  }

  repositories.splice(indexReposity, 1);
  return response.status(204).send();
});

app.post ("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const indexReposity = repositories.findIndex(item => item.id === id);

  if(indexReposity < 0){
    return response.status(400).json({
      error: 'Repository not found!'
    })
  }

  const respository = repositories.find( item => item.id === id);

  respository.likes += 1;

  return response.json(respository);
});

module.exports = app;
