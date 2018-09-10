#!/usr/bin/env node

var fs = require('fs.extra');

var rootdir = process.argv[2];

if(rootdir) {
    var filename = 'beep.ogg';
        if(fs.existsSync(filename)) {
	        fs.copy(filename, 'platforms/android/res/raw/' + filename, { replace: true }, function(e) {
          console.warn(e);
            });
	        } else {
	     console.warn(filename + ' does not exist');
    }
   }
