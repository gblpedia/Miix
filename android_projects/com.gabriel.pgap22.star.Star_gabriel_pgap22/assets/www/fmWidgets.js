




// Singleton.
var uploadingMgr = (function(){
                     
    // Static Private members.
     var uploadingArray = [];
                    
    // Static Private methods.
   
    
    function _onComplete(event, ui){
            
        FmMobile.videoWorks[this.id] = null;
        if(this.parentNode)
            $(this).remove();
        delete uploadingArray[this.id];
    }
                    
    
    return {    // Public members.
                
        addUpload: function(pid){
            var upload = new fm_progressBar(pid);
            
            uploadingArray[pid] = upload;
            upload.on("progressbarcomplete", _onComplete);
            //upload.start(); for TESTing
                
            return upload;
        },
                    
        removeUpload: function(pid, error){
            var upload = uploadingArray[pid];
            if(upload.parentNode)
                $(upload).remove();
            delete uploadingArray[pid];
        },
                
        show: function(container, pid){
            uploadingArray[pid].prependTo(container);
        },
        
        showAll: function(container){
            for(var pid in uploadingArray){
                uploadingArray[pid].prependTo(container);
            }
        },
    };
                    
})();



function fm_progressBar(pid){
    
    this.id = pid;
    //this.bar = $("#uploading").progressbar({ value: 0, max: 100 });
    this.bar = $("<div>").attr("id", pid).progressbar({ value: 0, max: 100 });
    //$("#contentArea", $("#myVideoPg")).prepend(this.bar);

}

fm_progressBar.prototype.setValue = function(value){
    this.bar.progressbar("option", "value", value);
};

fm_progressBar.prototype.on = function(event, cb){
    this.bar.on(event, cb);
};

fm_progressBar.prototype.prependTo = function(container){
    if(this.bar.parentNode)
        $(this.bar).remove();
    container.prepend(this.bar);
}

/*
fm_progressBar.prototype.onComplete = function(event, object){
    clearInterval(this.timer);
    $(this).remove();
};*/

fm_progressBar.prototype.progress = function(){
    var percentage = this.bar.progressbar("option", "value");
    if(++percentage != 101)
        this.bar.progressbar("option", "value", percentage);
};

// for TESTing
fm_progressBar.prototype.start = function(){
    var self = this;
    this.timer = setInterval(function(){ self.progress(); }, 100);
};

fm_progressBar.prototype.getValue = function(){
    return this.bar.progressbar("option", "value");
};



function trashtalk(){
    var videoListWgt = $("#videoList");
    var trash = {"trash": "talk", "projectId": "trashtalk"};
    //var widget = new videoWgt(videoListWgt, trash);
    //widget.setComments({"comments": {"count": "0"} });
    var widget = $("<div>").attr("id", "trashtalk").appendTo(videoListWgt);
    var noise = $("<div>").attr("class", "fm_trashtalk").appendTo(widget);
    var span = $("<span>").attr("class", "fm_txt_noise").html("休士頓...信號斷了嗎？<br>您什麼影片都沒做啊！").appendTo(widget);
    var makeBtn = $("<a>").attr({
            href: "#",
            class: "fm_yellowBtn_make_s",
            onclick: "$.mobile.changePage('movie_create.html');"
        }).attr("data-role", "button").html("立即製作影片").appendTo(widget);
}

trashtalk.prototype.remove = function(){
    $("#trashtalk").remove()
    //delete this.widget;
};


function videoGridAdapter(parent, data){
    var count = data.length;
    var videoGridWgt = $("<div>").attr("class", "ui-grid-a").appendTo(parent);
    
    for(var i=0; i < count; i++){
        var thumbnail = $("<div>");
        if(0 == i%2){
            thumbnail.attr("class", "ui-block-a").appendTo(videoGridWgt);
        }else{
            thumbnail.attr("class", "ui-block-b").appendTo(videoGridWgt);
        }
        var link = $("<a>").attr( "href", "video.html?idx=" + i).appendTo(thumbnail);
        var src = "thumbnail.jpg";
        var img = $("<img>").attr("src", src).appendTo(link);
        
    }
}

var videoListAdapter = (function(){
    
    //var videoListWgt = $("<ul>").attr("data-role", "listview").attr({id: "videoList", class: "fm_videoList"});
    var videoListWgt = null;
    var count = 0;
    var videoItems = null;
    var dummyItems = null;
    
    
    return {
        
        init: function(parent, data, dummy){
            videoListWgt = $("#videoList");
            //videoListWgt.appendTo(parent);
                        
            if(videoItems)
                delete videoItems;
            if(dummyItems)
                delete dummyItems;
                        
            videoItems = {};
            dummyItems = {};
                        
            if($("#trashtalk")){
                $("#trashtalk").remove();
                delete FmMobile.trashItem;
                FmMobile.trashItem = null;
            }
            
                        
            for(var pid in dummy){
                var d_item = new videoWgt(videoListWgt, {"projectId":pid}, false);
                //videoListWgt.prepend(d_item);
                dummyItems[pid] = d_item;
                d_item.setComments({"comments": {"count": "0"} });
            }
                        
            for(var i=0; i < data.length; i++){
                
                var fb_id = data[i].fb_id;
                var url = domain + "/api/fbGetComment";
                var query = {
                    "accessToken": localStorage.fb_accessToken,
                    "fb_id": fb_id
                };
                var v_item = new videoWgt(videoListWgt, data[i], true);
                //videoListWgt.append(v_item);
                v_item.setComments({"comments": {"count": "0"} });
                        
                if(fb_id){
                    videoItems[fb_id] = v_item;
                    $.get(url, query, function(result){
                          
                          FM_LOG("[Comments]" + result.id + ":\n" + JSON.stringify(result));
                          if(result.id){
                              videoItems[result.id].setComments(result);
                              $.jStorage.set(result.id, result);
                          }
                    });
                }
            }
        },
                        
        freshCommentbar: function(){
            if(!$.isEmptyObject(videoItems)){
                for(var fb_id in videoItems){
                    videoItems[fb_id].setComments({"comments": {"count": "0"} });
                }
            }
            
            if(!$.isEmptyObject(dummyItems)){
                for(var pid in dummyItems){
                    dummyItems[pid].setComments({"comments": {"count": "0"} });
                }
            }
        },
        
        updateDummy: function(pid, videoWork){
            var fb_id = videoWork.fb_id;
            var temp=null;
            if(dummyItems && dummyItems[pid]){
                temp = dummyItems[pid];
                dummyItems[pid].setSrc(videoWork.url.youtube);
                
                var url = domain + "/api/fbGetComment";
                var query = {
                    "accessToken": localStorage.fb_accessToken,
                    "fb_id": fb_id,
                    "projectId": pid
                };
                
                
                if(fb_id){
                    
                    $.get(url, query, function(result){
                          
                          FM_LOG("[Comments]" + result.id + ":\n" + JSON.stringify(result));
                          if(result.id){
                              temp.setComments(result);
                              $.jStorage.set(result.id, result);
                          }
                    });
                }
            }
        },
        
        // Workaround for commentbar display correctly.
        setDummyComment: function(pid){
            dummyItems[pid].setComments({"comments": {"count": "0"} });
        },
          
    };
})();


function _videoListAdapter(parent, data){
    var count = data.length;
    var videoListWgt = $("#videoList");
    var videoItems = [];
    
    for(var i=0; i < count; i++){
        
        var fb_id = data[i].fb_id;
        var url = domain + "/api/fbGetComment";
        var query = {
            "accessToken": localStorage.fb_accessToken,
            "fb_id": fb_id
        };
        
        videoItems[fb_id] = new videoWgt(videoListWgt, data[i], i);
        
        $.get(url, query, function(result){
            
            FM_LOG("[Comments]" + result.id + ":\n" + JSON.stringify(result));
			if(result.id){
				videoItems[result.id].setComments(result);
				$.jStorage.set(result.id, data);
			}
        });
    }
}


function videoWgt(parent, data, append){
    var widget;
    
    if(parent.attr("data-role") === 'listview'){
        widget = $("<li>").attr({id: data.projectId, class: "fm_videoItem"});
    }else{
        widget = $("<div>").attr({id: data.projectId, class: "fm_videoItem"});
    }
    
    this.videoFrame;
    
    if(data.url){
        this.videoFrame = $("<iframe>").attr({
            src: data.url.youtube + "?rel=0&showinfo=0&modestbranding=1&controls=0",
            class: "fm_video",
            frameborder: "0"
        });
        
    }else if(data.trash){
        this.videoFrame = $("<div>").attr({
            class: "fm_trashtalk"
        });
        
    }else{
        this.videoFrame = $("<iframe>").attr({
           class: "fm_video_making",
            frameborder: "0"
        });
    }
    this.videoFrame.appendTo(widget);
    
    //var bar = $("<div>").attr("class", "fm_bar").appendTo(widget);
    //this.like = $("<span>").attr("class", "fm_like_num").appendTo(bar);
    //this.comment = $("<span>").attr("class", "fm_comment_num").appendTo(bar);
    
    
    this.commentWgt = new commentListWgt(widget);
    
    if(append)
        widget.appendTo(parent); // Top First.
    else
        parent.prepend(widget);  // Top Last.
}

videoWgt.prototype.setSrc = function(src){
    this.videoFrame.attr("src", src+"?rel=0&showinfo=0&modestbranding=1&controls=0").attr("class", "fm_video");
}

videoWgt.prototype.setComments = function(data){

    /*var like_count = (data.likes) ? data.likes.count : 0,
        comment_count = (data.comments.count) ? data.comments.count : 0;*/
    
    //this.like.html(like_count);
    //this.comment.html(comment_count);
    
    if(data.comments)
		this.commentWgt.setData(data);
};


function commentListWgt(parent, fb_id){

    this.collapseWgt = $("<div>").attr("data-role", "collapsible")
		.attr("data-iconpos", "right")
		.attr("data-theme", "a")
		.attr("data-collapsed-icon", "arrow-d")
		.attr("data-expanded-icon", "arrow-u")
		.attr("class", "fm_collapsible");
    this.header = $("<h2>").attr("class", "fm_comment_header").html("").appendTo(this.collapseWgt);
    this.listWgt = $("<ul>").attr("data-role", "listview").appendTo(this.collapseWgt);
    this.collapseWgt.appendTo(parent);
    
}


commentListWgt.prototype.setData = function(result){
    
    $('li', this.listWgt).remove();
    var like_count = (result.likes) ? result.likes.count : 0,
        commentcount = (result.comments.count) ? result.comments.count : 0;
    
    
    var commentIcon = '<img src="./images/icon/comment.png" class="fm_icon"></img>';//$("<img>").attr( {src: "./images/icon/comment.png", class: "fm_icon"});
    var likeIcon = '<img src="./images/icon/like.png" class="fm_icon"></img>';//$("<img>").attr({src: "./images/icon/like.png", class: "fm_icon"});
	var comment_count = $('span.ui-btn-text', this.header).html(commentcount + commentIcon +" "+like_count + likeIcon);
    var style_class = $('a.ui-collapsible-heading-toggle', this.header).attr("class") + " fm_collapsible_heading_toggle";
    $('a.ui-collapsible-heading-toggle', this.header).attr("class", style_class);
    
    if(result.comments.data){
        var data = result.comments.data;
        var thumbnails = [];
        for(var i=0; i < data.length; i++){
            var itemWgt = $("<li>").attr("class", "fm_listItem").appendTo(this.listWgt);
            //var commentWgt = $("<div>").appendTo(itemWgt);
            var thumbnail = $("<img>").attr("class", "fm_thumbnail").appendTo(itemWgt);
            thumbnails[data[i].id] = thumbnail;
            if( (i+1)%2 )
                var commentContent = $("<div>").attr("class", "fm_comment1").appendTo(itemWgt);
            else
                var commentContent = $("<div>").attr("class", "fm_comment2").appendTo(itemWgt);
            var name = data[i].from.name;
            var who = $("<span>").attr("class", "fm_txt").html(name).appendTo(commentContent);
            var arr = data[i].created_time.split(/[- T:]/);
            var date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
            var hour = (date.getHours()+8 < 24) ? date.getHours()+8 : date.getHours()+8-24;
            var min = (date.getMinutes()>9) ? date.getMinutes() : "0"+date.getMinutes();
            var timeWgt = $("<span>").attr("class", "fm_txt_time").html(hour + ":" + min).appendTo(commentContent);
            var comment = data[i].message;        
            var commentTxt = $("<p>").attr("class", "fm_txt").html(comment).appendTo(commentContent);
            
            var url = domain + "/api/fbGetThumbnail";
            var query = {
                "accessToken": localStorage.fb_accessToken,
                "fb_id": data[i].id,
                "commenter": data[i].from.id
            };
            
            $.get(url, query, function(result){
                FM_LOG("[Thumbnail] " + result.id +"\n"+JSON.stringify(result));
                thumbnails[result.id].attr("src", result.picture.data.url);
            });
        }
    }
};
