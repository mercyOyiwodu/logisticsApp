const express = require('express');
require('./config/database')
const userRoutes = require('./routes/user');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);


app.listen((port), () => {
  console.log(`Server is running on port ${port}`);
});