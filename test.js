var jthumb = require('./app');

var url = "www.hm.com";

jthumb.get(url, function(err, data) {
  console.log(data.length);
})