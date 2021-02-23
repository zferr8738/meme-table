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

  var createTable = "CREATE TABLE IF NOT EXISTS memeTable (ID INT, URLmeme VARCHAR(2000), catagoryId SMALLINT);";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

function resultToHtml(id, URLmeme, catagoryId, spanId){
  return "<span id=\"span-" + spanId + "\">Id: " + id + "<br>URL: " + URLmeme + "<br>catagoryId: " + catagoryId + "<br></span>";
}
module.exports = {
  deleteRating: function (ratee, stars, comment) {
    con.query("DELETE FROM rating WHERE ratee=" + con.escape(ratee) + " AND stars=" + con.escape(stars) + "AND comment=" + con.escape(comment) + ";", 
    function (err, result) {
        if (err) throw err;
        console.log("Deleted: " + result);
    });    
  },
  
   getAllRatings: async function () {
    return new Promise( function(resolve, reject) {
    con.query("SELECT id, URLmeme, catagoryId FROM memeTable;", 
    function (err, result, fields) {
        if (err) return reject(err);

        var html = " ";
        var n = 0;
        html += resultToHtml(result[n].id, result[n].URLmeme, result[n].catagoryId, n);
        

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
