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
 * @asset(qx/icon/Tango/48/places/folder.png)
 */

qx.Class.define("qx.test.mobile.basic.Image",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testSrc : function()
    {
      var source = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/48/places/folder.png");
      if (qx.io.ImageLoader.isLoaded(source)) {
        qx.log.Logger.debug("testLoadedEvent skipped! Image already loaded.");
        return;
      }
      var image = new qx.ui.basic.Image("qx/icon/Tango/48/places/folder.png");
      image.on("loaded", function() {
        this.resume(function() {
          // use a timeout to dispose the image because it needs to
          // end its processing after the event has been fired.
          window.setTimeout(function() {
            image.dispose();
          });
        });
      }, this);


      this.getRoot().append(image);
      this.wait();
    },


    testLoadingFailed : function()
    {
      var image = new qx.ui.basic.Image("does not exist.png" + Math.random());
      this.getRoot().append(image);

      image.on("loadingFailed", function() {
        this.resume(function() {
          // use a timeout to dispose the image because it needs to
          // end its processing after the event has been fired.
          window.setTimeout(function() {
            image.dispose();
          });
        });
      }, this);

      this.wait();
    },


    testFactory: function() {
      var source = 'qx/icon/Tango/48/places/folder.png';
      var img = q.create('<img data-qx-config-source="qx/icon/Tango/48/places/folder.png">')
        .image()
        .appendTo(this.getRoot());

      this.assertInstance(img, qx.ui.basic.Image);
      this.assertEquals('qx/icon/Tango/48/places/folder.png', img.source);
      this.assertTrue(img.getAttribute('src').indexOf(source) !== -1);
      img.remove().dispose();
    }
  }

});
