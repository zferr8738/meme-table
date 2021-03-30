const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dao = require('./mysqlDao.js');
var multer  = require('multer');
const { insertMeme } = require('./mysqlDao.js');
var upload = multer({ dest: 'uploads/' })

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
    response.status(200).send({});
})
app.get('/resultToHTML', async (request, response)  => {
    console.log('Starting...')
    console.log('Getting there...')
    var memeHTML = await dao.getAllRatings();
    
    response.status(200).send(memeHTML);
})
app.post('/profile', upload.single('meme'), function (req, res, next) {
    var sql = "SELECT COUNT(*) AS total FROM memeTable";
    var query = con.query(sql, function(err, result) {
        insertMeme(result[0].total + 1, req.file.filename);
        console.log(req.file);
    })


    response.status(200).send({});
  })
  app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
  })
  
  var cpUpload = upload.fields([{ name: 'meme', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
  app.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
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
