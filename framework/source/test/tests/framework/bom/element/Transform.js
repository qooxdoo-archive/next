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
     * Martin Wittemann (wittemann)

************************************************************************ */
describe("bom.element.Transform", function ()
{
  var __el = null;
  var __keys = null;

  beforeEach(function() {
    __keys = qx.core.Environment.get("css.transform");
    __el = { style: {} };
  });

  afterEach(function() {
    __el = null;
    __keys = null;
  });


    /**
     * TRANSFORM FUNCTIONS
     */

  it("Translate", function() {
    qx.bom.element.Transform.translate(__el, "123px");

    assert.isTrue(__el.style[__keys.name].indexOf("translate(123px)") != -1);
  });

  it("Rotate", function() {
      qx.bom.element.Transform.rotate(__el, "123deg");

      assert.isTrue(__el.style[__keys.name].indexOf("rotate(123deg)") != -1);
  });

  it("Skew", function() {
      qx.bom.element.Transform.skew(__el, "123deg");

      assert.isTrue(__el.style[__keys.name].indexOf("skew(123deg)") != -1);
  });

  it("Scale", function() {
      qx.bom.element.Transform.scale(__el, 1.5);

      assert.isTrue(__el.style[__keys.name].indexOf("scale(1.5)") != -1);
  });

  it("Transform", function() {
      qx.bom.element.Transform.transform(__el, {scale: 1.2, translate: "123px"});

      assert.isTrue(__el.style[__keys.name].indexOf("translate(123px)") != -1);
      assert.isTrue(__el.style[__keys.name].indexOf("scale(1.2)") != -1);
  });

  it("AddStyleSheetRuleWith-X-Axis", function() {
      var css = qx.bom.element.Transform.getCss({scale: 1.2, translate: "123px"});
      var sheet = qx.bom.Stylesheet.createElement();
      qx.bom.Stylesheet.addRule(sheet, ".test", css);
      var computedRule = sheet.cssRules[0].cssText;

      assert.isTrue(computedRule.indexOf("translate(123px)") != -1, "Found: " + computedRule);
      assert.isTrue(computedRule.indexOf("scale(1.2)") != -1, "Found: " + computedRule);
  });

  it("AddStyleSheetRuleWith-XY-Axis", function() {
      var css = qx.bom.element.Transform.getCss({scale: "1.2, 1", translate: "123px,234px"});
      var sheet = qx.bom.Stylesheet.createElement();

      qx.bom.Stylesheet.addRule(sheet, "#abcdefghijklm", css);

      var computedRule = sheet.cssRules[0].cssText;

      assert.isTrue(computedRule.indexOf("translate(123px, 234px)") != -1, "Found: " + computedRule);
      assert.isTrue(computedRule.indexOf("scale(1.2, 1)") != -1, "Found: " + computedRule);

  });

    /**
     * ARRAY VALUES
     */

  it("3D", function() {
    qx.bom.element.Transform.translate(__el, ["1px", "2px", "3px"]);

    // 3d property
    if (qx.core.Environment.get("css.transform.3d")) {
      assert.isTrue(__el.style[__keys.name].indexOf("translate3d(1px, 2px, 3px)") != -1, "translate3d");
    }

    // 2d property
    else {
      assert.isTrue(__el.style[__keys.name].indexOf("translateX(1px) translateY(2px)") != -1);
    }
  });

  it("AddStyleSheetRuleWith-XYZ-Axis", function() {
    var css = qx.bom.element.Transform.getCss({scale: [1.2, 1, 0], translate: ["123px", "234px", "345em"]});
    var sheet = qx.bom.Stylesheet.createElement();
    qx.bom.Stylesheet.addRule(sheet, ".abcdefghijkl", css);

    var computedRule = sheet.cssRules[0].cssText;

    // 3d property
    if (qx.core.Environment.get("css.transform.3d")) {
      assert.isTrue(computedRule.indexOf("translate3d(123px, 234px, 345em)") != -1, "Found: " + computedRule);
      assert.isTrue(computedRule.indexOf("scale3d(1.2, 1, 0)") != -1, "Found: " + computedRule);
    }

    // 2d property
    else {
      assert.isTrue(computedRule.indexOf("translateX(123px)") != -1, "Found: " + computedRule);
      assert.isTrue(computedRule.indexOf("translateY(234px)") != -1, "Found: " + computedRule);
      assert.isFalse(computedRule.indexOf("translateY(345em)") != -1, "Found: " + computedRule);

      assert.isTrue(computedRule.indexOf("scaleX(1.2)") != -1, "Found: " + computedRule);
      assert.isTrue(computedRule.indexOf("scaleY(1)") != -1, "Found: " + computedRule);
      assert.isFalse(computedRule.indexOf("scaleZ(0)") != -1, "Found: " + computedRule);
    }
  });

    /**
     * CSS HELPER
     */

  it("GetCss", function() {
    var value = qx.bom.element.Transform.getCss({scale: 1.2});
    assert.equal(qx.bom.Style.getCssName(__keys.name) + ":scale(1.2);", value);
  });


    /**
     * ADDITIONAL CSS TRANSFORM PROPERTIES
     */

 it("Origin", function() {
    qx.bom.element.Transform.setOrigin(__el, "30% 20%");
    assert.equal("30% 20%", __el.style[__keys["origin"]]);
    assert.equal("30% 20%", qx.bom.element.Transform.getOrigin(__el));
  });

  it("Style", function() {
    qx.bom.element.Transform.setStyle(__el, "affe");
    assert.equal("affe", __el.style[__keys["style"]]);
    assert.equal("affe", qx.bom.element.Transform.getStyle(__el));
  });

  it("Perspective", function() {
    qx.bom.element.Transform.setPerspective(__el, 123);
    assert.equal("123px", __el.style[__keys["perspective"]]);
    assert.equal("123px", qx.bom.element.Transform.getPerspective(__el));
  });

  it("PerspectiveOrigin", function() {
    qx.bom.element.Transform.setPerspectiveOrigin(__el, "30% 10%");
    assert.equal("30% 10%", __el.style[__keys["perspective-origin"]]);
    assert.equal("30% 10%", qx.bom.element.Transform.getPerspectiveOrigin(__el));
  });

  it("BackfaceVisibility", function() {
    qx.bom.element.Transform.setBackfaceVisibility(__el, true);
    assert.equal("visible", __el.style[__keys["backface-visibility"]]);
    assert.isTrue(qx.bom.element.Transform.getBackfaceVisibility(__el));
  });

  it("GetTransformValue", function() {
    var cssValue;

    // one axis
    cssValue = qx.bom.element.Transform.getTransformValue({
      scale : [1]
    });

    assert.equal(cssValue, "scaleX(1)");


    // two axis
    cssValue = qx.bom.element.Transform.getTransformValue({
      scale : [1, 2]
    });

    assert.equal(cssValue, "scaleX(1) scaleY(2)");

    // three axis
    cssValue = qx.bom.element.Transform.getTransformValue({
      scale : [1, 2, 3]
    });

    // 3d property
    if (qx.core.Environment.get("css.transform.3d")) {
      assert.equal(cssValue, "scale3d(1, 2, 3)");
    }

    // 2d property
    else {
      assert.equal(cssValue, "scaleX(1) scaleY(2)");
    }
  });

  it("TransformArray", function() {
    qx.bom.element.Transform.transform(__el, {
      translate : ["1px", "2px", "3px"],
      scale : [1, 2, 3],
      rotate : ["1deg", "2deg", "3deg"],
      skew : ["1deg", "2deg"]
    });

    // 3d property
    if (qx.core.Environment.get("css.transform.3d")) {
      assert.isTrue(__el.style[__keys.name].indexOf("translate3d(1px, 2px, 3px)") != -1, "translate3d");
      assert.isTrue(__el.style[__keys.name].indexOf("scale3d(1, 2, 3)") != -1, "scale3d");

      assert.isTrue(__el.style[__keys.name].indexOf("rotateZ(3deg)") != -1, "rotate");
      assert.isTrue(__el.style[__keys.name].indexOf("skewX(1deg) skewY(2deg)") != -1, "skew");
    }

    // 2d property
    else {
      assert.isTrue(__el.style[__keys.name].indexOf("translateX(1px) translateY(2px)") != -1, "translate");
      assert.isTrue(__el.style[__keys.name].indexOf("scaleX(1) scaleY(2)") != -1, "scale");

      assert.isTrue(__el.style[__keys.name].indexOf("skewX(1deg) skewY(2deg)") != -1, "skew");
    }
  });
});
