var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "sqluserpwQ1!",
  database: "yelp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var createTable = "CREATE TABLE IF NOT EXISTS memeTable (ID INT, URLmeme VARCHAR(2000), catagoryId INT);";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = {
  
   getAllRatings: async function () {
    return new Promise( function(resolve, reject) {
    con.query("SELECT URLmeme FROM memeTable;", 
    function (err, result, fields) {
        if (err) return reject(err);

        var html = "";
        var n = 0;
        html += result[n].URLmeme;
        

        console.log("Result inside memeTable: " + html);

        resolve(html);
      });
    });  
  },
  
  insertMeme: function (id, URLmeme, catagoryId) {
    con.query("INSERT INTO memeTable VALUES ( ? )", [[id, URLmeme, catagoryId]], 
    function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });    
  }
};
