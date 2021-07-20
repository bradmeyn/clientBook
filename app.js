const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;

const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/client-book';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});


app.get('/', (req, res) => {
    res.send('lets get busy')
});


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});