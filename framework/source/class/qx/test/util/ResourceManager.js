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

/**
 * @asset(qx/test/colorstrip.gif)
 */
qx.Bootstrap.define("qx.test.util.ResourceManager",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    testHasResource : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertTrue(ResourceManager.has("qx/test/colorstrip.gif"));
    },

    testGetData : function() {
      var resourceData = [ 192, 10, "gif", "qx" ];
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertArrayEquals(resourceData, ResourceManager.getData("qx/test/colorstrip.gif"),
                             "Resource data not identical");
    },

    testGetImageWidth : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertEquals(192, ResourceManager.getImageWidth("qx/test/colorstrip.gif"));
    },

    testGetImageHeight : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertEquals(10, ResourceManager.getImageHeight("qx/test/colorstrip.gif"));
    },

    testGetImageFormat : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertEquals("gif", ResourceManager.getImageFormat("qx/test/colorstrip.gif"));
    },

    testIsClippedImage : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      this.assertFalse(ResourceManager.getCombinedFormat("qx/test/colorstrip.gif") != "");
    },

    testToUri : function()
    {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      var resourceUri = qx.$$libraries["qx"].resourceUri + "/" + "qx/test/colorstrip.gif";
      if (qx.core.Environment.get("engine.name") == "mshtml" &&
        qx.core.Environment.get("io.ssl"))
      {
        var href = window.location.href;
        resourceUri = href.substring(0, href.lastIndexOf("/") + 1) + resourceUri;
      }
      this.assertEquals(resourceUri, ResourceManager.toUri("qx/test/colorstrip.gif"));
    }
  }
});
