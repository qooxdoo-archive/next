/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

/* ************************************************************************
 ************************************************************************ */
/**
 *
 * @asset(qx/test/colorstrip.gif)
 */

describe("io.ImageLoader", function() {

  beforeEach(function() {
    this.__imageUri = qx.util.ResourceManager.getInstance().toUri("qx/test/colorstrip.gif");
    this.__wrongImageUri = this.__imageUri.replace(/color/, "foocolor");
  });


  afterEach(function() {
    qx.io.ImageLoader.dispose();
  });


  it("LoadImageSuccess", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        assert.isTrue(qx.io.ImageLoader.isLoaded(this.__imageSource));
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("LoadImageFailure", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__wrongImageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        assert.isTrue(qx.io.ImageLoader.isFailed(this.__imageSource));
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("ImageWidth", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        assert.equal(192, qx.io.ImageLoader.getWidth(this.__imageSource));
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("ImageHeight", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        assert.equal(10, qx.io.ImageLoader.getHeight(this.__imageSource));
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("ImageSize", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        var size = qx.io.ImageLoader.getSize(this.__imageSource);
        assert.equal(192, size.width);
        assert.equal(10, size.height);
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("ImageFormat", function() {
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      this.__imageSource = source;
    }, this);

    window.setTimeout(function(e) {
      var self = this;
      this.resume(function() {
        assert.equal("gif", qx.io.ImageLoader.getFormat(this.__imageSource));
      }, self);
    }.bind(this), 500);

    this.wait();
  });


  it("Abort", function() {
    var aborted = false;
    this.__imageSource = null;
    qx.io.ImageLoader.load(this.__imageUri, function(source, entry) {
      aborted = true;
      assert.isTrue(entry.aborted);
      assert.equal(this.__imageUri, source);
    }, this);

    qx.io.ImageLoader.abort(this.__imageUri);

    assert.isTrue(aborted);
  });
});
