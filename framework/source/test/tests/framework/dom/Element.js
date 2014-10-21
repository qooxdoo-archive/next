/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("dom.Element", function() {

  beforeEach (function ()  {
    var div = document.createElement("div");
    div.id = "sandbox";
    document.body.appendChild(div);
  });

  afterEach (function ()  {
    document.getElementById("sandbox").remove();
  });


  it("Create", function() {
    var el = qx.dom.Element.create("div", {
      name : "juhu"
    }, window);
    qx.core.Assert.assertElement(el);
    assert.equal("juhu", qx.bom.element.Attribute.get(el, "name"));
  });


  it("Empty", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    qx.dom.Element.empty(sandbox);
    assert.equal("", sandbox.innerHTML);
  });
});