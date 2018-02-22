var http = require('http');

var reqProfile = function(){

    var opts = {host: "localhost", path: "/user6", port: "3000", method: "GET", headers:{"content-type": "application/json"} };
    
    var req = http.request(opts, function(res){
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
    
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Profile-BODY: ' + chunk);
        });
    });
    
    var data = {"member": {"memberID":"user6", "password":"666" }};
    req.write(JSON.stringify(data));
    req.end();
};



var reqSignin = function(){
    
    var urlOpts = {host: "localhost", path: "/api/signin", port: "3000", method: "POST", headers:{"content-type": "application/json"} };
    
    var req = http.request( urlOpts, function(res){
    
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('SignIn-BODY: ' + chunk);
            //reqProfile();
            
        });
        //console.log("Response from Feltmeng: " + JSON.stringify(res) );
    });
    
    var what = {"member": {"memberID":"user6", "password":"666" } };

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify(what));
    req.end();
};

reqSignin();


/*$.post("http://localhost:3000/signin", what , function(res){
                
            });*/