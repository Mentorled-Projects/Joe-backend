const express = require ("express");
const mongoose = require ("mongoose");
const connectToDatabase = require ('./src/config.js');
const cors = require ("cors");
const dotenv = require ("dotenv");
const { swaggerUi, swaggerSpec }= require ('./src/swagger.js')



dotenv.config();

const app = express();

app.use (express.json());
app.use(cors());

app.use ('/api/v1/auth', require ('./routes/auth'));
app.use ('/api/v1/guardian', require ('./routes/guardian'))
app.use ('/api/v1/tutor', require ('./routes/tutor'))
app.use ('/api/v1/child', require ('./routes/child'))
app.use ('/api/v1/upload', require ('./routes/upload'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const Port = 3000

// app.listen (Port, () => {
    app.listen(Port, '0.0.0.0', () => {

    console.log(`Server is up and running on port ${Port}`)
});

connectToDatabase()

