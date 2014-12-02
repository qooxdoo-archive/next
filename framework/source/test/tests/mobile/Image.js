/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * @asset(/../resource/qx/icon/Tango/48/places/folder.png)
 */

describe("mobile.Image", function() {

  it("Src", function(done) {
    var source = "../resource/qx/icon/Tango/48/places/folder.png";
    if (qx.io.ImageLoader.isLoaded(source)) {
      console.warn("mobile.Image.testLoadedEvent skipped! Image already loaded.");
      this.test.skip = true;
      return;
    }
    var image = new qx.ui.Image("../resource/qx/icon/Tango/48/places/folder.png");
    image.on("loaded", function() {
      setTimeout(function() {
        // use a timeout to dispose the image because it needs to
        // end its processing after the event has been fired.
        image.dispose();
        done();
      }, 100);

    }, this);
    sandbox.append(image);
  });


  it("LoadingFailed", function(done) {
    var image = new qx.ui.Image("does not exist.png" + Math.random());
    sandbox.append(image);

    image.on("loadingFailed", function() {
      setTimeout(function() {
        // use a timeout to dispose the image because it needs to
        // end its processing after the event has been fired.

        image.dispose();
        done();
      }, 0);
    }, this);
  });


  it("Factory", function() {
    var source = '../resource/qx/icon/Tango/48/places/folder.png';
    var img = q.create('<img data-qx-config-source="../resource/qx/icon/Tango/48/places/folder.png">')
      .toImage()
      .appendTo(sandbox);

    assert.instanceOf(img, qx.ui.Image);
    assert.equal("../resource/qx/icon/Tango/48/places/folder.png", img.source);
    assert.isTrue(img.getAttribute('src').indexOf(source) !== -1);
    img.remove().dispose();
  });

});
