const http = require('http');

let server = http.createServer(function(req, res){

    console.log('server started ${req.method)');
    console.log('URL ${req.url)');
    console.log(req.headers);


});

server.listen(3000,function(err){

    if(err){
        console.log('server error')
    }

    else{
        console.log('server listening on port ${3000}')
    }
})