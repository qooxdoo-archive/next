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
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("bom.Selector", function() {

  it("ElementClass", function() {
    var Element = qx.dom.Element;
    var Attribute = qx.bom.element.Attribute;

    for (var i = 0; i < 250; i++) {
      var el = qxWeb.create('<ul><li>one</li><li>two</li><li>three</li></ul>')
        .setAttribute("id", "setid" + i)
        .addClass("fromcode")
        .appendTo(sandbox);
    }
    assert.equal(250, qx.bom.Selector.query("#sandbox ul.fromcode", sandbox[0]).length);
    assert.equal(750, qx.bom.Selector.query("#sandbox ul > li").length);
  });
});
