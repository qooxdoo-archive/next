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

/* ************************************************************************
************************************************************************ */
/**
 *
 * @asset(framework/source/resource/qx/icon/Tango/48/places/folder.png)
 */
 
describe('bom.Attribute', function() {

  beforeEach (function () {
    var div = document.createElement("div");
    div.id = "el";

    _el = div;
    document.body.appendChild(div);

    var input = document.createElement("input");
    _input = input;
    document.body.appendChild(input);

    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    _checkBox = checkBox;
    document.body.appendChild(checkBox);

    var img = document.createElement("img");
    _img = img;
    document.body.appendChild(img);
  });

  afterEach (function () {
    document.body.removeChild(_el);
    document.body.removeChild(_checkBox);
    document.body.removeChild(_img);
  });

  it("SetAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(_el, "maxLength", 10);
      assert.equal(10, _el.getAttribute("maxLength"));

      Attribute.set(_checkBox, "checked", true);
      assert.isTrue(_checkBox["checked"]);

      Attribute.set(_el, "className", "vanillebaer");
      assert.equal("vanillebaer",_el["className"]);

      Attribute.set(_el, "selected", true);
      assert.equal("selected", _el.getAttribute("selected"));

      var imgSrc = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/icon/Tango/48/places/folder.png");
      Attribute.set(_img, "src", imgSrc);
      assert.equal(imgSrc, _img.getAttribute("src", 2));

  });
 
  it("SetAttributeWithUndefinedValue", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(_el, "src", undefined);
      assert.notEqual("undefined", _el.getAttribute("src"));
  });
 
  it("GetAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      assert.isNull(Attribute.get(_input, "maxLength"));
      assert.isFalse(Attribute.get(_checkBox, "checked"));
      assert.isNull(Attribute.get(_el, "className"));
      assert.isNull(Attribute.get(_el, "innerHTML"));
      assert.isNull(Attribute.get(_checkBox, "tabIndex"));
      assert.isFalse(Attribute.get(_checkBox, "readOnly"));
      assert.isNull(Attribute.get(_input, "value"));

      _checkBox.setAttribute("checked", true);
      assert.equal(true, Attribute.get(_checkBox, "checked"));

      _checkBox.removeAttribute("checked");
      assert.isFalse(Attribute.get(_checkBox, "checked"));

      _el["className"] = "vanillebaer";
      assert.equal("vanillebaer", Attribute.get(_el, "className"));

      _el.innerHTML = "vanillebaer";
      assert.equal("vanillebaer", Attribute.get(_el, "innerHTML"));

      _checkBox["tabIndex"] = 1000;
      assert.equal(1000, Attribute.get(_checkBox, "tabIndex"));

      _checkBox["tabIndex"] = 0;
      assert.isNull(Attribute.get(_checkBox, "tabIndex"));

      _checkBox["tabIndex"] = -1;
      assert.equal(-1, Attribute.get(_checkBox, "tabIndex"));

      _checkBox["readOnly"] = true;
      assert.isTrue(Attribute.get(_checkBox, "readonly"));

      _checkBox["value"] = "vanillebaer";
      assert.equal("vanillebaer", Attribute.get(_checkBox, "value"));

      var imgSrc = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/icon/Tango/48/places/folder.png");
      Attribute.set(_img, "src", imgSrc);
      assert.equal(imgSrc, Attribute.get(_img, "src"));
  });
 
  it("RemoveAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(_input, "maxLength", 10);
      Attribute.set(_input, "maxLength", null);

      var maxLengthValue = qx.core.Environment.select("engine.name", {
                            "mshtml": 2147483647,
                            "webkit": 524288,
                            "default": -1
                           });

      assert.equal(maxLengthValue, _input["maxLength"]);
      assert.isNull(Attribute.get(_input, "maxLength"));

      Attribute.set(_checkBox, "checked", true);
      Attribute.set(_checkBox, "checked", null);
      assert.isFalse(_checkBox["checked"]);

      Attribute.set(_el, "html", "vanillebaer");
      Attribute.set(_el, "html", null);
      assert.isNull(_el.getAttribute("html"));
  });
 
  it("ResetAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(_input, "maxLength", 10);
      Attribute.reset(_input, "maxLength");
      assert.isNull(Attribute.get(_input, "maxLength"));

      Attribute.set(_checkBox, "disabled", true);
      Attribute.reset(_checkBox, "disabled");
      assert.isFalse(Attribute.get(_checkBox, "disabled"));

      Attribute.set(_checkBox, "multiple", true);
      Attribute.reset(_checkBox, "multiple");
      assert.isFalse(Attribute.get(_checkBox, "multiple"));

      Attribute.set(_el, "innerHTML", "<b>foo</b>");
      Attribute.reset(_el, "innerHTML");
      assert.isNull(Attribute.get(_el, "innerHTML"));
      Attribute.set(_el, "tabIndex", 10);
      Attribute.reset(_el, "tabIndex");
      assert.isNull(Attribute.get(_el, "tabIndex"));

      Attribute.set(_input, "tabIndex", 20);
      Attribute.reset(_input, "tabIndex");
      assert.isNull(Attribute.get(_input, "tabIndex"));

      Attribute.set(_checkBox, "checked", true);
      Attribute.reset(_checkBox, "checked");
      assert.isFalse(Attribute.get(_checkBox, "checked"));

      Attribute.set(_checkBox, "readOnly", true);
      Attribute.reset(_checkBox, "readonly");
      assert.isFalse(Attribute.get(_checkBox, "readonly"));

      Attribute.set(_input, "value", "foo");
      Attribute.reset(_input, "value");
      assert.isNull(Attribute.get(_input, "value"));

  });
});
