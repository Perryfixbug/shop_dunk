const express = require('express');
const database = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//Parse JSON, nếu ko parse về json request sẽ trả về undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database.connect();

//CORS
const cors = require('cors');
app.use(cors());  // Cho phép tất cả các request

//Router
const route = require('./routes/index')
route(app)

app.get('/', (req, res)=>{
    res.send("Hello world!")
}) 



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));