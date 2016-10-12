#!/usr/bin/env node

var fs = require('fs');

var rootdir = process.argv[2];

if(rootdir) {
    var filename = 'beep.ogg';
        if(fs.existsSync(filename)) {
	        fs.rename(filename, 'platforms/android/res/raw/' + filename, function(e) {
          console.warn(e);
            });
	        } else {
	     console.warn(filename + ' does not exist');
    }
   }
