const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dao = require('./mysqlDao.js');
//const dao = require('./sqliteDao.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).sendFile('index.html', {
        root: path.resolve('../public')
    });
});

app.get('/crewOrImp', (request, response)  => {
    //flip a coin, decide which is better, crew or imposter
    var result = "https://static.wikia.nocookie.net/among-us-wiki/images/3/31/Red.png";
    var rand = Math.random();
    if(rand < .5)
    {
        result = "https://static.wikia.nocookie.net/among-us-wiki/images/9/92/Yellow.png";
    }
    response.status(200).send("<img src ='" + result + "' alt = 'Crew Or Imposter' width = '300' height = '300'>");
})
app.get('/memeInsert', (request, response)  => {
    dao.insertMeme(0, request.query.filepath, 0);
    response.status(200).send({} );
})
app.get('/resultToHTML', async (request, response)  => {
    console.log('Starting...')
    console.log('Getting there...')
    var memeHTML = await dao.getAllRatings();
    
    response.status(200).send(memeHTML);
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});