Jin-Thumb
=========

A module to create small thumbnails out of site urls.

## Installation

  npm install jin-thumb --save

## Usage

    var jthumb = require('jin-thumb');

    var url = "http://google.com";

    jthumb.getSiteThumbnail(url, function(err, data) {
      if (err) {
        console.log(err);
        return;
      }

      var img = '<img src="' + data + '">';
    });


## Release History

* 0.1.0 Initial release