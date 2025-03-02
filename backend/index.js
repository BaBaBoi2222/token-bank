const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
require('./Models/db');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const myRouter = require('./Routes/myRouter')
app.get('/', (req, res) => {
    res.send('hi');
})
app.use(bodyParser.json());
app.use(cors())
app.use('/auth', myRouter)
app.listen(PORT, () => {
    console.log('Server is running on localhost:' + PORT.toString());

})