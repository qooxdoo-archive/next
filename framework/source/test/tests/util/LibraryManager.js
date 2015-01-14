// /* ************************************************************************

//    qooxdoo - the new era of web development

//    http://qooxdoo.org

//    Copyright:
//      2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

//    License:
//      LGPL: http://www.gnu.org/licenses/lgpl.html
//      EPL: http://www.eclipse.org/org/documents/epl-v10.php
//      See the LICENSE file in the project's top-level directory for details.

//    Authors:
//      * Daniel Wagner (danielwagner)

// ************************************************************************ */

// describe("util.LibraryManager", function() {

//   var __mgr = null;
//   var __qxBackup = null;
//   var libKeys = null;

//   before(function() {
//     __mgr = qx.util.LibraryManager.getInstance();
//     libKeys = ["sourceUri", "resourceUri"];
//     __qxBackup = {};
//     for (var key in qx.$$libraries.qx) {
//       if (qx.$$libraries.qx.hasOwnProperty(key)) {
//         __qxBackup[key] = qx.$$libraries.qx[key];
//       }
//     }
//   });

//   it("Has", function() {
//     assert(__mgr.has("qx"));
//     assert.isFalse(__mgr.has("foo"));
//   });


//   it("Get", function() {
//     for (var i = 0, l = libKeys.length; i < l; i++) {
//       var key = libKeys[i];
//       assert.equal(qx.$$libraries.qx[key], __mgr.get("qx", key));
//     }
//   });


//   it("Set", function() {
//     after(function() {
//       for (var key in __qxBackup) {
//         qx.$$libraries.qx[key] = __qxBackup[key];
//       }
//     });

//     for (var i = 0, l = libKeys.length; i < l; i++) {
//       var key = libKeys[i];
//       __mgr.set("qx", key, "foo");
//       assert.equal("foo", qx.$$libraries.qx[key]);
//     }
//   });

// });
