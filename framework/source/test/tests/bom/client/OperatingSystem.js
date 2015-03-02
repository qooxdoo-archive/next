/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */

describe("bom.client.OperatingSystem", function () {

  it("Usage of getName", function () {
    var osName = qx.bom.client.OperatingSystem.getName();
    assert.isString(osName);
    assert.notEqual("", osName);
  });
  it("Usage of getVersion", function () {
    if (qx.bom.client.OperatingSystem.getName() !== "linux") {
      var osVersion = qx.bom.client.OperatingSystem.getVersion();
      assert.isString(osVersion);
      assert.notEqual("", osVersion);
    }
  });
});
