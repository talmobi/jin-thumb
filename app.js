var webshot = require('webshot');
var parseUri = require('parseuri');
var http = require('http');

var youtubeThumbnailRegex = /\"thumbnailUrl\"\s*href=["'](.*)["']/im;

var options = {
  screenSize: {
    width: 192
  , height: 108
  }
, paperSize: {
  width: '100px'
, height: '100px'
  }
, zoomFactor: .25
, quality: 75
, timeout: 20000
, settings: {
  javascriptEnabled: false
}
}

/*
webshot('google.com', 'google.jpg', options, function(err) {
  if (err) {
    console.log(err);
  }
});
webshot('mangahead.com', 'mangahead.jpg', options, function(err) {
  if (err) {
    console.log(err);
  }
});
webshot('iltasanomat.fi', 'iltasanomat.jpg', options, function(err) {
  if (err) {
    console.log(err);
  }
});
webshot('slashdot.org', 'slashdot.jpg', options, function(err) {
  if (err) {
    console.log(err);
  }
});
webshot('https://www.youtube.com/watch?v=kKTRXhfwU5k', 'youtube.jpg', options, function(err) {
  if (err) {
    console.log(err);
  }
});
*/

var opts = {
  saveToFile: false,
  name: null
}

function respond(url, callback) {
  if (opts.saveToFile) {
    webshot(url,  (opts.name || (new Date().getTime())) + '.jpg', options, function(err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    // callback with binary
    webshot(url, function(err, renderStream) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      var buf = "";

      renderStream.on('data', function(data) {
        console.log("Writing data.");
        buf += (data.toString('binary'));
      });

      renderStream.on('end', function() {
        console.log("Image Done!");
        if (callback) {
          callback(null, buf);
        }
        console.log("binary length: " + Buffer.byteLength(buf, 'binary'));
        console.log("ascii length: " + Buffer.byteLength(buf, 'ascii'));
        console.log("string length: " + buf.length);
        console.log("base64 length: " + Buffer.byteLength(buf, 'base64'));
      });
    });
  }
}

function getSiteThumbnail(url, callback) {
  if (typeof url !== 'string') {
    console.log("Invalid URL");
    return;
  }

  var pu = parseUri(url);

  // youtube specific
  if (~pu.host.indexOf('youtube.com')) {
    // host contains youtube.com
    var opts = {
      host: pu.host,
      path: pu.relative
    };

    http.request(opts, function(res) {

      var str = '';

      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function() {
        var arr = youtubeThumbnailRegex.exec(str);

        if (arr) {
          console.log(arr.index);
          console.log(arr[1]);
          var tbUrl = arr[1];

          var opts = JSON.parse(JSON.stringify(options));
          opts.zoomFactor = 1;

          respond(tbUrl, callback);
        } else {
          // we failed, return to default behaviour.
          console.log("Defaulting to screenshot.");

          respond(url, callback);
          /*webshot(url,  (new Date().getTime()) + '.jpg', options, function(err) {
            if (err) {
              console.log(err);
            }
          });*/
        }
      })

    }).end();
  } else {
    respond(url, callback);
  }    
}

//var u = 'https://www.youtube.com/watch?v=aK1S59Jbpiw';
var u = 'http://slashdot.org';
// u = 'https://www.youtube.com/';

var s = parseUri( u );

getSiteThumbnail(u);