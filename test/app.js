var assert = require('assert'),
    jinthumb = require('../app');

describe('Thumbnail Preview', function() {
  var url = "http://www.hm.com/";
  jinthumb.getSiteThumbnail(url, function(err, data) {
    it('should return an image bigger than 128b', function() {
      assert.equal( true, data.length > 128);
      console.log(data.length);
    })
  })
})