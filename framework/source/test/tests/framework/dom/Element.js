/*******************************************************************************
 *
 * qooxdoo - the new era of web development
 *
 * http://qooxdoo.org
 *
 * Copyright: 2007-2012 1&1 Internet AG, Germany, http://www.1und1.de
 *
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 *
 * Authors: Fabian Jakobs (fjakobs)
 *
 ******************************************************************************/

describe("dom.Element", function() {

    beforeEach (function ()  {
      var div = document.createElement("div");
      div.id = "el";

      this._el = div;
      document.body.appendChild(div);
    });

    afterEach (function ()  {
      document.body.removeChild(this._el);
    });
 
  it("Create", function() {
      var el = qx.dom.Element.create("div", {
            name : "juhu"
          }, window);
      qx.core.Assert.assertElement(el);
      assert.equal("juhu", qx.bom.element.Attribute.get(el, "name"));
  });
 
  it("Empty", function() {
      this._el.innerHTML = "Juhu";
      qx.dom.Element.empty(this._el);
      assert.equal("", this._el.innerHTML);
  });
  
});