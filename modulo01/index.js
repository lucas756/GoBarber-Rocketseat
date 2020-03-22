const express = require('express');


const server = express();

server.use(express.json());

const users = ['Lucas', 'André', 'Diego'];


server.use((req, res, next) => {
  console.time('request');

  console.log(` Metodo: ${req.method}; URL: ${req.url} `);

  next();

  console.timeEnd('request')
  
});



function checkUserExists (req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray (req, res, next) {
  const user = [req.params.index];
  
  if(!user){
    return res.status(400).json({ error: 'User does exists' });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(req.user);
})


server.get('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params; 

    return res.json(users[index]);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name); 

  return res.json(users);
})


server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params; 
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})



server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params; 

  users.splice(index, 1);

  return res.send();
})

server.listen(8080);