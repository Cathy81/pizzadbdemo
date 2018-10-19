var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "static/";
var MongoClient = require('mongodb').MongoClient;
var db;
var dbURL="mongodb://pizza1:pizza1@localhost:27017/pizzadb"
var server=http.createServer(function (req, res) {
 var urlObj = url.parse(req.url, true, false);
 console.log(urlObj.pathname)
 if(req.method=="GET")
 {
   fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end("<h1>Page does not exist!</h1>");
      return;
    }
    res.writeHead(200);
    res.end(data);
  })
 }
})
MongoClient.connect(dbURL, 
  function(err, database) {
    if(err) throw err;

    db=database.db("pizzadb")
    console.log("Connected to DB Server!")
  // Start the application after the database connection is ready
  server.listen(8000);
  console.log("Web erver listening on port 8000");
});
