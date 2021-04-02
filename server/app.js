const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dao = require('./mysqlDao.js');
var multer  = require('multer');
const { insertMeme } = require('./mysqlDao.js');
var upload = multer({ dest: 'uploads/' })
var count = 0;
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
app.get('/memeInsert', (request, response)  => {
    count++;
    dao.insertMeme(count, request.query.filepath, 0);
    response.status(200).send({});
})
app.get('/resultToHTML', async (request, response)  => {
    console.log('Starting...')
    console.log('Getting there...')
    var memeHTML = await dao.getAllRatings();
    
    response.status(200).send(memeHTML);
})
app.post('/profile', upload.single('meme'), function (req, res, next) {
    count++;
    dao.insertMeme(count, req.file.filename, 1);
    res.status(200).send({});
  })
  app.get('/getMeme', async (request, response)  => {
    var imgFile = await dao.getAllRatings();
    console.log("Sending file: " + imgFile);
    response.status(200).sendFile( __dirname + "/uploads/" + imgFile);
  })
  /*
  Disk storage for Multer (VERY IMPORTANT FOR EVERYTHING TO WORK CORRECTLY!)0
  /!\KEEP THIS THE SAME/!\
  ==========================================================================
  */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});