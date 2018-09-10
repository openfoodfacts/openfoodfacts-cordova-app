#!/usr/bin/env node

var fs = require('fs.extra');

var rootdir = process.argv[2];

if(rootdir) {
    var filename = 'beep.caf';
        if(fs.existsSync(filename)) {
	        fs.copy(filename, 'platforms/ios/OpenBeautyFacts/Resources/CDVBarcodeScanner.bundle/' + filename, { replace: true }, function(e) {
          console.warn(e);
            });
	        } else {
	     console.warn(filename + ' does not exist');
    }
   }
