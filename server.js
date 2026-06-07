// the entry point. Starts the server. Should be small and clean.

// import values from .env file
require('dotenv').config();

//imports the express package ... express is now a function we can call to create a server
const express = require('express');

// Import the claims router — handles all /claims routes
const claimsRouter = require('./src/routes/claims');
const authRouter = require('./src/routes/auth');

// saves the function in an object. this creates you server instance
const app = express();

// read PORT value from ENV file and save to variable
const PORT = process.env.PORT || 5000;

app.use(express.json()); //middleware that runs on every request before it hits the routes. read the request body and parses it as json

// Mount the claims router: any request to /claims gets forwarded to claimsRouter
// All /api/claims requests are handled by claimsRouter
app.use('/api/claims', claimsRouter);
app.use('/api/auth', authRouter);

// listen for a HTTP GET request /health and reply with ...
app.get('/health', (req, res) => {
  res.json({ status: 'ok' }); //responce
});
app.get('/test', (req, res) => {
  res.json({ status: 'yezzir' }); //responce
});

// tells node to open a connection on PORT and wait for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});