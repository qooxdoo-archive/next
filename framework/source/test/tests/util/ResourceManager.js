// /* ************************************************************************

//    qooxdoo - the new era of web development

//    http://qooxdoo.org

//    Copyright:
//      2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

//    License:
//      LGPL: http://www.gnu.org/licenses/lgpl.html
//      EPL: http://www.eclipse.org/org/documents/epl-v10.php
//      See the LICENSE file in the project's top-level directory for details.

//    Authors:
//      * Alexander Steitz (aback)

// ************************************************************************ */

// /**
//  * @asset(../resource/qx/test/colorstrip.gif)
//  */
// describe("util.ResourceManager", function()
// {

//  it("HasResource", function() {
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       assert.isTrue(ResourceManager.has("../resource/qx/test/colorstrip.gif"));
//     });


//  it("GetData", function() {
//       var resourceData = [ 192, 10, "gif", "qx" ];
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       assert.deepEqual(resourceData, ResourceManager.getData("../resource/qx/test/colorstrip.gif"),
//                              "Resource data not identical");
//     });


//  it("GetImageWidth", function() {
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       assert.equal(192, ResourceManager.getImageWidth("../resource/qx/test/colorstrip.gif"));
//     });


//  it("GetImageHeight", function() {
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       assert.equal(10, ResourceManager.getImageHeight("../resource/qx/test/colorstrip.gif"));
//     });


//  it("GetImageFormat", function() {
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       assert.equal("gif", ResourceManager.getImageFormat("../resource/qx/test/colorstrip.gif"));
//     });


//  it("ToUri", function() {
//       var ResourceManager = qx.util.ResourceManager.getInstance();
//       var resourceUri = qx.$$libraries["qx"].resourceUri + "/" + "../resource/qx/test/colorstrip.gif";
//       if (qx.core.Environment.get("engine.name") == "mshtml" &&
//         qx.core.Environment.get("io.ssl"))
//       {
//         var href = window.location.href;
//         resourceUri = href.substring(0, href.lastIndexOf("/") + 1) + resourceUri;
//       }
//       assert.equal(resourceUri, ResourceManager.toUri("../resource/qx/test/colorstrip.gif"));
//   });
// });
