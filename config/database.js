const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGO_DB;
mongoose.connect(db)
.then(() => 
    console.log('Connected to the database successfully...'))
.catch(err =>
    console.error('Could not connect to MongoDB...', err));