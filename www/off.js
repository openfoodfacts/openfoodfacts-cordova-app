
var moodstocksCurrentCode = 0;
var continuous_scan = false;

var lc = 'en';
var speech = 'off';

var supported_languages = {
// 'aa':'XX',
// 'ach':'XX',
// 'af':'XX',
// 'ak':'XX',
// 'am':'XX',
'ar':'العربية',
// 'as':'XX',
// 'ast':'XX',
// 'az':'XX',
// 'b+sr+Latn':'XX',
// 'be':'XX',
// 'ber':'XX',
// 'bg':'XX',
// 'bm':'XX',
// 'bn':'XX',
// 'bo':'XX',
// 'br':'XX',
// 'bs':'XX',
// 'ca':'XX',
// 'ce':'XX',
// 'chr':'XX',
// 'co':'XX',
// 'crs':'XX',
'cs':'Čeština',
// 'cv':'XX',
// 'cy':'XX',
// 'da':'XX',
'de':'Deutsch',
// 'el':'XX',
// 'en_AU':'XX',
// 'en_GB':'XX',
'en':'English',
// 'eo':'XX',
'es':'Español',
// 'et':'XX',
// 'eu':'XX',
// 'fa':'XX',
'fi':'Suomi',
// 'fil':'XX',
// 'fo':'XX',
'fr':'Français',
// 'ga':'XX',
// 'gd':'XX',
// 'gl':'XX',
'gr':'ελληνικά',
// 'gu':'XX',
// 'ha':'XX',
'he':'עברית',
// 'hi':'XX',
// 'hr':'XX',
// 'ht':'XX',
// 'hu':'XX',
// 'hy':'XX',
// 'id':'XX',
// 'ii':'XX',
// 'is':'XX',
'it':'Italiano',
// 'iu':'XX',
// 'ja':'XX',
// 'jv':'XX',
// 'ka':'XX',
// 'kab':'XX',
// 'kk':'XX',
// 'km':'XX',
// 'kn':'XX',
// 'ko':'XX',
// 'ku':'XX',
// 'kw':'XX',
// 'ky':'XX',
// 'la':'XX',
// 'lb':'XX',
// 'lo':'XX',
// 'lol':'XX',
// 'lt':'XX',
// 'lv':'XX',
// 'me':'XX',
// 'mg':'XX',
// 'mi':'XX',
// 'ml':'XX',
// 'mn':'XX',
// 'mr':'XX',
// 'ms':'XX',
// 'mt':'XX',
// 'my':'XX',
// 'nb':'XX',
// 'ne':'XX',
// 'nl':'XX',
// 'nn':'XX',
// 'no':'XX',
// 'nr':'XX',
// 'oc':'XX',
// 'or':'XX',
// 'pa':'XX',
'pl':'Polski',
// 'pt_BR':'XX',
'pt':'Português',
// 'pt':'XX',
// 'qu':'XX',
// 'rAU':'XX',
// 'rBE':'XX',
// 'rBR':'XX',
// 'rCN':'XX',
// 'rGB':'XX',
// 'rHK':'XX',
// 'rm':'XX',
'ro':'Român',
// 'rPT':'XX',
// 'rTW':'XX',
'ru':'Русский',
// 'ry':'XX',
// 'sa':'XX',
// 'sat':'XX',
// 'sc':'XX',
// 'sco':'XX',
// 'sd':'XX',
// 'sg':'XX',
// 'sh':'XX',
// 'si':'XX',
// 'sk':'XX',
// 'sl':'XX',
// 'sma':'XX',
// 'sn':'XX',
// 'so':'XX',
// 'son':'XX',
// 'sq':'XX',
// 'sr':'XX',
// 'sr@latin':'XX',
// 'ss':'XX',
// 'st':'XX',
// 'sv':'XX',
// 'sw':'XX',
// 'ta':'XX',
// 'te':'XX',
// 'tg':'XX',
// 'th':'XX',
// 'ti':'XX',
// 'tl':'XX',
// 'tn':'XX',
'tr':'Türk',
// 'ts':'XX',
// 'tt':'XX',
// 'tw':'XX',
// 'ty':'XX',
// 'tzl':'XX',
// 'ug':'XX',
// 'uk':'XX',
// 'ur':'XX',
// 'uz':'XX',
// 'val':'XX',
// 've':'XX',
// 'vec':'XX',
// 'vi':'XX',
// 'vls':'XX',
// 'wa':'XX',
// 'wo':'XX',
// 'xh':'XX',
// 'yi':'XX',
// 'yo':'XX',
// 'zea':'XX',
// 'zh_CN':'XX',
// 'zh':'XX',
'zh':'中文',
// 'zu':'XX',
}

var code;

var scanning = false;



// This state represents the state of our application and will be saved and
// restored by onResume() and onPause()
var appState = {
	code : 0,
    takingPicture: true,
    imageUri: ""
};

var APP_STORAGE_KEY = "OpenFoodFactsAppState";

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReady: function() {
        document.getElementById("take-picture-button").addEventListener("click", function() {
            // Because the camera plugin method launches an external Activity,
            // there is a chance that our application will be killed before the
            // success or failure callbacks are called. See onPause() and
            // onResume() where we save and restore our state to handle this case
            appState.takingPicture = true;

            navigator.camera.getPicture(cameraSuccessCallback, cameraFailureCallback,
                {
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.FILE_URI,
                    targetWidth: 250,
                    targetHeight: 250
                }
            );
        });
    },
    onPause: function() {
        // Here, we check to see if we are in the middle of taking a picture. If
        // so, we want to save our state so that we can properly retrieve the
        // plugin result in onResume(). We also save if we have already fetched
        // an image URI
        if(appState.takingPicture || appState.imageUri) {
            window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
        }
    },
    onResume: function(event) {
        // Here we check for stored state and restore it if necessary. In your
        // application, it's up to you to keep track of where any pending plugin
        // results are coming from (i.e. what part of your code made the call)
        // and what arguments you provided to the plugin if relevant
        var storedState = window.localStorage.getItem(APP_STORAGE_KEY);

        if(storedState) {
            appState = JSON.parse(storedState);
        }

        // Check to see if we need to restore an image we took
        if(!appState.takingPicture && appState.imageUri) {
            document.getElementById("get-picture-result").src = appState.imageUri;
        }
        // Now we can check if there is a plugin result in the event object.
        // This requires cordova-android 5.1.0+
        else if(appState.takingPicture && event.pendingResult) {
            // Figure out whether or not the plugin call was successful and call
            // the relevant callback. For the camera plugin, "OK" means a
            // successful result and all other statuses mean error
            if(event.pendingResult.pluginStatus === "OK") {
                // The camera plugin places the same result in the resume object
                // as it passes to the success callback passed to getPicture(),
                // thus we can pass it to the same callback. Other plugins may
                // return something else. Consult the documentation for
                // whatever plugin you are using to learn how to interpret the
                // result field
                cameraSuccessCallback(event.pendingResult.result);
            } else {
                cameraFailureCallback(event.pendingResult.result);
            }
        }
    }
}

// Here are the callbacks we pass to getPicture()
function cameraSuccessCallback(imageUri) {
    appState.takingPicture = false;
    appState.imageUri = imageUri;
    document.getElementById("get-picture-result").src = imageUri;
}

function cameraFailureCallback(error) {
    appState.takingPicture = false;
    console.log(error);
}

//app.initialize();


console.log("start");






var uploads_in_progress = 0;


            function onBodyLoad() {
            
            	document.addEventListener("deviceready", onDeviceReady, false);
            
            	console.log("onBodyLoad()");
            	
                scanButton = document.getElementById("scanButton");
            }



            // When scanner is dismissed, display the menu and hide the overlay
            function scannerOff() {
                overlayContainer.style.display = "none";
                //menuContainer.style.display = "inline";
                 console.log("scannerOff");
            }

            // When scanner is launched, hide the menu and show the overlay
            function scannerOn() {
                overlayContainer.style.display = "inline";
                //menuContainer.style.display = "none";
                console.log("scannerOn");
            }

            // Scan callbacks
            function scanSuccess(format, value) {
                
				
				console.log("scan_success - setting continuous_scan to true");
				continuous_scan = true;

                code = value;
                code = code.replace(/-(.*)/, "");
                

                console.log("scan - format: " + format + " - value - " + value);                                
                console.log("moodstocksCurrentCode: " + moodstocksCurrentCode + " - code: " + code);
                
                
                if (code != moodstocksCurrentCode) {
                                
                
                // if (((format == 'EAN13') || (format == 'EAN_13') || (format == 'EAN8') || (format == 'EAN_8')) && (code != '')) {
                if ((code != '')) {
                
                	
                	moodstocksCurrentCode = code;
                	$.mobile.changePage("#page_product?code=" + code, { transition: "none" });
             
                	
                }
                
                else if (value != code) {
                
                	moodstocksCurrentCode = code;
                
	                b64 = value;
	                b64 = b64.replace(/\n/,"");
	                b64 = b64.replace(/(.*?)-/, "");
	                
	                json = Base64.decode(b64);
	                json = json.replace(/\}([^\}]*)/,'}');
	                
	                data = JSON.parse(json);
	                
	                html = "<h2>" + data.name + "</h2>";
	                
	                if (speech == 'on') {	                
	                	window.plugins.tts.speak(data.name);
	                }
	                
	                if ((data.brands != null) && (data.brands != '')) {
	                	html += "<p>" + data.brands + "</p>";
	                	if (speech == 'on') {
	                		window.plugins.tts.speak(data.brands);
	                	}
	                }
	                
	                console.log("scan - value - json - " +  json);
	                
	                if (data.grade != null) {
	                	html += '<p><img src="images/' + data.grade + '.300x64.png" width="300" height="64" style="max-width:100%" /></p>';
	                }
	                
	                
nutrient_levels = [
['fat', 3, 20, 'Lipides' ],
['saturated', 1.5, 5, 'Acides gras saturés'],
['sugar', 5, 12.5, 'Sucres'],
['salt', 0.3, 1.5, 'Sel']
];

levels = {
"low" : "en faible quantité",
"moderate" : "en quantité modérée",
"high" : "en quantité élevée"
};



var length = nutrient_levels.length,
    element = null;
for (var i = 0; i < length; i++) {
  element = nutrient_levels[i];

	nid = nutrient_levels[i][0];
	low = nutrient_levels[i][1];
	high = nutrient_levels[i][2];
	nutrient = nutrient_levels[i][3];
	
	
	if ((data[nid] != null) && (data[nid] != '')) {
			
		if (data.drink) {
			low = low/2;
			high = high/2;
		}
		
		level = "moderate";
		if (data[nid] <= low) {
			level = "low";
		}
		if (data[nid] > high) {
			level = "high";
		}
		
		
		html += '<img src="images/' + level + '_30.png" width="30" height="30" style="vertical-align:middle;margin-right:15px;margin-bottom:4px;" alt="' + level + '" />' 	
			+ data[nid] + " g <b>" + nutrient + "</b> " + levels[level] + "<br />"; 
			
	
	} 
	
	
}

		if (data.additives == 0) {
			html += "<p>Ne contient pas d'additifs.</p>";
		}
		if (data.additives == 1) {
			html += "<p>Contient 1 additifs</p>";
		}
		if (data.additives > 1) {
			html += "<p>Contient " + data.additives + " additifs.</p>";
		}	
        
		$("#more_info_link").attr('href','#page_product?code=' + code);
	               
	                                
	    $("#moodstocksOverlayTitle").text(data.name);
	    $("#moodstocksOverlayContent").html(html);
	   	$("#moodstocksOverlayContent").i18n();
	   
	                
		$("#page_moodstocks_overlay").on("pagehide",function(event){
  						moodstocksCurrentCode = 0;
  						console.log('pagebeforehide');
		}); 		                
	    $('#page_moodstocks_overlay').live('pagebeforehide',function(event) {
          console.log('pagehide');
          moodstocksCurrentCode = 0;
        
      });
      
		
	                
	                $.mobile.changePage('#page_moodstocks_overlay', { role: "dialog", transition: "none" } );
	                
                   }
            }
            }

            function scanCancelled() {
            	console.log("scanCancelled");
                scannerOff();
            }

            function scanFailure(result) {
                //resultSpan.innerHTML = "Failure: " + JSON.stringify(result);
				console.log("scannerFailure");
            }

            // Scan button
            function clickScan() {
            	console.log("clickScan()");
            	
				   cordova.plugins.barcodeScanner.scan(
      function (result) {
          //alert("We got a barcode\n" +
          //      "Result: " + result.text + "\n" +
          //      "Format: " + result.format + "\n" +
          //      "Cancelled: " + result.cancelled);
				
				scanSuccess(result.format, result.text);
      },
      function (error) {
          //alert("Scanning failed: " + error);
		  console.log("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Place a barcode inside the scan area", // supported on Android only
          "formats" : "UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
          //"orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
		"disableSuccessBeep" : true
      }
   );

				
            	if (speech == 'on') {            	
            		window.plugins.tts.speak($.i18n("msg_tts_scan_product"));
            	}          	
            }
            
            
            
	function update_speech() {
		$('#speech').val(speech);
		if (speech == 'on') {
      		var language = lc;
      		if (language == 'en') {
      			language = 'en_US';
      		}
      		window.plugins.tts.isLanguageAvailable(language, function() {
      		console.log("trying to load text to speech for language " + language);
   				window.plugins.tts.setLanguage(language, updateLanguageWin, fail);
   			}, fail);
      	}	
	}
	
	function update_speech_value() {
		speech = $('#speech option:selected').val();
		window.localStorage.setItem("speech", speech);
		update_speech();
	}            
	
	

function onDeviceReady() {

console.log("onDeviceReady");


$.ajaxPrefilter(function(options) {
	console.log("ajaxPrefilter");

    if (options.xhrConstructParam) {
        options.xhr = function() {
            return new window.XMLHttpRequest(options.xhrConstructParam);
        }
    }
});

//for FirefoxOS (require "mozSystem" param in AJAX calls)
var xhrConstructParam = null;
xhrConstructParam = {
    mozSystem: true
};

console.log("ajaxSetup");


//default settings for AJAX methods
$.ajaxSetup({
    xhrConstructParam: xhrConstructParam
});


	console.log("onDeviceReady()");
    // Now safe to use the PhoneGap API
    document.addEventListener("menubutton", onMenuKeyDown, false);
    

                // open the scanner setting your apikey & apisecrect
                //MoodstocksPlugin.open(openSuccess, openFailure);
                
		scanButton.addEventListener("click", clickScan, false);
				
  $('#page_home').live('pagebeforeshow',function(event) {
          console.log('#page_home pagebeforeshow 2');
    if (scanning) {
		console.log("turning off scanner");
		//MoodstocksPlugin.dismiss(scannerOff,null);
	}			

		
		
      });				
				
 
    $('#page_moodstocks_scan').live('pageshow',function(event) {
          console.log('#page_moodstocks_scan pageshow');
		  
		  
          if (! continuous_scan) {
    	moodstocksCurrentCode = 0;
		

	scanOptions = {
      image: true,
      ean8: true,
      ean13: true,
      qrcode: false,
      dmtx: false
    };

    scanFlags = {
      useDeviceOrientation: false,
      noPartialMatching: true,
      smallTargetSupport: false
    };
				
        //MoodstocksPlugin.scan(scanSuccess, scanCancelled, scanFailure, buildScanOptions(), false, true, false);
		console.log("continuous_scan is false, starting moodstocks scanner : MoodstocksPlugin.scan");
        //MoodstocksPlugin.scan(scanSuccess, scanCancelled, scanFailure, scanOptions, scanFlags);
        //scannerOn();
        }
		else {
			console.log("continuous_scan was true, resuming moodstocks scanner");
			//MoodstocksPlugin.resume();
		}
        continuous_scan = false;
		
		scanning = true;
		

		
		
      });
    $('#page_moodstocks_scan').live('pagehide',function(event) {
    	 if (! continuous_scan) {
          console.log('#page_moodstocks_scan pagehide');
          moodstocksCurrentCode = 0;
          
        }
		//scanning = false;
      });     
      if (speech == 'on') {
      	window.plugins.tts.startup(startupWin, fail);
      }
}

    
    function startupWin(result) {
		// When result is equal to STARTED we are ready to play
		if (result == TTS.STARTED) {
			window.plugins.tts.getLanguage(win, fail); 
			update_speech();  
		}
    }
    
    function updateLanguageWin(result) {
		window.plugins.tts.speak($.i18n("msg_tts_hello"));
    }    
	

	function win(result) {
		console.log(result);
	}
    
    function fail(result) {
        console.log("Error = " + result);
    }



function update_language() {

	$('#language').val(lc);

	$("form").each(function () {
		var action = $(this).attr("action");
		if (action) {
			$(this).attr("action", action.replace(/\/(world-)?(..)\.openfoodfacts\.org/, '/world-' + lc + '.openfoodfacts.org'));
		}
		});
		
	$(".i18n").i18n();
	
	show_login();
}


jQuery( document ).ready( function ( $ ) {

	console.log("jquery document ready");


	if (window.localStorage.getItem("speech")) {
		speech = window.localStorage.getItem("speech");
		console.log("text to speech: " + speech);
	}	

	$.each(supported_languages, function (index,value) {
			$("#language").append('<option value=' + index + '>' + value + '</option>');
		}
	);

	function update_language_value() {

		lc = $('#language option:selected').val();
		i18n.locale = lc;
		window.localStorage.setItem("lc", lc);
		
		update_language();
		update_speech();
	}

	$( '#language').on( 'change keyup', update_language_value );

	$.i18n.debug = true;
	var i18n = $.i18n();		
	
	var locale = i18n.locale.replace(/_|-(.*)$/g,'');
		
	if (supported_languages[locale]) {
		lc = locale;
	}
	else {
		lc = 'en';
	}
	
	if (window.localStorage.getItem("lc")) {
		lc = window.localStorage.getItem("lc");
		i18n.locale = lc;
		console.log("language: " + speech);
	}
	
	update_language();

	$('#speech').on('change keyup', update_speech_value );

console.log("jquery document ready end");

	
} );


console.log("bah 2");


function onMenuKeyDown() {
	$.mobile.changePage('#page_parameters', {transition: 'none', role: 'dialog'});
}

// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    console.log('captureSuccess - start');    
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
		console.log('uploading file ' + i);
        uploadFile(mediaFiles[i]);
    }       
}

// Called if something bad happens.
// 
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Erreur de prise de photo - ' + error.code);
}

// A button will call this function
//
function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    //console.log('captureImage - start');
    //navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    //console.log('captureImage - end');
    getImage();    
}

function onFail(message) {
    navigator.notification.alert(msg, null, 'Erreur de prise de photo - ' + message);
	console.log('onFail - message: ' + message);
}

function getSuccess(imageURI) {
	console.log('getSuccess - start - ' + imageURI);
	uploadFile(imageURI);
	console.log('getSuccess - fail');
	
}

function getImage() {
	console.log('getImage - start');
	navigator.camera.getPicture(getSuccess, onFail, { quality: 50, targetWidth: 2000, destinationType:  Camera.DestinationType.FILE_URI });
	console.log('getImage - stop');
        
}

// Upload files to server
//function uploadFile(mediaFile) {
//    var ft = new FileTransfer(),
//        path = mediaFile.fullPath,
//        name = mediaFile.name;
        
function uploadFile_old_file_transfer_plugin(path) {
     
	var name = path;
	name = name.replace(/.*\//, "");
	
	var ft = new FileTransfer();

	console.log('Uploading image for product code: ' + code);
	console.log('Uploading image path: ' + path);
	console.log('Uploading image name: ' + name);
	
	var filename = name.replace(/\./, "_");
	var uploading = "uploading_" + filename;
	
	if ($(uploading).length <= 0) {
		$('#upload_image_result').append("<p id=\"" + uploading + "\"></p>");
	}
	$('#' + uploading).html('<img src="loading2.gif" style="margin-right:10px" />' + $.i18n("msg_uploading"));
		
	var params = {code: code, imagefield: "front" };
	if (window.localStorage.getItem("user_id")) {
		params.user_id = window.localStorage.getItem("user_id");
		params.password = window.localStorage.getItem("password");
	}

	uploads_in_progress++;

    ft.upload(path,
        "https://world-" + lc + ".openfoodfacts.org/cgi/product_image_upload.pl",
        function(result) {
        	uploads_in_progress--;
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
            $('#' + uploading).html("<p>" + $.i18n("msg_uploaded") + "</p>");
		},
        function(error) {
        	uploads_in_progress--;
            console.log('Error uploading file - path:' + path + ' - error code: ' + error.code);
			console.log("upload error source: " + error.source);
			console.log("upload error target: " + error.target);
            $('#' + uploading).html("<p>" + $.i18n("msg_upload_problem") + "<input id=\"" + uploading + "_retry\" type=\"button\" value=\"" + $.i18n("msg_upload_retry") + "\"\" ></p>");
            $('#' + uploading + "_retry").click(function() {
  				uploadFile(path);
			});
        },
        { fileKey: 'imgupload_front', fileName: name, params : params});   
}
    
    
function uploadFile(path) {

console.log("UploadFile, path: " + path);

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    console.log('file system open: ' + fs.name);
	// remove file://
	var new_path = path.replace(/file:\/\//, "");

	var name = path;
	name = name.replace(/.*\//, "");
	
	var filename = name.replace(/\./, "_");
	var uploading = "uploading_" + filename;
	
	if ($(uploading).length <= 0) {
		$('#upload_image_result').append("<p id=\"" + uploading + "\"></p>");
	}
	$('#' + uploading).html('<img src="loading2.gif" style="margin-right:10px" />' + $.i18n("msg_uploading"));	
	
	console.log("UploadFile, new path: " + new_path, " - filename: " + name);
	
	window.resolveLocalFileSystemURL(path, function (fileEntry) {
    // fs.root.getFile(new_path, { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function() {
                // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
				console.log("new blob");
                var blob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });
				
				var formData = new FormData();
				
				formData.append("imagefield", "front");
				formData.append("code", code);
				if (window.localStorage.getItem("user_id")) {
					formData.append("user_id", window.localStorage.getItem("user_id"));
					formData.append("password", window.localStorage.getItem("password"));
				}
				
				formData.append("imgupload_front", blob);

                //var oReq = new XMLHttpRequest();
                //oReq.open("POST", "https://world-" + lc + ".openfoodfacts.org/cgi/product_image_upload.pl", true);
                //oReq.onload = function (oEvent) {
                    // all done!
				//	console.log("all done");
                //};
                // Pass the blob in to XHR's send method
				//console.log("send blob");

                //oReq.send(formData);
				
				console.log("ajax call");
				
				 $.ajax({ // create an AJAX call...
						data: formData, // get the form data
						contentType: false,
						processData: false,
						type: "POST", // GET or POST
						url: "https://world-" + lc + ".openfoodfacts.org/cgi/product_image_upload.pl", // the file to call
						success: function(data, status, jq) { // on success..
							console.log("image_upload - ajax_call - success - status: " + status);

        	uploads_in_progress--;
            console.log('Upload success: ' + status);
            console.log(result.bytesSent + ' bytes sent');
            $('#' + uploading).html("<p>" + $.i18n("msg_uploaded") + "</p>");
			
						},
						error: function(jq,status,message) {
							console.log("image_upload - ajax_call" + 'A jQuery error has occurred. Status: ' + status + ' - Message: ' + message);
              console.log(jq.responseXML);
              console.log(jq.responseText);
              console.log(jq.status);
              console.log(jq.statusText);
        	uploads_in_progress--;
            console.log('Error uploading file - path:' + path + ' - error code: ' + status);
            $('#' + uploading).html("<p>" + $.i18n("msg_upload_problem") + "<input id=\"" + uploading + "_retry\" type=\"button\" value=\"" + $.i18n("msg_upload_retry") + "\"\" ></p>");
            $('#' + uploading + "_retry").click(function() {
  				uploadFile(path);
			});
        },								
							
						
					});				
				
				uploads_in_progress++;
            };
            // Read the file as an ArrayBuffer
			console.log("read file");
            reader.readAsArrayBuffer(file);
        }, function (err) { console.error('error getting fileentry file!' + err.toString()); });
    }, function (err) { console.error('error getting file! ' + err.toString()); console.error('error getting file! ' + err.message); console.error('error getting file! ' + err.code); });
	
}, function (err) { console.error('error getting persistent fs! ' + err.toString()); });

}
	


    
    
function loadmore_click (e) {
            	var href = $('#loadmorelink').attr("href");
            	$('#loadmore').html('<img src="loading2.gif" style="margin:10px" />');
			    $.getJSON(href, function(data) {
			    	$('#loadmore').remove();
			    	$('#search_results_list').append(data.jqm).listview('refresh');
			    	$('#loadmore').bind('click', loadmore_click);
			    	$('#loadmorelink').bind('click', loadmore_click);

			    });
			    e.preventDefault();
			    return false;
			}    
			
function show_login () {

	var user_id = window.localStorage.getItem("user_id");
	var password = window.localStorage.getItem("password");
	var name = window.localStorage.getItem("name");
	
	if ((user_id != null) && (password != null)) {
		$("#login_form").hide();
        $("#login_button").hide();
        $("#login_logout").show();
        if (name != null) {
        	$("#login_info").html($.i18n("msg_hello",name));
        }
        //$("#login_link").find('.ui-btn-text').text($.i18n("msg_logout"));	
		//$(document).on('pagebeforeshow', '#page_home', function(){       
			$('#login_link').text($.i18n("msg_logout"));
		//});
    }
	else {
		$("#login_form").show();
        $("#login_button").show();
        $("#login_logout").hide();
        //$("#login_link").find('.ui-btn-text').text($.i18n("msg_login"));	
		//$(document).on('pagebeforeshow', '#page_home', function(){       
			$('#login_link').text($.i18n("msg_login"));
		//});		
	}
}			

    function init() {
        console.log("GOT AN ONLOAD!!!")
        
        onBodyLoad();
        
        console.log("onBodyLoad() done");
        
        //document.addEventListener("touchmove", preventBehavior, false);
        
                
$('#search').submit(function() { // catch the form's submit event
	console.log("search submit clicked");
	$('#search_results').html('<div id="loading"><p>' + $.i18n("msg_search_in_progress") + '</p>'
				+ '<img src="loading2.gif" /></div>');
    $.mobile.changePage( "#page_search", { transition: "none" });
    console.log("search - ajax_call - method: " + $(this).attr('method') + " action: " +  $(this).attr('action') + ' data: ' + $(this).serialize());
    $.ajax({ // create an AJAX call...
        data: $(this).serialize(), // get the form data
        type: $(this).attr('method'), // GET or POST
        url: $(this).attr('action'), // the file to call
        success: function(data, status, jq) { // on success..
        	console.log("search - ajax_call - success - status: " + status);
            $('#search_results').html(data.jqm); // update the DIV
            $('#page_search').enhanceWithin();
            
            $('#loadmore').bind('click', loadmore_click);
			$('#loadmorelink').bind('click', loadmore_click);
   			
        },
        error: function(jq,status,message) {
        console.log("search - ajax_call" + 'A jQuery error has occurred. Status: ' + status + ' - Message: ' + message);
        $('#search_results').html("search - ajax_call" + 'A jQuery error has occurred. Status: ' + status + ' - Message: ' + message);
    	}
    });
    


    
    return false; // cancel original event to prevent form submitting
}); 


$('[name=user_id]').change(function() {
	$("#login_button").show();
});
$('[name=password]').change(function() {
	$("#login_button").show();
});




$("#logout").bind( "click", function(event, ui) {
     	window.localStorage.removeItem("password");
       	window.localStorage.removeItem("name");  
       	$("#login_info").html("");          	
       	show_login();
       	return false;
});
   
$('#login').submit(function() { // catch the form's submit event

	$("#login_info").html($.i18n("msg_connecting"));
	$("#login_button").hide();

    $.ajax({ // create an AJAX call...
        data: $(this).serialize(), // get the form data
        type: $(this).attr('method'), // GET or POST
        url: $(this).attr('action'), // the file to call
        success: function(data) { // on success..
            
            if (data.user_id) {
            	window.localStorage.setItem("user_id", $('[name=user_id]').val());
            	window.localStorage.setItem("password", $('[name=password]').val());
            	window.localStorage.setItem("name", data.name);
            }
            else {
            	window.localStorage.removeItem("password");
            	window.localStorage.removeItem("name");            	  	
            	$("#login_info").html($.i18n("msg_connecting_bad_password"));
            }
            show_login();
   
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.localStorage.removeItem("password");
            window.localStorage.removeItem("name");             
            $("#login_info").html($.i18n("msg_connecting_failed"));
            show_login();

        }
        
    });
    return false; // cancel original event to prevent form submitting
}); 
   
   
    }
    
    var preventBehavior = function(e) { 
      e.preventDefault(); 
    };

    
    
$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;
    // following option does not seem to work, adding a back button manually instead
    $.mobile.page.prototype.options.addBackBtn = true;
    $.mobile.phonegapNavigationEnabled = true ;
	$.mobile.defaultPageTransition = 'none';
	$("[data-role=header]").fixedtoolbar({ updatePagePadding: false });

});


// There is one product page for all products
// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {

	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {

		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// product.
		var u = $.mobile.path.parseUrl( data.toPage );
		var	re = /^#page_product/;

		if ( u.hash.search(re) !== -1 ) {

			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			showProduct( u, data.options );

			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
		}
		
		
		if (u.hash == '#page_menu') {
			var user_id = $('[name=user_id]').val();
			var password = $('[name=password]').val();
			var user_id_local = window.localStorage.getItem("user_id");
			var password_local = window.localStorage.getItem("password");
			if ((user_id == '') && (user_id_local != '')) {
				$('[name=user_id]').val(user_id_local);
			}
			if ((password == '') && (password_local != '')) {
				$('[name=password]').val(password_local);
			}
		}
	}
	$.mobile.resetActivePageHeight();
});


$(document).bind( "pageafterchange", function( e, data ) {
	$.mobile.resetActivePageHeight();
});

// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
function showProduct( urlObj, options )
{
	
          console.log('showProduct - pausing moodstock scanner');
          moodstocksCurrentCode = 0;
          //MoodstocksPlugin.pause();
        
	if (continuous_scan) {
		//MoodstocksPlugin.dismiss(scannerOff,null);
		continuous_scan = false;
	}

	code = urlObj.hash.replace( /.*code=/, "" ),

		// Get the object that represents the category we
		// are interested in. Note, that at this point we could
		// instead fire off an ajax request to fetch the data, but
		// for the purposes of this sample, it's already in memory.
		// category = categoryData[ categoryName ],

		// The pages we use to display our content are already in
		// the DOM. The id of the page we are going to write our
		// content into is specified in the hash before the '?'.
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );


		// Get the page we are going to dump our content into.
		var $page = $( pageSelector ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" ),

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" ),

			// The markup we are going to inject into the content
			// area of the page.
			markup = "<p>" +  $.i18n("msg_barcode", code) + "</p>"
				+ '<div id="loading"><p>' + $.i18n("msg_loading_product") + '</p>'
				+ '<img src="loading2.gif" /></div>';

		// Find the h1 element in our header and inject the name of
		// the category into it.
		$header.find( "h1" ).html(  $.i18n("msg_product_title", code) );
		
		$page.attr("data-backbtn",true);

		// Inject the category items markup into the content element.
		$content.html( markup );
		
		$page.trigger("create");
		
		$.mobile.resetActivePageHeight();
		
		// Pages are lazily enhanced. We call page() on the page
		// element to make sure it is always enhanced before we
		// attempt to enhance the listview markup we just injected.
		// Subsequent calls to page() are ignored since a page/widget
		// can only be enhanced once.
		$page.page();
		
		
		// Display confirmation dialog if there are uploads in progress and the used is clicking back
		// Update: not working, but not needed? the image upload seems to continue even if the page changes
		//$page.bind( "pagebeforechange", function( e, data ) {
		//	if(!confirm("Images en cours d'envoi, Ãªtes-vous sÃ»r de vouloir quitter la page ? Les images ne seront pas envoyÃ©es.")) {
		//		e.preventDefault();
		//		return false;				
		//    }
		//});		

		// We don't want the data-url of the page we just modified
		// to be the url that shows up in the browser's location field,
		// so set the dataUrl option to the URL for the category
		// we just loaded.
		// options.dataUrl = urlObj.href;

		// Now call changePage() and tell it to switch to
		// the page we just modified.
		//$.mobile.changePage( $page, options );
		$.mobile.changePage( $page, { transition: "none" } );
		
		// Load and display the product (from memory or from the server)
		// https://fr.openfoodfacts.org/api/v0/product/2165244002857.json
		
		console.log("getting " + 'https://world-' + lc + '.openfoodfacts.org/api/v0.1/product/' + code + '.jqm.json');
		
		$.get('https://world-' + lc + '.openfoodfacts.org/api/v0.1/product/' + code + '.jqm.json',
				 function(data) {
				
			// alert("data.status: " + data.status + " data.jqm: " + data.jqm);
			$content = $("#page_product").children( ":jqmData(role=content)" )
			if (data.status == 1) {
				$content.html (data.jqm);
				$header.find( "h1" ).html( data.title  );		
				$page.trigger("create");
				if (speech == 'on') {
					window.plugins.tts.speak($("#ingredients_list").text());
				}
			}
			else {
				//alert("nok data.status : " + data.status + " - verbose: " + data.status_verbose);
				$("#loading").html (data.jqm);
				$page.trigger("create");
				
			}
			$.mobile.resetActivePageHeight();
			
			
			$("#product_fields").submit(function() {

				console.log("product_fields submit");

				var params = {code: code };
				if (window.localStorage.getItem("user_id")) {
					params.user_id = window.localStorage.getItem("user_id");
					params.password = window.localStorage.getItem("password");
				}
				
			    var url = "https://world-" + lc + ".openfoodfacts.org/cgi/product_jqm.pl" ; // the script where you handle the form input.
			    
			    $("#save").button("disable").button("refresh");
			    $("#saving").show();
			    $("#saved").hide();
			    $("#not_saved").hide();
			
			    $.ajax({
			           type: "POST",
			           url: url,
			           data: $("#product_fields").serialize()  + '&' + $.param(params), // serializes the form's elements.
			           success: function(data)
			           {
			               $("#saved").show();
			           },
			           error: function(textStatus, errorThrown)
			           {
			    			$("#not_saved").show();
			           },
			           complete: function() {
			          		    $("#save").button("enable").button("refresh");
			          		    $("#saving").hide();
			           }
			         });
			
				console.log("product_fields return false");
			  	return false;
			});
			
		}, 'json');
	
}
//test

