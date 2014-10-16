/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

describe("bom.Class", function()
{

  beforeEach (function () 
  {
    _el = document.createElement("div");
    document.body.appendChild(_el);
  });


  afterEach (function ()  {
    document.body.removeChild(_el);
  });
 
 it("AddClass", function() {
      var result = qx.bom.element.Class.add(_el, "vanillebaer");
      assert.equal("vanillebaer", _el.className);
      assert.equal("vanillebaer", result);
  });
 
  it("AddClasses", function() {
      qx.bom.element.Class.addClasses(_el, [ "vanillebaer", "schokobaer" ]);

      assert.isTrue(qx.bom.element.Class.has(_el, "vanillebaer"));
      assert.isTrue(qx.bom.element.Class.has(_el, "schokobaer"));
  });
 
  it("HasClass", function() {
      _el.className = "vanillebaer";
      assert.isTrue(qx.bom.element.Class.has(_el, "vanillebaer"));
      assert.isFalse(qx.bom.element.Class.has(_el, "schokobaer"));
  });
 
  it("RemoveClass", function() {
      _el.className = "vanillebaer";
      var result = qx.bom.element.Class.remove(_el, "vanillebaer");

      assert.equal("", qx.bom.element.Class.get(_el));
      assert.equal("vanillebaer", result);
  });
 
  it("RemoveClasses", function() {
      _el.className = "vanillebaer schokobaer karamellbaer";

      qx.bom.element.Class.removeClasses(_el, [ "vanillebaer", "schokobaer" ]);

      assert.isFalse(qx.bom.element.Class.has(_el, "vanillebaer"));
      assert.isFalse(qx.bom.element.Class.has(_el, "schokobaer"));
      assert.isTrue(qx.bom.element.Class.has(_el, "karamellbaer"));
  });
 
  it("ToggleClass", function() {
      _el.className = "vanillebaer";

      qx.bom.element.Class.toggle(_el, "vanillebaer");
      assert.isFalse(qx.bom.element.Class.has(_el, "vanillebaer"));

      qx.bom.element.Class.toggle(_el, "vanillebaer");
      assert.isTrue(qx.bom.element.Class.has(_el, "vanillebaer"));
  });
 
  it("ReplaceClass", function() {
      _el.className = "vanillebaer";
      qx.bom.element.Class.replace(_el, "vanillebaer", "schokobaer");

      assert.isTrue(qx.bom.element.Class.has(_el, "schokobaer"));
      assert.isFalse(qx.bom.element.Class.has(_el, "vanillebaer"));
    
  });
});