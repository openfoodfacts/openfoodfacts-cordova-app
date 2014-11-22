
var moodstocksCurrentCode = 0;
var continuous_scan = false;

var lc = 'en';
var speech = 'off';

var supported_languages = {
'ar':'العربية',
'de':'Deutsch',
'es':'Español',
'en':'English',
'it':'Italiano',
'fr':'Français',
'nl':'Nederlands',
'ru':'Русский',
'pl':'Polski',
'pt':'Português',
'vi':'Tiếng Việt',
'zh':'中文',
}

var code;

var scanning = false;


console.log("start");



var uploads_in_progress = 0;


            function onBodyLoad() {
            
            	document.addEventListener("deviceready", onDeviceReady, false);
            
            	console.log("onBodyLoad()");
            	
                scanButton = document.getElementById("scanButton");
                openStatusLabel = document.getElementById("openStatus");
                syncStatusLabel = document.getElementById("syncStatus");

                menuContainer = document.getElementById("menuContainer");
                overlayContainer = document.getElementById("overlayContainer");
            }

            // Sync scanner callbacks
            function syncInProgress(progress) {
                syncStatusLabel.innerHTML = "Synchronisation..." + progress + "%";
                syncStatusLabel.style.backgroundColor = "#349DF4";
                console.log("sync progress: " + progress);
            }

            function syncFinished() {
                syncStatusLabel.innerHTML = "";
                syncStatusLabel.style.backgroundColor = "#80AC3B";
				if (speech == 'on') {                
                	window.plugins.tts.speak($.i18n("msg_tts_database_sync_finished"));
                }
            }

            function syncFailure(message) {
                syncStatusLabel.innerHTML = JSON.stringify(message);
                syncStatusLabel.style.backgroundColor = "red";
            }

            // Open scanner callbacks
            function openSuccess(result) {
                openStatusLabel.innerHTML = "";
               	if (speech == 'on') {               
                	//window.plugins.tts.speak($.i18n("msg_tts_database_sync_in_progress"));
                }
               // MoodstocksPlugin.sync(null, syncInProgress, syncFinished, syncFailure);
            }

            function openFailure(result) {
                openStatusLabel.innerHTML = result;
                openStatusLabel.style.backgroundColor = "red";
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
                                
                
                if (((format == 'EAN13') || (format == 'EAN8')) && (code != '')) {
                
                	
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
            	
            	$.mobile.changePage( "#page_moodstocks_scan", { transition: "none" }); 
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
                //scanButton.addEventListener("click", clickScan, false);
				
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


    
console.log("bah 1");


function update_language() {

	$('#language').val(lc);

	$("form").each(function () {
		var action = $(this).attr("action");
		if (action) {
			$(this).attr("action", action.replace(/\/(..)\.openfoodfacts\.org/, '/' + lc + '.openfoodfacts.org'));
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
        
function uploadFile(path) {
     
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
        "http://" + lc + ".openfoodfacts.org/cgi/product_image_upload.pl",
        function(result) {
        	uploads_in_progress--;
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
            $('#' + uploading).html("<p>" + $.i18n("msg_uploaded") + "</p>");        
        },
        function(error) {
        	uploads_in_progress--;
            console.log('Error uploading file ' + path + ': ' + error.code);
            $('#' + uploading).html("<p>" + $.i18n("msg_upload_problem") + "<input id=\"" + uploading + "_retry\" type=\"button\" value=\"" + $.i18n("msg_upload_retry") + "\"\" ></p>");
            $('#' + uploading + "_retry").click(function() {
  				uploadFile(path);
			});
        },
        { fileKey: 'imgupload_front', fileName: name, params : params});   
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

	var code = urlObj.hash.replace( /.*code=/, "" ),

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
		// http://fr.openfoodfacts.org/api/v0/product/2165244002857.json
		
		console.log("getting " + 'http://fr.openfoodfacts.org/api/v0/product/' + code + '.jqm.json');
		
		$.get('http://' + lc + '.openfoodfacts.org/api/v0.1/product/' + code + '.jqm.json',
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
				
			    var url = "http://" + lc + ".openfoodfacts.org/cgi/product_jqm.pl" ; // the script where you handle the form input.
			    
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

