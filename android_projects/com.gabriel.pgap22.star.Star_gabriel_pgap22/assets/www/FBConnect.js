/* MIT licensed */
// (c) 2010 Jesse MacFadyen, Nitobi
// Contributions, advice from : 
// http://www.pushittolive.com/post/1239874936/facebook-login-on-iphone-phonegap

var DEBUG = true,
    FM_LOG = (DEBUG) ? function(str){ console.log("[FM] "+ str); } : function(str){} ;

function FBConnect()
{
    /* Dedicated to iOS.
	if(window.plugins.childBrowser == null)
	{
		ChildBrowser.install();
	}*/
}

FBConnect.prototype.onConnect;

FBConnect.prototype.connect = function(client_id, redirect_uri, display)
{
    
	this.client_id = client_id;
	this.redirect_uri = redirect_uri;
	
	var authorize_url  = "https://graph.facebook.com/oauth/authorize?";
		authorize_url += "client_id=" + client_id;
		authorize_url += "&redirect_uri=" + redirect_uri;
		authorize_url += "&display="+ ( display ? display : "touch" );
		authorize_url += "&type=user_agent";
        authorize_url += "&scope=read_stream,publish_stream";
    
	window.plugins.childBrowser.showWebPage(authorize_url);
	var self = this;
    
	window.plugins.childBrowser.onLocationChange = function(loc){
        //The scope of 'this' here is the event.
        self.onLocationChange(loc);
    };
    window.plugins.childBrowser.onClose = function(){
        self.onClose();
    };
};


FBConnect.prototype.Logout = function() {
    window.plugins.childBrowser.LogOut();
};


FBConnect.prototype.onClose = function(){
    FM_LOG("[onClose] ");
};

FBConnect.prototype.onLocationChange = function(newLoc)
{
	FM_LOG("[onLocationChange] ");
	if(newLoc.indexOf(this.redirect_uri[0]) == 0 || newLoc.indexOf(this.redirect_uri[1]) == 0 )
	{
		FM_LOG("[onLocationChange] Redirect");
		var result = decodeURI(newLoc).split("#")[1];
		result = decodeURI(result);
		
		// TODO: Error Check
		this.accessToken = result.split("&")[0].split("=")[1];		
		this.expiresIn = Date.now() + parseInt( result.split("&")[1].split("=")[1] )*1000;
        this.code = result.split("&")[2].split("=")[1];
        FM_LOG("[onLocationChange] " + JSON.stringify(localStorage));
        localStorage.fb_accessToken = this.accessToken;
        this.getUserID();
		
	}
};

FBConnect.prototype.getUserID = function(){
    FM_LOG("[getUserID] ");
    var url = "https://graph.facebook.com/me?access_token=" + this.accessToken;
    var self = this;
    /*
    $.get(url, {"timestamp": Date.now()}, function(response){
        
        FM_LOG("[FBConnect.getUserID]: " + JSON.stringify(response) );
        if(response.id){
            localStorage.fb_userID = response.id;
            FM_LOG("localStorage.fb_accessToken = " + localStorage.fb_accessToken);
            FM_LOG("localStorage.expiresIn = " + localStorage.expiresIn);
            
            this.onConnect();   // Callback when FB connected.
            
            
        }else{
            FM_LOG("[FBConnect.getUserID]: Failed to get FB ID. " + response.error.message);
        }
    });*/
    
    var req = new XMLHttpRequest();
    //req.setRequestHeader("Cache-Control", "no-cache");
    req.onreadystatechange = function(e){
        
        if(req.readyState == 4 && req.status == 200){
            
            var res = JSON.parse(e.target.responseText);
            FM_LOG("userID: " + res.id + " userName: " + res.name);
            localStorage.fb_userID = res.id;
            localStorage.fb_name = res.name;
            
            self.onConnect();
        }
    };
    req.open("GET", url);
    req.send({"timestamp": Date.now()});
    
};


FBConnect.prototype.getFriends = function()
{
	var url = "https://graph.facebook.com/me/friends?access_token=" + this.accessToken;
	var req = new XMLHttpRequest();
	
	req.open("get",url,true);
	req.send(null);
	req.onerror = function(){alert("Error");};
	return req;
};

// Note: this plugin does NOT install itself, call this method some time after deviceready to install it
// it will be returned, and also available globally from window.plugins.fbConnect
// Static method.
FBConnect.install = function()
{
    
	if(!window.plugins)
	{
		window.plugins = {};	
	}
	window.plugins.fbConnect = new FBConnect();
                                                
	return window.plugins.fbConnect;
};

