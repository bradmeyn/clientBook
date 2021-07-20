const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('lets get busy')
});


app.listen(port,() => {
    `Server running on ${port}`
});