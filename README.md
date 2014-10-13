Jin-Thumb
=========

A module to create small thumbnails out of site urls.

## Installation

  npm install jin-thumb --save

## Usage

    var jthumb = require('jin-thumb');

    var url = "http://google.com";

    jthumb.get(url, function(err, data) {
      if (err) {
        console.log(err);
        return;
      }

      // e.g.
      var img = '<img src="' + data + '">';

      // assuming a node response object
      ...
      res.end(data, 'binary');
    });


## Release History

* 0.1.1 release
  Added 'get' method shortcut for getSiteThumbnail