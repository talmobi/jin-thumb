var webshot = require('webshot');
var parseUri = require('parseuri');
var http = require('http');

var youtubeThumbnailRegex = /\"thumbnailUrl\"\s*href=["'](.*)["']/im;

var defaultOptions = {
  screenSize: {
    width: 192
  , height: 108
  }
, zoomFactor: .25
, quality: 75
, timeout: 20000
, settings: {
  javascriptEnabled: false
}
}

var settings = {
  saveToFile: false,
  name: null
}

function respond(url, options, callback) {
  if (settings.saveToFile) {
    webshot(url,  (settings.name || (new Date().getTime())) + '.jpg', options, function(err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    // callback with binary
    webshot(url, options, function(err, renderStream) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      var buf = "";

      renderStream.on('data', function(data) {
        //console.log("Writing data.");
        buf += (data.toString('binary'));
      });

      renderStream.on('end', function() {
        //console.log("Image Done!");
        if (callback) {
          callback(null, buf);
        }
      });
    });
  }
}

function getSiteThumbnail(url, callback) {
  if (typeof url !== 'string') {
    //console.log("Invalid URL");
    callback({text: "Invalid URL!"}, null);
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
          //console.log(arr.index);
          //console.log(arr[1]);
          var tbUrl = arr[1];

          // copy options
          var opts = JSON.parse(JSON.stringify(defaultOptions));
          opts.zoomFactor = 1;

          respond(tbUrl, opts, callback);
        } else {
          // we failed, return to default behaviour.
          //console.log("Defaulting to screenshot.");

          respond(url, defaultOptions, callback);
        }
      })

    }).end();
  } else {
    respond(url, defaultOptions, callback);
  }    
}

//var u = 'https://www.youtube.com/watch?v=aK1S59Jbpiw';
//var u = 'http://slashdot.org';
// u = 'https://www.youtube.com/';

//var s = parseUri( u );

//getSiteThumbnail(u);


module.exports = {
  getSiteThumbnail: function(url, callback) {
    return getSiteThumbnail(url, callback);
  },
  get: getSiteThumbnail
};