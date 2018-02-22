var FmMobile = window.FmMobile || {};

var templateSelected;
var fileSelectedURI, fileProcessedForCropperURI;
var photoCroppedURI="./img/face.jpg";
var fileObjectID;
var projectID;
var croppedArea;
var customizableObjectDimensions = new Object();
var customizedContent = new Object();
var fileSelected;
var myPhotoCropper;


var mobileinitForMovieGen = function() {
	$.mobile.page.prototype.options.addBackBtn = true;
	$("#templateSelectPg").live("pageinit", FmMobile.templateSelectPg.load);
    //$("#photoSelectPopupPg").live("pageinit", FmMobile.photoSelectPopupPg.load);
	$("#movieCreatePg").live("pageinit", FmMobile.movieCreatePg.load);
    $("#movieCreatePg").live("pageshow", FmMobile.movieCreatePg.show);
	$("#photoCropperPg").live("pageinit", FmMobile.photoCropperPg.load);
    $("#photoCropperPg").live("pageshow", FmMobile.photoCropperPg.show);
	$("#moviePreviewPg").live("pageinit", FmMobile.moviePreviewPg.load);
    $("#moviePreviewPg").live("pageshow", FmMobile.moviePreviewPg.show);
}

/*
//for test
$(document).bind("mobileinit", function(){
    mobileinitForMovieGen();
});
 
*/



FmMobile.templateSelectPg = {
	//  Page constants.
    PAGE_ID: "templateSelectPg",
    
    //  Page methods.
    load: function(event, data){

		
	
		var getTemplateDescription_cb = function(xmlDoc) {
			var templateName = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			var templateDesc = xmlDoc.getElementsByTagName("description")[0].childNodes[0].nodeValue;
			var templateID = xmlDoc.getElementsByTagName("ID")[0].childNodes[0].nodeValue;
			
			var templateNameHTML = '<b3>'+templateName+'</b3>';
			var templateDescHTML = '<p>'+templateDesc+'</p>';
			var itemLink = $('<a>').html(templateNameHTML+templateDescHTML);
			//itemLink.attr('href','movie_create.html?template_selected='+templateID);
			itemLink.attr('href','movie_create.html');
			var aListItem = $('<li>').html(itemLink);						
			$('#template_list').append(aListItem).listview('refresh');
		}
	
	
		var getTemplateList_cb = function(xmlDoc) {
			
			var templateItems = xmlDoc.getElementsByTagName("template");
			for (var i=0; i<templateItems.length; i++) {
				var templateID = templateItems[i].childNodes[0].nodeValue;
				$.ajax({
					url: './template/'+templateID+'/template_description.xml',
					dataType: 'xml',
					success: getTemplateDescription_cb		
				});
			}
		}

	
		$.ajax({
			url: './template/template_list.xml',
			dataType: 'xml',
			success: getTemplateList_cb		
		});

	}
}



FmMobile.movieCreatePg = {
	//  Page constants.
    PAGE_ID: "movieCreatePg",
    
    //  Page methods.
    show: function(){
        FmMobile.analysis.trackPage("/movie_create.html");
        recordUserAction("enters movieCreatePg");
    },
    
    load: function(event, data){
        
		/*
		var userName;
		if ( profile._userName ) {
			userName = profile._userName; 
		}
		else {
			userName = "anonymous"; 
		}
        
        var userID;
		if ( profile._id ) {
			userID = profile._id;
		}
		else {
			userID = "anonymous";
		}
		*/
		
		//temp
		//userName = "anonymous";

		if ( localStorage._id ) {
			userName = localStorage._id;
		}
		else {
			userName = "anonymous";
		}

       
		
		var url = $(this).data('url');
		//var templateID = url.split("=")[1];
		var templateID = "greeting";
        //var templateID = "miixcard";
        //var templateID = "rotate";
		projectID = templateID +'-'+ userName +'-'+ (new Date()).toISOString().replace(/[-:.]/g, "");
		customizedContent.projectID = projectID;
		customizedContent.templateID = templateID;
		customizedContent.userName = userName;
        customizedContent.ownerID = {_id: localStorage._id, fb_userID: localStorage.fb_userID, fb_name: localStorage.fb_name};
		var customizableObjects = new Array();
		customizedContent.customizableObjects = customizableObjects;
		var itemContentIsReady;
		

	
		var buttonClick_cb = function(event, ui) {

			console.log('button clicked!');
			fileObjectID = event.data.objectID;
			console.log('[buttonClick_cb()] fileObjectID = %s', fileObjectID);
			//alert('fileObjectID = '+fileObjectID );

			/*
			var uploadFail_cb = function(error) {
				alert("檔案上傳失敗(代碼:"+error.code+")，請重試!");
			}
			
			
			var uploadSuccess_cb = function(r) {
				console.log("Code = " + r.responseCode);
				console.log("Response = " + r.response);
				console.log("Sent = " + r.bytesSent);
				//alert(r.response);
				//$('#btn'+fileObjectID).html('重新選取照片');
				$('#div'+fileObjectID).html(fileSelected);
				customizableObjects[event.data.objectIndex].content = fileSelected;
				itemContentIsReady[event.data.objectIndex] = true;
				
				var allItemContentAreReady = true;
				for (var i=0; i<itemContentIsReady.length; i++) {
					allItemContentAreReady = allItemContentAreReady && itemContentIsReady[i];
				}
				if ( allItemContentAreReady ) {
					$('#movieCreatePgFooter').show();
				}
				
			}
			

			var uploadPhoto = function (imageURI) {
				var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1)+".jpg";
				fileSelected = options.fileName;
				//options.fileName=fileObjectID+'.jpg';
				options.mimeType = "image/jpeg";
				options.chunkedMode = true;
	 
				var params = new Object();
				params.fileObjectID = fileObjectID;
				params.projectID = projectID;
				console.log('[uploadPhoto()] params.projectID = %s', params.projectID);
				console.log('[uploadPhoto()] params.fileObjectID = %s', params.fileObjectID);
				
	 
				options.params = params;
				options.chunkedMode = true;
	 
				var ft = new FileTransfer();
				ft.upload(imageURI, starServerURL+"/upload", uploadSuccess_cb, uploadFail_cb, options);
				//$('#btn'+fileObjectID).html('檔案上傳中....');
				$('#div'+fileObjectID).html('檔案上傳中....');
			} 
			*/
            
			var getPhotoFail = function (message) {
				//alert('没有選到相片，請再選一次！');
			}
			
            
            var gotoPhotoCropper = function (imageURI) {
                
                fileSelectedURI = imageURI;
                
                if ( (device.version == "6.0") || (device.version == "6.0.1") || (device.version == "6.1") ) {
                    
                    //Here is the workaround for iOS 6.0 and 6.0.1 subsampling issue (when drawing from a more-than-2M jpg to canvas)
                    var tempImg = new Image();
                    tempImg.src = imageURI;
                    tempImg.onload = function() {
                        EXIF.getData( tempImg, function(){
                            var orientation = EXIF.getTag(tempImg, "Orientation");
                            subsamplingResize(imageURI, { maxWidth: 960, maxHeight: 960, orientation: orientation }, function(resultURI){
                                fileProcessedForCropperURI = resultURI;
                                $.mobile.changePage("photo_cropper.html");
                            });
                       });
                        
                    };

                    
                }
                else {
                    fileProcessedForCropperURI = imageURI;
                    $.mobile.changePage("photo_cropper.html");
                    
                }
                
                console.log("version="+device.version);
                
            }

			if ( event.data.PhotoSource == "album" ) {
                navigator.camera.getPicture(gotoPhotoCropper, getPhotoFail,{
                    quality: 50, 
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                });
                FmMobile.analysis.trackEvent("Button", "Click", "Album", 21);
            }
            else {
                navigator.camera.getPicture(gotoPhotoCropper, getPhotoFail,{
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.CAMERA
                });
                FmMobile.analysis.trackEvent("Button", "Click", "Album", 22);
            }
			
			
			

		}
	
		var getCustomizableObject_cb = function(xmlDoc) {
			var customizableObjectsXml = xmlDoc.getElementsByTagName("customizable_object");

			itemContentIsReady = Array(customizableObjectsXml.length);
            
			for (var i=0; i<customizableObjectsXml.length; i++) {
				var objID = customizableObjectsXml[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
				var objFormat = customizableObjectsXml[i].getElementsByTagName("format")[0].childNodes[0].nodeValue;
				var objDescription = customizableObjectsXml[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
				var objKeyFrame = customizableObjectsXml[i].getElementsByTagName("key_frame")[0].childNodes[0].nodeValue;
                
                customizableObjectDimensions[objID] = {
                    width: customizableObjectsXml[i].getElementsByTagName("original_width")[0].childNodes[0].nodeValue,
                    height: customizableObjectsXml[i].getElementsByTagName("original_height")[0].childNodes[0].nodeValue };
				/*
				var imgkeyFrame = $('<img>').attr('src', './template/'+templateID+'/'+objKeyFrame);
				var btnSelectFile = $('<a>').html("選擇相簿").attr('id','btn'+objID).attr('data-role','button');
                var btnTakePickture = $('<a>').html("使用相機").attr('id','btn2'+objID).attr('data-role','button');
                var btnContainer = $('<div>').attr({"id":"divBtnContainer"});
				$('#customizable_object_list').append( $('<p>').html(imgkeyFrame) );
                $('#customizable_object_list').append( btnContainer );
                $('#divBtnContainer').append( $('<p>').html(btnTakePickture) );
				$('#divBtnContainer').append( $('<p>').html(btnSelectFile) );
				$('#customizable_object_list').append( $('<div>').attr('id','div'+objID));
				$('#customizable_object_list').append('<br>');
				$('#btn'+objID).addClass("fm_grayBtn_s");
                $('#btn2'+objID).addClass("fm_grayBtn_s");
				$('#btn'+objID).button();
                $('#btn2'+objID).button();
				$('img').width('100%');
				$('#btn'+objID).bind( "click", { objectID: objID, objectIndex: i, PhotoSource: "album" }, buttonClick_cb);
				$('#btn2'+objID).bind( "click", { objectID: objID, objectIndex: i, PhotoSource: "camera" }, buttonClick_cb);
                */
                
                $('#movieKeyFrame').attr('src', './template/'+templateID+'/'+objKeyFrame);
                
				$('#btnUseCamera').bind( "click", { objectID: objID, objectIndex: i, PhotoSource: "camera" }, buttonClick_cb);
				$('#btnUseAlbum').bind( "click", { objectID: objID, objectIndex: i, PhotoSource: "album" }, buttonClick_cb);
                
				
				customizableObjects[i] = new Object();
				customizableObjects[i].ID = objID;
				customizableObjects[i].format = objFormat;
			}
		}
	
	
		//console.log('enter movieCreatePg');
		
		
		$.ajax({
			url: './template/'+templateID+'/template_customizable_object_list.xml',
			dataType: 'xml',
			success: getCustomizableObject_cb		
		});
		
		/*
		var btnSubmit1Click_cb = function () {
			//console.dir(customizedContent);
			$.post(starServerURL+'/upload_user_data_info', customizedContent, function(result){
				console.dir(result);
			});
            
            //go back to home.html
            //TODO: find a better way to go bakc to home.html
			//$.mobile.changePage("home.html", {changeHash: false});
            $('#movieCreatePg').live('pagehide',function(event, ui){
                history.back();
            });
            history.back();
             
		}
		
		$('#btnSubmit1').bind( "click", btnSubmit1Click_cb);
		$('#movieCreatePgFooter').hide();
		*/
	}
}

FmMobile.photoSelectPopupPg = {
	//  Page constants.
    PAGE_ID: "photoSelectPopupPg",
    
    getPhotoFail: function (message) {
        alert('没有選到相片，請再選一次！');
    },
    
    
    gotoPhotoCropper: function (imageURI) {
        
        fileSelectedURI = imageURI;
        
        //Here is the workaround for iOS6 subsampling issue (when drawing from a more-than-2M jpg to canvas)
        subsamplingResize(imageURI, { maxWidth: 960, maxHeight: 960 }, function(resultURI){
                          fileProcessedForCropperURI = resultURI;
                          $.mobile.changePage("photo_cropper.html");
                          });
        
        //fileProcessedForCropperURI = imageURI;
        
        
    },
    
        
        //  Page methods.
    onUseCameraBtnClick: function(event, data){
        navigator.camera.getPicture(FmMobile.photoSelectPopupPg.gotoPhotoCropper, FmMobile.photoSelectPopupPg.getPhotoFail,{
                                    quality: 50,
                                    destinationType: navigator.camera.DestinationType.FILE_URI,
                                    sourceType: navigator.camera.PictureSourceType.CAMERA
                                    });
    },
    
    onUsePhotoAlbumBtnClick: function(event, data){
        navigator.camera.getPicture(FmMobile.photoSelectPopupPg.gotoPhotoCropper, FmMobile.photoSelectPopupPg.getPhotoFail,{
                                    quality: 50,
                                    destinationType: navigator.camera.DestinationType.FILE_URI,
                                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                                    });
    }
}



FmMobile.photoCropperPg = {
	//  Page constants.
    PAGE_ID: "photoCropperPg",
	
	//myPhotoCropper: null,
    stageAllowableWidth: 0,
    stageAllowableHeight: 0,
    
    //  Page methods.
    load: function(event, data){
        stageAllowableWidth = window.innerWidth;
        stageAllowableHeight = window.innerHeight*0.9;
        var cropperWidthToHeightRatio = customizableObjectDimensions[fileObjectID].width / customizableObjectDimensions[fileObjectID].height;
		myPhotoCropper = new PhotoCropper("photo_cropper_container", stageAllowableWidth, stageAllowableHeight,  fileProcessedForCropperURI, cropperWidthToHeightRatio);
        
	},

    show: function(event, data){
        var stageWidth = $("#photo_cropper_container > div").width();
        var stageX = (stageAllowableWidth-stageWidth)/2;

        var stageHeight = $("#photo_cropper_container > div").height();
        var stageY = (stageAllowableHeight-stageHeight)/2;
        
        $("#photo_cropper_container > div").css("left", stageX.toString()+"px");
        $("#photo_cropper_container").css({"position":"absolute", "bottom":stageY.toString()+"px"});
        
        FmMobile.analysis.trackPage("/photo_cropper.html");
        recordUserAction("enters photoCropperPg");
    },
	
    
	onOkBtnClick: function() {
		croppedArea = myPhotoCropper.getCroppedArea();
		var rawPhotoImg = new Image();
		rawPhotoImg.src = fileProcessedForCropperURI;
		rawPhotoImg.onload = function(){ 
			var sourceCanvas = document.createElement("canvas");
			var sourceCanvasContext = sourceCanvas.getContext("2d");
			sourceCanvas.width = rawPhotoImg.width;
			sourceCanvas.height = rawPhotoImg.height;
			sourceCanvasContext.drawImage(rawPhotoImg, 0, 0);
			//console.dir(tempCanvas);
			var destinationCanvas = document.createElement("canvas");
			var destinationCanvasContext = destinationCanvas.getContext("2d");
			destinationCanvas.width = rawPhotoImg.width*croppedArea.width;
			destinationCanvas.height = rawPhotoImg.height*croppedArea.height;
			destinationCanvasContext.drawImage(sourceCanvas,
                                               rawPhotoImg.width*croppedArea.x,
                                               rawPhotoImg.height*croppedArea.y,
                                               rawPhotoImg.width*croppedArea.width,
                                               rawPhotoImg.height*croppedArea.height,
                                               0, 0,
                                               destinationCanvas.width,
                                               destinationCanvas.height);
			photoCroppedURI = destinationCanvas.toDataURL();
			$.mobile.changePage("movie_preview.html");
		}
        FmMobile.analysis.trackEvent("Button", "Click", "Crop", 23);
	}
}


FmMobile.moviePreviewPg = {
	//  Page constants.
    PAGE_ID: "moviePreviewPg",
    
    //  Page methods.
    show: function(){
        FmMobile.analysis.trackPage("/movie_preview.html");
        recordUserAction("enters moviePreviewPg");
    },
    
    load: function(event, data){
		
		//var templateID = "rotate"; //TODO: pass a parameter to set
		//var customizableObjectToPreview = "map" //TODO: pass a parameter to set
		var templateID = "miixcard"; //TODO: pass a parameter to set
        var templateID = "greeting"; //TODO: pass a parameter to set
		var customizableObjectToPreview = "greeting_photo" //TODO: pass a parameter to set
		var templatePreviewKeyFrames = new Array();
		var actualWidth, actualHeight;
		
		//for test
		var cornerImg = new Image();
		cornerImg.src = "./img/_corner.png";
        

        //$('#divStatus').html("照片上傳中，成功後即開始影像合成，合成完成後會通知您去分享給朋友！"); //for test
        
        $('#divStatus').hide();
        $('#photoSubmitButtons').show();


		
		var renderPreviewKeyFrames = function() {
			
			
			var previewWidth = window.innerWidth;
			var previewHeight = previewWidth * actualHeight/actualWidth;
			var imglist;
			var previewBg;

			//$("#moviePreviewArea").css({"position":"static", "height":(previewHeight+20).toString()+"px"});

			
			//for test
			var vertices;
			var indices;
			var uvtData;
				
			var imgData = new Array();
			for (var i=0; i<templatePreviewKeyFrames.length; i++) {
				var anImgDataItem = {name:"frame_"+String(i),path:'./template/'+templateID+'/'+templatePreviewKeyFrames[i].BgSource};
				imgData.push(anImgDataItem);
			}
			
			imgData.push( {name:"customizableObj",path:photoCroppedURI} );
			
			//for test
			imgData.push( {name:"marker",path:"./img/_corner.png"} );
			
			
			var previewInit = function(result) {
				LGlobal.setDebug(true);
				imglist = result;
				
				
				var previewImgActualWidth = imglist["frame_0"].width;
				//var previewImgActualHeight = imglist["frame_0"].height;
				var r = previewWidth/actualWidth; //the zooming factor
				var r_previewImg = previewWidth/previewImgActualWidth; //the zooming factor with respect to actual preview image
				
				var customizableObjWidth = imglist["customizableObj"].width;
				var customizableObjHeight = imglist["customizableObj"].height;
				
				var markerUL, markerUR, markerLL, markerLR, markerC, markerUp, markerLow, markerL, markerR;
				var P_UL, P_UR, P_LL, P_LR, P_C, P_Up, P_Low, P_L, P_R;
				var P_UL_r, P_UR_r, P_LL_r, P_LR_r, P_C_r, P_Up_r, P_Low_r, P_L_r, P_R_r; //points with coordinates relative to Upper Left corner
				
				//bitmapData = new LBitmapData(imglist["frame_0"]);
				for (var i=0; i<templatePreviewKeyFrames.length; i++) {
					templatePreviewKeyFrames[i].bitmapData = new LBitmapData(imglist["frame_"+String(i)]);
				}
				//for test
				var markerBitmapData = new LBitmapData(imglist["marker"]);
				var customizableObjBitmapData = new LBitmapData(imglist["customizableObj"]);
				var customizableObjImage;
				
				/*
				previewBg = new LBitmap(bitmapData);
				var r = previewWidth/imglist["frame_0"].width; //the zooming facotr
				previewBg.scaleX = r;
				previewBg.scaleY = r;
				addChild(previewBg);
				*/
				

				
				var k = 0;
				var l;
                
				var onFrame = function(){
					previewBg.graphics.clear();
					previewBg.graphics.beginBitmapFill(templatePreviewKeyFrames[k].bitmapData);
					previewBg.graphics.drawRect(1,"#000",[0,0,actualWidth,actualHeight]);
					
					l = (k-1)%templatePreviewKeyFrames.length; //5 frames lag??
					if (l < 0 ) {
						l += templatePreviewKeyFrames.length;
					}
					
					P_UL = new Point( templatePreviewKeyFrames[l].Obj_UL_x*r, templatePreviewKeyFrames[l].Obj_UL_y*r );
					P_UR = new Point( templatePreviewKeyFrames[l].Obj_UR_x*r, templatePreviewKeyFrames[l].Obj_UR_y*r );
					P_LL = new Point( templatePreviewKeyFrames[l].Obj_LL_x*r, templatePreviewKeyFrames[l].Obj_LL_y*r );
					P_LR = new Point( templatePreviewKeyFrames[l].Obj_LR_x*r, templatePreviewKeyFrames[l].Obj_LR_y*r );
					/*
					P_C = getDiagonalIntersection( new Point(markerUL.x,markerUL.y), new Point(markerUR.x, markerUR.y),
														new Point(markerLL.x, markerLL.y), new Point(markerLR.x, markerLR.y) );
														*/
					P_Up = getMidPoint(P_UL, P_UR);
					P_Low = getMidPoint(P_LL, P_LR);
					P_L = getMidPoint(P_UL, P_LL);
					P_R = getMidPoint(P_UR, P_LR);
					P_C = getMidPoint(P_Up, P_Low);
					
					P_UL_r = new Point(0, 0);
					P_UR_r = P_UR.relativeTo( P_UL );
					P_LL_r = P_LL.relativeTo( P_UL );
					P_LR_r = P_LR.relativeTo( P_UL );
					P_C_r = P_C.relativeTo( P_UL );
					P_Up_r = P_Up.relativeTo( P_UL );
					P_Low_r = P_Low.relativeTo( P_UL );
					P_L_r = P_L.relativeTo( P_UL );
					P_R_r = P_R.relativeTo( P_UL );
					
					customizableObjImage.x = P_UL.x;
					customizableObjImage.y = P_UL.y;
					
					vertices = [P_UL_r.x, P_UL_r.y, P_L_r.x, P_L_r.y, P_LL_r.x, P_LL_r.y, 
								P_Up_r.x, P_Up_r.y, P_C_r.x, P_C_r.y, P_Low_r.x, P_Low_r.y, 
								P_UR_r.x, P_UR_r.y, P_R_r.x, P_R_r.y, P_LR_r.x, P_LR_r.y];
					customizableObjImage.graphics.clear();
					customizableObjImage.graphics.beginBitmapFill(customizableObjBitmapData);
					customizableObjImage.graphics.drawTriangles(vertices, indices, uvtData);
					
					/*
					//for test
					markerUL.x = P_UL.x-10;
					markerUL.y = P_UL.y-10; 
					markerUR.x = P_UR.x-10;
					markerUR.y = P_UR.y-10;
					markerLL.x = P_LL.x-10;
					markerLL.y = P_LL.y-10;
					markerLR.x = P_LR.x-10;
					markerLR.y = P_LR.y-10;
					markerC.x = P_C.x-10;
					markerC.y = P_C.y-10;
					markerUp.x = P_Up.x-10;
					markerUp.y = P_Up.y-10;
					markerLow.x = P_Low.x-10;
					markerLow.y = P_Low.y-10;
					markerL.x = P_L.x-10;
					markerL.y = P_L.y-10;
					markerR.x = P_R.x-10;
					markerR.y = P_R.y-10;
					*/
					

					
					k++;
					if ( k >= templatePreviewKeyFrames.length ) {
						k = 0;
					}
				}
                
                				
				previewBg = new LSprite();
				addChild(previewBg);
				previewBg.scaleX = r_previewImg;
				previewBg.scaleY = r_previewImg;

				/*
				//for test
				markerUL = new LBitmap(markerBitmapData);
				markerUR = new LBitmap(markerBitmapData);
				markerLL = new LBitmap(markerBitmapData);
				markerLR = new LBitmap(markerBitmapData);
				markerC = new LBitmap(markerBitmapData);
				markerUp = new LBitmap(markerBitmapData);
				markerLow = new LBitmap(markerBitmapData);
				markerL = new LBitmap(markerBitmapData);
				markerR = new LBitmap(markerBitmapData);
				addChild(markerUL);
				addChild(markerUR);
				addChild(markerLL);
				addChild(markerLR);
				addChild(markerC);
				addChild(markerUp);
				addChild(markerLow);
				addChild(markerL);
				addChild(markerR);
				*/
				
				indices = new Array();
				//这里用之前的6个点将图形分成4个三角形
				indices.push(0, 3, 1);
				indices.push(3, 1, 4);
				indices.push(1, 4, 2);
				indices.push(4, 2, 5);
				indices.push(3, 6, 4);
				indices.push(6, 4, 7);
				indices.push(4, 7, 5);
				indices.push(7, 5, 8);
				uvtData = new Array();
				//这里是定义6各点原来应在的位置
				uvtData.push(0, 0);
				uvtData.push(0, 0.5);
				uvtData.push(0, 1);
				uvtData.push(0.5, 0);
				uvtData.push(0.5, 0.5);
				uvtData.push(0.5, 1);
				uvtData.push(1, 0);
				uvtData.push(1, 0.5);
				uvtData.push(1, 1);
				
				var customizableObjImage = new LSprite();
				addChild(customizableObjImage);
				//previewBg.addChild(customizableObjImage);

				
				previewBg.addEventListener(LEvent.ENTER_FRAME,onFrame);
                $("#moviePreview").bind("stopPreviewAnimation", function(e){
                    previewBg.removeEventListener(LEvent.ENTER_FRAME,onFrame);
                });

                
                var onHide = function(){
                    previewBg.removeEventListener(LEvent.ENTER_FRAME, onFrame);
                    removeChild(previewBg);
                    removeChild(customizableObjImage);
                    $("#moviePreview").empty();
                    
                };
                
                $("#moviePreviewPg").live("pagehide", onHide);
                
				
			
			}
			
			var main = function() {
				LLoadManage.load(imgData,null,previewInit);
			}
			
			init(250,"moviePreview",previewWidth,previewHeight,main,LEvent.INIT);
		}
		
		var getTemplatePreviewKeyFrames_cb = function(xmlDoc) {
		
			//read preview key frame info from [customizable object ID].xml
			var templatePreviewKeyFramesXml = xmlDoc.getElementsByTagName("preview_key_frame");
			var numberOftemplatePreviewKeyFrames = templatePreviewKeyFramesXml.length;
			for (var i=0; i<numberOftemplatePreviewKeyFrames; i++) {
				var aTemplatePreviewKeyFrame;
                if ( templatePreviewKeyFramesXml[i].getElementsByTagName("overlaid_customizable_object")[0] ) {
                    aTemplatePreviewKeyFrame={
                        BgSource: templatePreviewKeyFramesXml[i].getElementsByTagName("source")[0].childNodes[0].nodeValue,
                        Obj_UL_x: templatePreviewKeyFramesXml[i].getElementsByTagName("upper_left_corner_x")[0].childNodes[0].nodeValue,
                        Obj_UL_y: templatePreviewKeyFramesXml[i].getElementsByTagName("upper_left_corner_y")[0].childNodes[0].nodeValue,
                        Obj_UR_x: templatePreviewKeyFramesXml[i].getElementsByTagName("upper_right_corner_x")[0].childNodes[0].nodeValue,
                        Obj_UR_y: templatePreviewKeyFramesXml[i].getElementsByTagName("upper_right_corner_y")[0].childNodes[0].nodeValue,
                        Obj_LL_x: templatePreviewKeyFramesXml[i].getElementsByTagName("lower_left_corner_x")[0].childNodes[0].nodeValue,
                        Obj_LL_y: templatePreviewKeyFramesXml[i].getElementsByTagName("lower_left_corner_y")[0].childNodes[0].nodeValue,
                        Obj_LR_x: templatePreviewKeyFramesXml[i].getElementsByTagName("lower_right_corner_x")[0].childNodes[0].nodeValue,
                        Obj_LR_y: templatePreviewKeyFramesXml[i].getElementsByTagName("lower_right_corner_y")[0].childNodes[0].nodeValue
                    };
                }
                else {
                    aTemplatePreviewKeyFrame={
                        BgSource: templatePreviewKeyFramesXml[i].getElementsByTagName("source")[0].childNodes[0].nodeValue,
                        Obj_UL_x: 0,
                        Obj_UL_y: 0,
                        Obj_UR_x: 0,
                        Obj_UR_y: 0,
                        Obj_LL_x: 0,
                        Obj_LL_y: 0,
                        Obj_LR_x: 0,
                        Obj_LR_y: 0
                    };
                    
                }
				templatePreviewKeyFrames.push(aTemplatePreviewKeyFrame);
			}
			
			renderPreviewKeyFrames();
		}
	
		var getTemplateDescription_cb = function(xmlDoc) {
			actualWidth  = xmlDoc.getElementsByTagName("composition_width")[0].childNodes[0].nodeValue;
			actualHeight = xmlDoc.getElementsByTagName("composition_height")[0].childNodes[0].nodeValue;

	
			$.ajax({
				url: './template/'+templateID+'/preview_keyframe_des_'+customizableObjectToPreview+'.xml',
				dataType: 'xml',
				success: getTemplatePreviewKeyFrames_cb		
			});
		}

        //get cropped image
        croppedArea = myPhotoCropper.getCroppedArea();
		var rawPhotoImg = new Image();
		rawPhotoImg.src = fileProcessedForCropperURI;
		rawPhotoImg.onload = function(){
			var sourceCanvas = document.createElement("canvas");
			var sourceCanvasContext = sourceCanvas.getContext("2d");
			sourceCanvas.width = rawPhotoImg.width;
			sourceCanvas.height = rawPhotoImg.height;
			sourceCanvasContext.drawImage(rawPhotoImg, 0, 0);
			//console.dir(tempCanvas);
			var destinationCanvas = document.createElement("canvas");
			var destinationCanvasContext = destinationCanvas.getContext("2d");
			destinationCanvas.width = rawPhotoImg.width*croppedArea.width;
			destinationCanvas.height = rawPhotoImg.height*croppedArea.height;
			destinationCanvasContext.drawImage(sourceCanvas,
                                               rawPhotoImg.width*croppedArea.x,
                                               rawPhotoImg.height*croppedArea.y,
                                               rawPhotoImg.width*croppedArea.width,
                                               rawPhotoImg.height*croppedArea.height,
                                               0, 0,
                                               destinationCanvas.width,
                                               destinationCanvas.height);
			photoCroppedURI = destinationCanvas.toDataURL();
			$.mobile.changePage("movie_preview.html");
		}

        
		$.ajax({
			url: './template/'+templateID+'/template_description.xml',
			dataType: 'xml',
			success: getTemplateDescription_cb		
		});

		
    

	},
    
    onDoAgainBtnClick: function() {

        $.mobile.changePage("movie_create.html");
        FmMobile.analysis.trackEvent("Button", "Click", "DoAgain", 24);
        
    },
    
    onSubmitBtnClick: function() {
        var uploadFail_cb = function(error) {
            //$('#divStatus').html('檔案無法上傳伺服器，請待網路狀況好時再重試！');
            /*
            navigator.notification.alert(
                                         '喔喔！上傳失敗了。您的網路OK嗎？',  // message
                                         function(){$('#submitPhotoBtn').click();},         // callback
                                         ' ',            // title
                                         '重新上傳'                  // buttonName
                                         ); */

            var onConfirm = function(buttonIndex) {
                switch(buttonIndex) {
                    case 1:
                        $('#submitPhotoBtn').click();
                        break;
                    case 2:
                        $.mobile.changePage("myVideo.html");
                        break;
                }
            }
            navigator.notification.confirm(
                                           '喔喔！上傳失敗了。您的網路OK嗎？',  // message
                                           onConfirm,              // callback to invoke with index of button pressed
                                           ' ',            // title
                                           '重新上傳,以後再玩'          // buttonLabels
                                           );

        }
        
        
        var uploadSuccess_cb = function(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            
            //$('#divStatus').html("檔案上傳成功！");
            
            customizedContent.customizableObjects[0].content = fileSelected;
            
            //$('#div'+fileObjectID).html(fileSelected);
            /*
            customizableObjects[event.data.objectIndex].content = fileSelected;
            itemContentIsReady[event.data.objectIndex] = true;
            
            var allItemContentAreReady = true;
            for (var i=0; i<itemContentIsReady.length; i++) {
                allItemContentAreReady = allItemContentAreReady && itemContentIsReady[i];
            }
            if ( allItemContentAreReady ) {
                $('#movieCreatePgFooter').show();
            }
            */
            
            customizedContent.timeStamp = (new Date()).toISOString();
            
            
            $.post(starServerURL+'/upload_user_data_info', customizedContent, function(result){
                console.dir("upload user data info result: "+result);
                if ( !result.err ) {
                    FmMobile.addProcessingWork(projectID);
                    $.mobile.hidePageLoadingMsg();
                    $.mobile.changePage("myVideo.html");
                   
                }
            })
            .error(function() {
                /*
                navigator.notification.alert(
                                            '喔喔！上傳失敗了。您的網路OK嗎？',  // message
                                            function(){$('#submitPhotoBtn').click();},         // callback
                                            ' ',            // title
                                            '重新上傳'                  // buttonName
                                            );*/
                var onConfirm = function(buttonIndex) {
                   switch(buttonIndex) {
                       case 1:
                           $('#submitPhotoBtn').click();
                           break;
                       case 2:
                           $.mobile.changePage("myVideo.html");
                           break;
                   }
                }
                navigator.notification.confirm(
                                              '喔喔！上傳失敗了。您的網路OK嗎？',  // message
                                              onConfirm,              // callback to invoke with index of button pressed
                                              ' ',            // title
                                              '重新上傳,以後再玩'          // buttonLabels
                                              );
            });
        }
        

        var uploadPhoto = function (imageURI) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
            fileSelected = options.fileName;
            options.mimeType = "image/jpeg";
            //options.mimeType = "image/png";
            options.chunkedMode = true;
            
            var params = new Object();
            params.fileObjectID = fileObjectID;
            params.projectID = projectID;
            params.croppedArea_x = croppedArea.x;
            params.croppedArea_y = croppedArea.y;
            params.croppedArea_width = croppedArea.width;
            params.croppedArea_height = croppedArea.height;
            params.obj_OriginalWidth = customizableObjectDimensions[fileObjectID].width;
            params.obj_OriginalHeight = customizableObjectDimensions[fileObjectID].height;
            params.osVersion = "iOS_"+device.version;
            
            
            console.log('[uploadPhoto()] params.projectID = %s', params.projectID);
            console.log('[uploadPhoto()] params.fileObjectID = %s', params.fileObjectID);
            
            
            options.params = params;
            options.chunkedMode = true;
            
            var ft = new FileTransfer();

            /*
            $("div").bind(ProjectID+"__uploadFile", function(e, _uploadPercentage){
                var uploadPercentageString = ( Math.floor(_uploadPercentage*100) ).toString();
                $('#divStatus').html("檔案上傳%"+uploadPercentageString+"...");
                console.log("_uploadPercentage= "+_uploadPercentage);          
            });
            */
            
            //var upladBar = uploadingMgr.addUpload(projectID);

            ft.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var uploadPercentage = progressEvent.loaded / progressEvent.total * 100;
                    console.log("uploadPercentage=" + uploadPercentage.toString());
                    //$("div").trigger(ProjectID+"__uploadFile", [ uploadPercentage ]);

                    //upladBar.setValue(uploadPercentage);

                } else {
                    console.log("upload some chunk....");
                }
            };

            //uploadingMgr.showAll($("#moviePreviewPg_contentArea"));

            ft.upload(imageURI, starServerURL+"/upload", uploadSuccess_cb, uploadFail_cb, options);
            
            $("#moviePreview").trigger("stopPreviewAnimation");
            $('#divStatus').html("照片上傳成功後即開始影像合成，合成完成後會通知您去分享給朋友！");
            $('#divStatus').show();
            $('#photoSubmitButtons').hide();
            $.mobile.showPageLoadingMsg();
            
            /*
            $("div").bind(ProjectID+"__uploadFile", function(e, _uploadPercentage){
                var uploadPercentageString = ( Math.floor(_uploadPercentage*100) ).toString();
                $('#divStatus').html("檔案上傳%"+uploadPercentageString+"...");
                console.log("_uploadPercentage= "+_uploadPercentage);          
            });
            */
            
        }
        
        uploadPhoto(fileSelectedURI);
        FmMobile.analysis.trackEvent("Button", "Click", "Submit", 24);
        //recordUserAction("submits a Photo");

        recordUserAction("submits a Photo", true);

    }
}
		


            
