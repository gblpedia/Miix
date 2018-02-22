var FmMobile = window.FmMobile || {};

var DEBUG = true,
    FM_LOG = (DEBUG) ? function(str){ console.log("[FM] "+str); } : function(str){} ;


var local = false,
    localhost = "http://localhost:3000",
    remotesite = "http://www.feltmeng.idv.tw:3000",
    domain = (local) ?  localhost : remotesite;
    

/*
$(document).ready(function(){
    $('a[href^="#"]').bind('click vclick', function(){
        location.hash = $(this).attr('href');
        return false;
    });
});*/

$(document).bind("mobileinit", function(){
                // Initialization Code here.
                // $.mobile.ns = "fm";
                $.mobile.allowCrossDomainPages = true;
                $.mobile.pushStateEnabled = true;
                
                $.mobile.page.prototype.options.addBackBtn = true;
               /*$(document).bind("pagebeforeload pageload pageloadfailed"
                                          +" pagebeforechange pagechange pagechangefailed"
                                          +" pagebeforeshow pagebeforehide pageshow pagehide"
                                          +" pagebeforecreate pagecreate pageinit pageremove"
                                          +" updatelayout", FmMobile.homePg.init);*/
                
                $("#indexPg").live("pageinit", FmMobile.indexPg.init);
                $("#myVideoPg").live("pagebeforeshow", FmMobile.myVideoPg.loadMyVideo);
                $("#reservationPg").live("pagebeforeshow", FmMobile.reservationPg.loadMyVideo);
                $("#"+FmMobile.censorshipPg.PAGE_ID).live("pagebeforeshow", FmMobile.censorshipPg.loadWaitingEvents);
                //$("#popup").live(); Popup must use "live"
                
                FM_LOG("<----------------- LOAD JQM and INIT ----------------->");
});



FmMobile.videoWorks = null;
FmMobile.profile = null;


FmMobile.authPopup = {
    PAGE_ID: "authPg",
    
    fbStatusPolling: function(){
    
        FM_LOG("[Long Polling FB Status:]");
        
        var url = domain + "/api/fbStatus",
            query = {"timestamp": Date.now()};
        
        $.get(url, query, function(response){
            
            if(response.data){
                if(response.data.userID){
                    FM_LOG("\nRes of [FB Status]: Connected....Redirect to Home Page");
                    FM_LOG(JSON.stringify(response.data));
                    
                    localStorage.fb_userID = response.data.userID;
                    localStorage.fb_accessToken = response.data.accessToken;
                    localStorage._id = response.data._id;
                    sessionStorage.sessionID = response.data.sessionID;
                    
                    $.mobile.changePage("home.html");
                    
                }else{
                    // Future - Handle FB Authentication Fail Here. - Popup something.
                }
                window.plugins.childBrowser.close();
                return;
            }
            
            FM_LOG("\nRes of [FB Status]: Keep Waiting.");
            // Repeat Polling until connected.
            FmMobile.authPopup.fbStatusPolling();
        });
    },
    
    init: function(){
        FM_LOG("[authPop Init]");
        FmMobile.authPopup.fbStatusPolling();
           
        window.plugins.childBrowser.showWebPage(remotesite+"/signin_fb", {showLocationBar: true} );
        window.plugins.childBrowser.onLocationChange = function(location){
        
            FM_LOG("[childBrowser.onLocationChange:] " + location);
                   
            if(location.search("permissions.request") > -1){
                FM_LOG("[[childBrowser.onLocationChange:]] Redirect to feltmeng");
                   
                window.plugins.childBrowser.close();
                
                if(!$("#fb_iframe")){
                    var fbFrame = $("<iframe>").attr({
                        src: "http://www.feltmeng.idv.tw:3000/signin_fb",
                        style: "display:none",
                        target: "_blank",
                        seamless: true,
                        id: "fb_iframe"
                    }).appendTo("#contentArea");
                }
            }
        };
        
        /*
        var popup = $("<div>").attr("id", "authPopup");      
        popup.jqmData("data-role", "popup");
        popup.jqmData("data-overlay-theme", "a");
        popup.html('<iframe src="http://www.feltmeng.idv.tw:3000/signin_fb" width="480" height="320" seamless></iframe>').appendTo("#contentArea").popup();
        popup.popup("open");*/
        
    },
    
    getProfile: function(){
        FM_LOG("[getProfile]");
        var url = domain + "/api/profile",
            query = {"user":{
                "_id": localStorage._id,
                "accessToken": localStorage.fb_accessToken,
                "userID": localStorage.fb_userID,
                "timestamp": Date.now()
            }};
            
        $.post(url, query, function(response){
        
            if(response.videoWorks){
                
            }else{
            
            }
        });
        
    },
};

// index.html
FmMobile.indexPg = {

    PAGE_ID: "indexPg",
    
    //  Page methods.
    init: function(){
        FM_LOG("[indexPg.init] ");
        
        
        if(localStorage.fb_userID){
            //$.mobile.changePage("home.html");
        }
    },
};


FmMobile.homePg = {

    PAGE_ID: "homePg",
    
    //  Page methods.
    
    //  Initialization method.
    init: function(e){
    /*
    var path = location.pathname;
        path = path.substring(0, path.lastIndexOf("/")+1)+"home.html";
        location.pathname = path;*/
        
    FM_LOG("Has homePg " + $("#homePg").attr("id") );
        
    FM_LOG("\nHome init: " + JSON.stringify(window.history.state) );
    //window.history.replaceState("", "", path);
    FM_LOG("\nHome init: " + JSON.stringify(location) );
       /*
       var page = $("<div>").attr({
           data-role: "page",
           id: "homePg",
           data-url: "home.html"
            
       }).appendTo(".containter");
       
       $("<div>").attr("data-role", "header").html("<h1>選單</h1>").appendTo(page);
       
       var content = $("<div>").attr("data-role", "content").appendTo(page);
       
       $("<div>").attr("data-role", "footer").appendTo(page);
       
       var list = $("<ui>").attr({
            data-role: "listview",
            class: "ui-listview"
            
       }).appendTo(content);
       
       $("<li>").html('<a href="production.html">影片製作</a>').appendTo(list);
       $("<li>").html('<a href="myVideo.html">我的影片</a>').appendTo(list);
       $("<li>").html('<a href="reservation.html">播放預約</a>').appendTo(list);
       $("<li>").html('<a href="censorship.html">播放審查</a>').appendTo(list); */
       
    },
};


FmMobile.signinPg = {
    //  Page constants.
    PAGE_ID: "signinPg",
    
    //  Page methods.
    signinReq: function(){
        
        var member = new Object(),
            inputElements = $('input');
                
            
        var memberID,
            password,
            url = domain + "/api/signin",
            data = {};
                
        for( var i=0; i < inputElements.length; i++){
            member[inputElements[i].name] = inputElements[i].value;
        }
            
        data = { "member":member };   // JSON.stringify(data) is unnecessary.
        FM_LOG( "Sending: " + JSON.stringify(data) );
            
        $.post(url, data, function(res){
                
            if(res.videoWorks){
                profile = res.profile;
                videoWorks = res.videoWorks;
                 
                /*
                var path = location.pathname;
                path = path.substring(0, path.lastIndexOf("/")+1)+"home.html";
                location.pathname = path;
                location.hash = "";*/
                
                $.mobile.changePage("home.html", {
                    type: "get",
                    changeHash: true
                });
                
                //$.sessionStorage( "videoWorks", videoWorks);
                FM_LOG("profile: " + JSON.stringify(profile) );
                FM_LOG("videoWorks: " + JSON.stringify(videoWorks) );
                
            }else{
                $("#failPopup").popup("open");
            }
        });
    },
    
    testBtn: function(){
        $.mobile.changePage("home.html");
    },
};

FmMobile.signupPg = {

    PAGE_ID: "signupPg",
    
    signupReq: function(){
    
        var member = new Object(),
            inputElements = $('input');
                
            
        var url = domain + "/api/signup",
            data = {};
                
        for( var i=0; i < inputElements.length; i++){
            member[inputElements[i].name] = inputElements[i].value;
        }
        
        if( member["password"] === member["repassword"] && member["password"] ){
        
            data = { "member":member };   // JSON.stringify(data) is unnecessary.
            FM_LOG( "Sending Data: " + JSON.stringify(member) );
                
            $.post(url, data, function(res){
                    
                if(res.videoWorks){
                    profile = res.profile;
                    videoWorks = res.videoWorks;
                            
                    $.mobile.changePage("home.html", {
                        type: "get",
                        changeHash: false,
                        dataUrl: "home.html"
                    });
                    
                    
                    //$.sessionStorage( "videoWorks", videoWorks);
                    FM_LOG("profile: " + JSON.stringify(profile) );
                    //FM_LOG("videoWorks: " + JSON.stringify(videoWorks) );
                    
                }else{
                    $("#failPopup").popup("open");
                }
            });
            
        }else{
            $("#password").attr("value", "");
            $("#repassword").attr("value", "");
        }
       
    },

};


FmMobile.myVideoPg = {
   //  Page constants.
    PAGE_ID: "myVideoPg",
    
    //  Page methods.
    loadMyVideo: function(event, data){
        FM_LOG("loadMyVideoPg");    
        var url = domain + "/api/profile",
            query = {"user":{
                "_id": localStorage._id,
                "accessToken": localStorage.fb_accessToken,
                "userID": localStorage.fb_userID,
                "timestamp": Date.now()
            }};
        //var attach = "?userID="+localStorage.fb_userID+"&_id="+localStorage._id+"&accessToken="+localStorage.fb_accessToken;
        var videoList= $("<div>").attr("id", "videoList");
        //url += attach;    
        $.get(url, query, function(res){
        
            if(res.videoWorks){
                videoWorks = res.videoWorks;
                FM_LOG("Gain videoWorks: " + JSON.stringify(videoWorks) );
                
                $("#myVideoPg div:jqmData(role='content')").append(videoList);
                    
                for(var i=0; i < videoWorks.length; i++){
                    
                    var video = $("<iframe>").attr({
                            id: "video"+i,
                            src: videoWorks[i].url.youtube,
                            width: 560,
                            height: 315,
                            frameborder: "0",
                            
                    }).appendTo(videoList);
                    var br = $("<br>").appendTo(videoList);
                    
                }
            }
        });
    },
    //  Initialization method. 
    init: function(){
        $("#myVideoPg").live( "pagebeforecreate", FmMobile.myVideoPg.loadMyVideoPg);
    },
};


FmMobile.reservationPg = {
    PAGE_ID: "reservationPg",
    
    loadMyVideo: function(event, data){
            
        var url = domain + "/api/profile",
            query = {"user":{
                "_id": localStorage._id,
                "accessToken": localStorage.fb_accessToken,
                "userID": localStorage.fb_userID,
                "timestamp": Date.now()
            }};
        var thisPage = $(this);
        
        $.get(url, query, function(res){
        
            if(res.videoWorks){
                videoWorks = res.videoWorks;
                FM_LOG("Gain videoWorks: " + JSON.stringify(videoWorks) );
                
                
                for(var i=0; i < videoWorks.length; i++){
                    $("<option>").attr({value: i.toString()}).html(videoWorks[i].title).appendTo("#video_select");
                }
                $("#video_select").val("0").select("refresh");
                //$("#video_select").select("refresh");
            }
        });
                  
        FM_LOG("load reservationPg");
    },
    
    reserve: function(){
    
        var v_idx = parseInt($("#video_select").val(), 10);
        var year = parseInt($("#reserved_year").val(), 10),
            mon = parseInt($("#reserved_month").val(), 10),
            date = parseInt($("#reserved_date").val(), 10);
            
        var str = $("#reserved_time").val(),
            hr = parseInt(str.substring(0, 2), 10),
            min = parseInt(str.substring(2), 10);
            
        var slot = new Date(year, mon, date, hr, min);
        var url = domain + "/api/addEvent",
            data = {};
        
        var start = slot.getTime(),
            end = slot.getTime() + 5*60*1000,   //  Duration 5 mins
            ownerId = profile._id;
        
        var evt = {
                    "videoId": videoWorks[v_idx]._id,
                    "projectId": videoWorks[v_idx].projectId,
                    "ownerId": ownerId,
                    "start": start,
                    "end": end,
                    "videoUrl": videoWorks[v_idx].url.youtube,
                    "location": "小巨蛋",
                    "status": "waiting"
                  };
        data = { "event": evt };         
        FM_LOG("addEvent: " + start.toLocaleString()+ " to " + end.toLocaleString() +"\n" + JSON.stringify(evt) );
        
        $.post(url, data, function(res){
            $.mobile.changePage("#homePg", {reverse: true, transition: "slide"});
            FM_LOG("Rerserve: ");
            consoloe.dir(res);
        });
    },
};


FmMobile.censorshipPg = {

    PAGE_ID: "censorshipPg",
    
    _waitingEvents: null,
    
    //  Page methods.
    loadWaitingEvents: function(){
    
        var url = domain + "/api/eventsOfWaiting",
            data = {"do": "nothing"};
        var thisPage = $(this);
        
        $.get(url, data, function(res){
            FM_LOG( "Get waitingEvents: " + JSON.stringify(res) );
            
            if(res.waitingEvents){
                _waitingEvents = res.waitingEvents;
                
                for(var i=0; i < _waitingEvents.length; i++){
                
                    var event = $("<div>").attr("id", "event"+i).appendTo($("#contentArea", thisPage));
                    var video = $("<iframe>").attr({
                        id: "video"+i,
                        src: _waitingEvents[i].videoUrl,
                        width: "560",
                        height: "315",
                        frameborder: "0",
                    }).appendTo(event);
                    
                    $("<br>").appendTo(event);
                    
                    var rejectBtn = $("<button>").attr("id", "rjt"+i).html("拒絕").on("click", FmMobile.censorshipPg.reject).appendTo(event);
                    var proveBtn = $("<button>").attr("id", "prv"+i).html("通過").on("click", FmMobile.censorshipPg.prove).appendTo(event);
                    
                }
            }
        });
    },
    
    reject: function(event){
    
        var idx = parseInt(event.target.id.substring(3), 10);
        var url = domain + "/api/reject",
            evtid = _waitingEvents[idx]._id,
            data = {"event": {"oid": evtid} };
            
        FM_LOG("Reject " + event.target.id + " events: "+ JSON.stringify(evtid) );  
        
        $("#event"+idx).remove();
        
        $.post(url, data, function(res){
            FM_LOG("Res of Reject: " + JSON.stringify(res) );
        })
    },

    prove: function(event){
    
        FM_LOG("Prove " + event.target.id);
        var idx = parseInt(event.target.id.substring(3), 10);
        var url = domain + "/api/prove",
            evtid = _waitingEvents[idx]._id,
            data = {"event": {"oid": evtid} };
            
        FM_LOG("Prove " + event.target.id + " events: "+ JSON.stringify(evtid) );
        
        $("#event"+idx).remove();
        
        $.post(url, data, function(res){
            FM_LOG("Res of Prove: "+ JSON.stringify(res) );
        })
    },
};