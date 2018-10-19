var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "static/";
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
  if (err) {
    res.writeHead(404);
    res.end("<h1>Page does not exist!</h1>");
    return;
  }
  res.writeHead(200);
  res.end(data);
})
}).listen(8000);
console.log('Server is running at port 8000')