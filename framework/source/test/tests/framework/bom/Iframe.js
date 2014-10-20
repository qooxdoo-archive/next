/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

describe("bom.Iframe", function ()
{
  var __iframe = null;

  afterEach (function ()  {
    __iframe.remove();
  });

  it("Create", function() {
     __iframe = qx.bom.Iframe.create();
     __testAttributes(qx.bom.Iframe.DEFAULT_ATTRIBUTES);
  });


  it("CreateWithAttributes", function() {
      var attributes = qx.lang.Object.clone(qx.bom.Iframe.DEFAULT_ATTRIBUTES);
      attributes.allowTransparency = false;

     __iframe = qx.bom.Iframe.create(attributes);

     __testAttributes(attributes);
  });

  function __testAttributes (attributes)
  {
    // do not test 'onload' on IE, this returns always 'undefined'
    // http://tobielangel.com/2007/1/11/attribute-nightmare-in-ie/
    if(qx.core.Environment.get("engine.name") == "mshtml") {
      delete attributes["onload"];
    }

    for(var key in attributes) {
     assert.equal(attributes[key],
        qx.bom.element.Attribute.get(__iframe, key),
        "Wrong value on attribute '" + key + "'");
    }
  }

  it("GetWindow", function() {
     __iframe = qx.bom.Iframe.create();
      qx.dom.Element.insertBegin(__iframe, document.body);

      assert.isNotNull(qx.bom.Iframe.getWindow(__iframe));

  });
});
