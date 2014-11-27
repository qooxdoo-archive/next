/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Fabian Jakobs (fjakobs)

************************************************************************ */
describe("bom.Location", function() {

  var __bodyStyles = null;
  var __marginTop = null;
  var __marginLeft = null;
  var __left = null;
  var __top = null;
  var __position = null;
  var __border = null;
  var __padding = null;


  beforeEach(function() {
    __bodyStyles = document.body.style;
    __marginTop = __bodyStyles.marginTop;
    __marginLeft = __bodyStyles.marginLeft;
    __left = __bodyStyles.left;
    __top = __bodyStyles.top;
    __position = __bodyStyles.position;
    __border = __bodyStyles.border;
    __padding = __bodyStyles.padding;

    // set up the defaults
    __bodyStyles.marginLeft = "0px";
    __bodyStyles.marginTop = "0px";
    __bodyStyles.left = "0px";
    __bodyStyles.top = "0px";
    __bodyStyles.position = "static";
    __bodyStyles.padding = "0px";

    sandbox.setStyles({
      position: "absolute",
      top: 0,
      left: 0
    });
  });


  afterEach(function() {
    __bodyStyles.marginTop = __marginTop;
    __bodyStyles.marginLeft = __marginLeft;
    __bodyStyles.top = __top;
    __bodyStyles.left = __left;
    __bodyStyles.position = __position;
    __bodyStyles.border = __border;
    __bodyStyles.padding = __padding;
  });


  it("BodyLocationDefault", function() {
    // check the defaults
    var pos = qx.bom.element.Location.get(document.body);
    assert.equal(0, pos.left);
    assert.equal(0, pos.top);
  });


  it("BodyLocationMargins", function() {
    // set the defaults
    __bodyStyles.marginLeft = "10px";
    __bodyStyles.marginTop = "20px";

    var pos = qx.bom.element.Location.get(document.body);
    assert.equal(10, pos.left);
    assert.equal(20, pos.top);
  });


  it("BodyLocationBorder", function() {
    __bodyStyles.border = "5px solid black";

    var pos = qx.bom.element.Location.get(document.body);
    assert.equal(0, pos.left);
    assert.equal(0, pos.top);
  });


  it("BodyLocationPadding", function() {
    __bodyStyles.padding = "5px";

    var pos = qx.bom.element.Location.get(document.body);
    assert.equal(0, pos.left);
    assert.equal(0, pos.top);
  });


  it("BodyLocationMode", function() {
    __bodyStyles.marginLeft = "10px";
    __bodyStyles.marginTop = "20px";
    __bodyStyles.border = "5px solid black";
    __bodyStyles.padding = "30px";

    var pos = qx.bom.element.Location.get(document.body, "margin");
    assert.equal(0, pos.left);
    assert.equal(0, pos.top);

    pos = qx.bom.element.Location.get(document.body, "box");
    assert.equal(10, pos.left);
    assert.equal(20, pos.top);

    pos = qx.bom.element.Location.get(document.body, "border");
    assert.equal(15, pos.left);
    assert.equal(25, pos.top);

    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
    pos = qx.bom.element.Location.get(document.body, "scroll");
    assert.equal(15, pos.left);
    assert.equal(25, pos.top);

    pos = qx.bom.element.Location.get(document.body, "padding");
    assert.equal(45, pos.left);
    assert.equal(55, pos.top);
  });


  it("DivStatic", function() {
    sandbox[0].innerHTML =
      '<div id="div1" style=" position: static; margin: 5px; border: 2px solid #000; padding: 3px; width: 200px; height: 200px;">' +
      '<div id="div2" style="position: static; margin: 5px; border: 2px solid #000; padding: 3px; width: 150px; height: 150px;">' +
      '<div id="div3" style="position: static; margin: 5px; border: 2px solid #000; padding: 3px; width: 100px; height: 100px;"></div>' +
      '</div>' +
      '</div>';

    var div1 = document.getElementById("div1");
    var pos = qx.bom.element.Location.get(div1);
    assert.equal(5, pos.left, "left1");
    assert.equal(5, pos.top, "top1");

    var div2 = document.getElementById("div2");
    pos = qx.bom.element.Location.get(div2);
    assert.equal(5 + 2 + 3 + 5, pos.left, "left2");
    assert.equal(5 + 2 + 3 + 5, pos.top, "top2");

    var div3 = document.getElementById("div3");
    pos = qx.bom.element.Location.get(div3);
    assert.equal(15 + 5 + 2 + 3, pos.left, "left3");
    assert.equal(15 + 5 + 2 + 3, pos.top, "top3");
  });


  it("DivRelative", function() {
    sandbox[0].innerHTML =
      '<div id="div1" style="position: relative; top: 5px; left: 5px; margin: 5px; border: 2px solid #000; padding: 3px; width: 200px; height: 200px;">' +
      '<div id="div2" style="position: relative; top: 5px; left: 5px; margin: 5px; border: 2px solid #000; padding: 3px; width: 150px; height: 150px;">' +
      '<div id="div3" style="position: relative; top: -5px; left: -5px; margin: 5px; border: 2px solid #000; padding: 3px; width: 100px; height: 100px;"></div>' +
      '</div>' +
      '</div>';

    var div1 = document.getElementById("div1");
    var pos = qx.bom.element.Location.get(div1);
    assert.equal(10, pos.left);
    assert.equal(10, pos.top);

    var div2 = document.getElementById("div2");
    pos = qx.bom.element.Location.get(div2);
    assert.equal(10 + 5 + 2 + 3 + 5, pos.left, "left2");
    assert.equal(10 + 5 + 2 + 3 + 5, pos.top, "top2");

    var div3 = document.getElementById("div3");
    pos = qx.bom.element.Location.get(div3);
    assert.equal(25 - 5 + 5 + 2 + 3, pos.left, "left3");
    assert.equal(25 - 5 + 5 + 2 + 3, pos.top, "top3");
  });


  it("DivAbsolute", function() {
    sandbox[0].innerHTML =
      '<div id="div1" style="position: absolute; top: 200px; left: 10px; margin: 5px; border: 2px solid #000; padding: 3px; width: 200px; height: 200px;">' +
      '<div id="div2" style="position: absolute; top: -100px; left: -10px; margin: 5px; border: 2px solid #000; padding: 3px; width: 150px; height: 150px;">' +
      '<div id="div3" style="position: absolute; top: 100px; left: 10px; margin: 5px; border: 2px solid #000; padding: 3px; width: 100px; height: 100px;"></div>' +
      '</div>' +
      '</div>';

    var div1 = document.getElementById("div1");
    var pos = qx.bom.element.Location.get(div1);
    assert.equal(10 + 5, pos.left);
    assert.equal(200 + 5, pos.top);

    var div2 = document.getElementById("div2");
    pos = qx.bom.element.Location.get(div2);
    assert.equal(15 - 10 + 2 + 5, pos.left);
    assert.equal(205 - 100 + 2 + 5, pos.top);

    var div3 = document.getElementById("div3");
    pos = qx.bom.element.Location.get(div3);
    assert.equal(12 + 10 + 5 + 2, pos.left);
    assert.equal(112 + 100 + 5 + 2, pos.top);
  });


  it("DivMixedPositions", function() {
    sandbox[0].innerHTML =
      '<div id="absolute1" style="position: absolute; top: 300px; left: 400px; margin: 5px; border: 2px solid #000; padding: 3px; width: 100px; height: 100px;">' +
      ' <div id="relative1" style="position: relative; top: 50px; left: 50px; margin: 5px; border: 2px solid #000; padding: 3px; width: 300px; height: 300px;">' +
      '   <div id="static1" style="overflow: hidden; position: static; margin: 5px; border: 2px solid #000; padding: 3px; width: 250px; height: 250px;">' +
      '     <div id="relative2" style="overflow: auto; position: relative; top: 10px; left: 10px; margin: 5px; border: 2px solid #000; padding: 3px; width: 200px; height: 200px;">' +
      '       <div id="absolute2" style="position: absolute; top: 30px; left: -90px; margin: 5px; border: 2px solid #000; padding: 3px; width: 200px; height: 200px;">' +
      '         <div id="static2" style="position: static; margin: 10px; border: 2px solid #000; padding: 3px; width: 250px; height: 250px;">' +
      '         </div>' +
      '       </div>' +
      '     </div>' +
      '   </div>' +
      '  </div>' +
      '</div>';

    var absolute1 = document.getElementById("absolute1");
    var pos = qx.bom.element.Location.get(absolute1);
    assert.equal(400 + 5, pos.left);
    assert.equal(300 + 5, pos.top);

    var relative1 = document.getElementById("relative1");
    pos = qx.bom.element.Location.get(relative1);
    assert.equal(405 + 2 + 3 + 50 + 5, pos.left);
    assert.equal(305 + 2 + 3 + 50 + 5, pos.top, "top2");

    var static1 = document.getElementById("static1");
    pos = qx.bom.element.Location.get(static1);
    assert.equal(465 + 2 + 3 + 5, pos.left);
    assert.equal(365 + 2 + 3 + 5, pos.top, "top3");

    var relative2 = document.getElementById("relative2");
    pos = qx.bom.element.Location.get(relative2);
    assert.equal(475 + 2 + 3 + 10 + 5, pos.left);
    assert.equal(375 + 2 + 3 + 10 + 5, pos.top, "top4");

    var absolute2 = document.getElementById("absolute2");
    pos = qx.bom.element.Location.get(absolute2);
    assert.equal(495 + 2 - 90 + 5, pos.left);
    assert.equal(395 + 2 + 30 + 5, pos.top, "top4");

    var static2 = document.getElementById("static2");
    pos = qx.bom.element.Location.get(static2);
    assert.equal(412 + 3 + 2 + 10, pos.left);
    assert.equal(432 + 3 + 2 + 10, pos.top, "top5");
  });


  it("DivWithSandboxMargin", function() {
    sandbox.setStyle("marginLeft", "10px");
    sandbox.setStyle("marginTop", "20px");

    sandbox[0].innerHTML = '<div id="div">affe</div>';

    var div = document.getElementById("div");
    var pos = qx.bom.element.Location.get(div);
    assert.equal(10, pos.left);
    assert.equal(20, pos.top);
  });


  it("DivWithSandboxPadding", function() {
    sandbox.setStyle("padding", "10px");
    sandbox[0].innerHTML = '<div id="div"></div>';

    var div = document.getElementById("div");
    var pos = qx.bom.element.Location.get(div);

    assert.equal(10, pos.left);
    assert.equal(10, pos.top);
  });


  it("DivWithSandboxBorder", function() {
    sandbox.setStyle("border", "10px solid black");
    sandbox[0].innerHTML = '<div id="div">juhu</div>';

    var div = document.getElementById("div");
    var pos = qx.bom.element.Location.get(div);

    assert.equal(10, pos.left);
    assert.equal(10, pos.top);
  });


  it("DivLocationMode", function() {
    sandbox[0].innerHTML = '<div id="div" style="margin: 5px; padding: 10px; border: 3px solid green;"></div>';

    var div = document.getElementById("div");
    var pos = qx.bom.element.Location.get(div, "margin");
    assert.equal(0, pos.left);
    assert.equal(0, pos.top);

    pos = qx.bom.element.Location.get(div, "box");
    assert.equal(5, pos.left);
    assert.equal(5, pos.top);

    pos = qx.bom.element.Location.get(div, "border");
    assert.equal(8, pos.left);
    assert.equal(8, pos.top);

    pos = qx.bom.element.Location.get(div, "scroll");
    assert.equal(8, pos.left);
    assert.equal(8, pos.top);

    pos = qx.bom.element.Location.get(div, "padding");
    assert.equal(18, pos.left);
    assert.equal(18, pos.top);
  });


  it("DivInline", function() {
    sandbox[0].innerHTML =
      '<div style="width:100px">' +
      '<span id="span1" style="margin-left: 10px"><img src="about:blank" width="10px" height="10px" style="border: 0px"></img></span>' +
      '<span id="span2" style="margin-left: 10px">a</span>' +
      '</div>';

    var span1 = document.getElementById("span1");
    var pos = qx.bom.element.Location.get(span1);
    assert.equal(10, pos.left);

    var span2 = document.getElementById("span2");
    pos = qx.bom.element.Location.get(span2);
    assert.equal(30, pos.left);
  });
});
