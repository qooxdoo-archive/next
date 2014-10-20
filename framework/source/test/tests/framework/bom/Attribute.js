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
    this.sandbox = q.create("<div id='sandbox'></div>");
    this.sandbox.appendTo(document.body);

    var input = document.createElement("input");
    this.sandbox.append(input);

    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    this.sandbox.append(checkBox);

    var img = document.createElement("img");
    this.sandbox.append(img);
  });

  afterEach (function () {
    this.sandbox.remove();
  });


  it("setAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(this.sandbox[0], "maxLength", 10);
      assert.equal(10, this.sandbox[0].getAttribute("maxLength"));

      Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "checked", true);
      assert.isTrue(this.sandbox.find("input[type=checkbox]")[0]["checked"]);

      Attribute.set(this.sandbox[0], "className", "vanillebaer");
      assert.equal("vanillebaer", this.sandbox[0]["className"]);

      Attribute.set(this.sandbox[0], "selected", true);
      assert.equal("selected", this.sandbox[0].getAttribute("selected"));

      Attribute.set(this.sandbox.find("img")[0], "src", "../resource/qx/icon/Tango/48/places/folder.png");
      assert.equal("../resource/qx/icon/Tango/48/places/folder.png", this.sandbox.find("img")[0].getAttribute("src", 2));

  });

  it("SetAttributeWithUndefinedValue", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(this.sandbox[0], "src", undefined);
      assert.notEqual("undefined", this.sandbox[0].getAttribute("src"));
  });

  it("GetAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "maxLength"));
      assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "checked"));
      assert.isNull(Attribute.get(this.sandbox[0], "className"));
      assert.isNull(Attribute.get(this.sandbox[0], "data-x"));
      assert.isNull(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "tabIndex"));
      assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "readOnly"));
      assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "value"));

      this.sandbox.find("input[type=checkbox]")[0].setAttribute("checked", true);
      assert.equal(true, Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "checked"));

      this.sandbox.find("input[type=checkbox]")[0].removeAttribute("checked");
      assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "checked"));

      this.sandbox[0]["className"] = "vanillebaer";
      assert.equal("vanillebaer", Attribute.get(this.sandbox[0], "className"));

      this.sandbox.find("input[type=checkbox]")[0]["tabIndex"] = 1000;
      assert.equal(1000, Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "tabIndex"));

      this.sandbox.find("input[type=checkbox]")[0]["tabIndex"] = 0;
      assert.isNull(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "tabIndex"));

      this.sandbox.find("input[type=checkbox]")[0]["tabIndex"] = -1;
      assert.equal(-1, Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "tabIndex"));

      this.sandbox.find("input[type=checkbox]")[0]["readOnly"] = true;
      assert.isTrue(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "readonly"));

      this.sandbox.find("input[type=checkbox]")[0]["value"] = "vanillebaer";
      assert.equal("vanillebaer", Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "value"));

      Attribute.set(this.sandbox.find("img")[0], "src", "../resource/qx/icon/Tango/48/places/folder.png");
      assert.equal("../resource/qx/icon/Tango/48/places/folder.png", Attribute.get(this.sandbox.find("img")[0], "src"));
  });

  it("RemoveAttribute", function() {
      var Attribute = qx.bom.element.Attribute;

      Attribute.set(this.sandbox.find("input[type!=checkbox]")[0], "maxLength", 10);
      Attribute.set(this.sandbox.find("input[type!=checkbox]")[0], "maxLength", null);

      var maxLengthValue = qx.core.Environment.select("engine.name", {
                            "mshtml": 2147483647,
                            "webkit": 524288,
                            "default": -1
                           });

      assert.equal(maxLengthValue, this.sandbox.find("input[type!=checkbox]")[0]["maxLength"]);
      assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "maxLength"));

      Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "checked", true);
      Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "checked", null);
      assert.isFalse(this.sandbox.find("input[type=checkbox]")[0]["checked"]);

      Attribute.set(this.sandbox[0], "html", "vanillebaer");
      Attribute.set(this.sandbox[0], "html", null);
      assert.isNull(this.sandbox[0].getAttribute("html"));
  });

  it("ResetAttribute", function() {
    var Attribute = qx.bom.element.Attribute;

    Attribute.set(this.sandbox.find("input[type!=checkbox]")[0], "maxLength", 10);
    Attribute.reset(this.sandbox.find("input[type!=checkbox]")[0], "maxLength");
    assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "maxLength"));

    Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "disabled", true);
    Attribute.reset(this.sandbox.find("input[type=checkbox]")[0], "disabled");
    assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "disabled"));

    Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "multiple", true);
    Attribute.reset(this.sandbox.find("input[type=checkbox]")[0], "multiple");
    assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "multiple"));

    Attribute.set(this.sandbox[0], "data-x", "foo");
    Attribute.reset(this.sandbox[0], "data-x");
    assert.isNull(Attribute.get(this.sandbox[0], "data-x"));
    Attribute.set(this.sandbox[0], "tabIndex", 10);
    Attribute.reset(this.sandbox[0], "tabIndex");
    assert.isNull(Attribute.get(this.sandbox[0], "tabIndex"));

    Attribute.set(this.sandbox.find("input[type!=checkbox]")[0], "tabIndex", 20);
    Attribute.reset(this.sandbox.find("input[type!=checkbox]")[0], "tabIndex");
    assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "tabIndex"));

    Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "checked", true);
    Attribute.reset(this.sandbox.find("input[type=checkbox]")[0], "checked");
    assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "checked"));

    Attribute.set(this.sandbox.find("input[type=checkbox]")[0], "readOnly", true);
    Attribute.reset(this.sandbox.find("input[type=checkbox]")[0], "readonly");
    assert.isFalse(Attribute.get(this.sandbox.find("input[type=checkbox]")[0], "readonly"));

    Attribute.set(this.sandbox.find("input[type!=checkbox]")[0], "value", "foo");
    Attribute.reset(this.sandbox.find("input[type!=checkbox]")[0], "value");
    assert.isNull(Attribute.get(this.sandbox.find("input[type!=checkbox]")[0], "value"));
  });
});
