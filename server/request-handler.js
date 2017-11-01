var serverData = [];
var fs = require('fs');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  var body;

  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  var statusCode;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/plain';
  
  if (request.method === 'GET') {
    statusCode = 200;
    
    var responseBody = {};
    responseBody.results = serverData;
    body = responseBody;
  
  }
  
  if (request.method === 'OPTIONS') {
    statusCode = 202;
  }
  
  if (request.method === 'POST' && request.url === '/classes/messages') {
    statusCode = 201;
    
    body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      serverData.push(JSON.parse(body));
    });
    
  } else if (request.url !== '/classes/messages') {
    statusCode = 404;
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(body));
};

exports.requestHandler = requestHandler;