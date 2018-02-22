


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



function videoListAdapter(parent, data){
    var count = data.length;
    var videoListWgt = $("<ul>").attr("data-role", "listview").attr("id", "videoList").appendTo(parent);
    var videoItems = [];
    
    for(var i=0; i < count; i++){
        
        var fb_id = data[i].fb_id
        var url = domain + "/api/fbGetComment";
        var query = {
            "accessToken": localStorage.fb_accessToken,
            "fb_id": fb_id
        };
        
        videoItems[fb_id] = new videoWgt(videoListWgt, data[i], i);
        
        $.get(url, query, function(result){
            
            FM_LOG("[Comments]" + result.id + ":\n" + JSON.stringify(result));
                videoItems[result.id].setComments(result);
                $.jStorage.set(result.id, data);
        });
    }
}


function videoWgt(parent, data, idx){
    var videoWgt;
    
    if(parent.attr("data-role") === 'listview'){
        videoWgt = $("<li>").attr({id: "video_"+idx});
    }else{
        videoWgt = $("<div>").attr({id: "video_"+idx});
    }
    var video = $("<iframe>").attr({
        src: data.url.youtube,
        width: (screen.width > 1280)? 1280: screen.width,
        height: (screen.width > 1280)? 720: screen.width/4*3,
        frameborder: "0"
                            
    }).appendTo(videoWgt);
    
    var bar = $("<div>").appendTo(videoWgt);
    this.like = $("<span>").appendTo(bar);
    this.comment = $("<span>").appendTo(bar);
    
    /*  TODO
    var likeIcon = $("<img>").appendTo(like),
        commentIcon = $("<img>").appendTo(comment);
    */
    
    this.commentWgt = new commentListWgt(videoWgt);
    videoWgt.appendTo(parent);
}

videoWgt.prototype.setComments = function(data){

    var like_count = (data.likes) ? data.likes.count : 0,
        comment_count = (data.comments.count) ? data.comments.count : 0;
    
    this.like.html(like_count + "Likes; ");
    this.comment.html(comment_count + "comments");
    
    if(data.comments.data)
        this.commentWgt.setData(data.comments.data);
};


function commentListWgt(parent, fb_id){

    this.collapseWgt = $("<div>").attr("data-role", "collapsible");
    this.header = $("<h2>").html("Comments").appendTo(this.collapseWgt);
    this.listWgt = $("<ul>").attr("data-role", "listview").appendTo(this.collapseWgt);
    this.collapseWgt.appendTo(parent);
    
}


commentListWgt.prototype.setData = function(data){

    var count = data.length;
	$('span.ui-btn-text', this.header).html(count + " Comments");
    
    for(var i=0; i < data.length; i++){
        var itemWgt = $("<li>").appendTo(this.listWgt);
        var thumbnail = $("<img>").appendTo(itemWgt);
        var commentWgt = $("<p>").appendTo(itemWgt);
        var name = data[i].from.name;
		
        var who = '<span style="color:blue">' + name + '</span>';
        var comment = data[i].message;
        var date = new Date(data[i].created_time);
        commentWgt.html(who + " " + comment);
        var hour = date.getHours()+1;
        var min = (date.getMinutes()>9) ? date.getMinutes() : "0"+date.getMinutes();
        var timeWgt = $("<p>").html(hour + ":" + min).appendTo(itemWgt);   
    }
	this.listWgt.listview("refresh");
};


var FM = {};
FM.result = { data:
[{
  "id": "100004053532907_242194172575299", 
  "from": {
    "name": "Gabriel Feltmeng", 
    "id": "100004053532907"
  }, 
  "message": "Offline Published Test from FM.", 
  "picture": "http://external.ak.fbcdn.net/safe_image.php?d=AQATpSIbKj7tHW0O&w=130&h=130&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2F8bc8NGzeJQ4%2Fmqdefault.jpg", 
  "link": "https://www.youtube.com/embed/8bc8NGzeJQ4", 
  "source": "http://www.youtube.com/v/8bc8NGzeJQ4?version=3&autohide=1&autoplay=1", 
  "name": "V-Ray Advertising Demo Reel 2011", 
  "description": "The Official V-Ray Demo Reel 2011 - Advertising Industry Credits: /in alphabetical order/ 3de Akama Studio Alex Roman Drawiz Inc. FrostFX Incendii LLC Indust...", 
  "icon": "http://static.ak.fbcdn.net/rsrc.php/v2/yj/r/v2OnaTyTQZE.gif", 
  "actions": [
    {
      "name": "Comment", 
      "link": "http://www.facebook.com/100004053532907/posts/242194172575299"
    }, 
    {
      "name": "Like", 
      "link": "http://www.facebook.com/100004053532907/posts/242194172575299"
    }
  ], 
  "privacy": {
    "description": "Public", 
    "value": "EVERYONE"
  }, 
  "type": "video", 
  "status_type": "shared_story", 
  "application": {
    "name": "ShowOff", 
    "namespace": "feltmeng", 
    "id": "116813818475773"
  }, 
  "created_time": "2012-10-29T09:06:52+0000", 
  "updated_time": "2012-10-30T08:59:48+0000", 
  "likes": {
    "data": [
      {
        "name": "Gabriel Feltmeng", 
        "id": "100004053532907"
      }
    ], 
    "count": 1
  }, 
  "comments": {
    "data": [
      {
        "id": "100004053532907_242194172575299_940164", 
        "from": {
          "name": "Gabriel Feltmeng", 
          "id": "100004053532907"
        }, 
        "message": "GOOD LUCK!", 
        "created_time": "2012-10-29T09:54:12+0000"
      }, 
      {
        "id": "100004053532907_242194172575299_940165", 
        "from": {
          "name": "Gabriel Feltmeng", 
          "id": "100004053532907"
        }, 
        "message": "nice video!", 
        "created_time": "2012-10-29T09:54:28+0000"
      }, 
      {
        "id": "100004053532907_242194172575299_943619", 
        "from": {
          "name": "Gabriel Feltmeng", 
          "id": "100004053532907"
        }, 
        "message": "this comment to v-ray from FM", 
        "created_time": "2012-10-30T08:59:48+0000"
      }
    ], 
    "count": 3
  }
},
{
      "id": "100004053532907_120967654725635", 
      "from": {
        "name": "Gabriel Feltmeng", 
        "id": "100004053532907"
      }, 
      "message": "Offline Post by ShowOFF", 
      "picture": "http://external.ak.fbcdn.net/safe_image.php?d=AQAFYG39eFIanBdt&w=130&h=130&url=http%3A%2F%2Fi4.ytimg.com%2Fvi%2FoZmtwUAD1ds%2Fmqdefault.jpg", 
      "link": "http://www.youtube.com/embed/oZmtwUAD1ds", 
      "source": "http://www.youtube.com/v/oZmtwUAD1ds?version=3&autohide=1&autoplay=1", 
      "name": "Google Chrome: An Awesome World", 
      "description": "Dad (and children's book author) Dallas Clayton uses the web to share the inspiring book he wrote for his son with people all over the world. Read \"An Awesom...", 
      "icon": "http://static.ak.fbcdn.net/rsrc.php/v2/yj/r/v2OnaTyTQZE.gif", 
      "actions": [
        {
          "name": "Comment", 
          "link": "http://www.facebook.com/100004053532907/posts/120967654725635"
        }, 
        {
          "name": "Like", 
          "link": "http://www.facebook.com/100004053532907/posts/120967654725635"
        }
      ], 
      "privacy": {
        "description": "Public", 
        "value": "EVERYONE"
      }, 
      "type": "video", 
      "status_type": "shared_story", 
      "application": {
        "name": "ShowOff", 
        "namespace": "feltmeng", 
        "id": "116813818475773"
      }, 
      "created_time": "2012-10-30T12:19:30+0000", 
      "updated_time": "2012-11-07T08:18:16+0000", 
      "comments": {
        "data": [
          {
            "id": "100004053532907_120967654725635_147123", 
            "from": {
              "name": "Gabriel Feltmeng", 
              "id": "100004053532907"
            }, 
            "message": "comment 1", 
            "created_time": "2012-11-07T08:18:12+0000"
          }, 
          {
            "id": "100004053532907_120967654725635_147124", 
            "from": {
              "name": "Gabriel Feltmeng", 
              "id": "100004053532907"
            }, 
            "message": "comment 2", 
            "created_time": "2012-11-07T08:18:16+0000"
          }
        ], 
        "count": 2
      }
    }
    ]
};