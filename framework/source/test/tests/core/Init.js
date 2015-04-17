/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */
describe("core.Init", function () {

  it("main", function (done) {
    var currentApplication = qx.core.Init.getApplication();
    qx.core.Init.ready();

    var App = qx.Class.define("qx.test.Application", {
      members: {
        close: function () {
        },
        terminate: function () {
        }
      }
    });
    var application = new App();
    qx.core.Init.setApplication(application);

    qxWeb(window).emit("beforeunload");
    qxWeb(window).emit("unload");

    setTimeout(function () {
      qx.core.Init.setApplication(currentApplication);
      done();
    }, 1000);
  });
});