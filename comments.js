// Create web server and listen to port
// Load the 'http' module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments.js');

// Create a server that invokes the `handler` function upon any request
var server = http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
      return;
    }
    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }
    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write(err + "\n");
        response.end();
        return;
      }
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
});

// Listen on port 8080, IP defaults to