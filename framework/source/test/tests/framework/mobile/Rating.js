"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)
     * Daniel Wagner (danielwagner)

************************************************************************ */

describe("mobile.Rating", function() {

  var __rating = null;

  beforeEach(function() {
    setUpRoot();
    __rating = new qx.ui.mobile.Rating();
    getRoot().append(__rating);
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("PlainConstructor", function() {
    assert.equal(0, __rating.value);
    assert.equal(5, __rating.size);
    assert.equal("★", __rating.symbol);
  });


  it("FullConstructor", function() {
    __rating = new qx.ui.mobile.Rating(11, "X");
    getRoot().append(__rating);
    assert.equal(11, __rating.size);
    assert.equal("X", __rating.symbol);
  });


  it("SetGetValue", function() {
    __rating.value = 3;
    assert.equal(3, __rating.value);
  });


  it("ChangeEvent", function() {
    qx.core.Assert.assertEventFired(
      __rating,
      "changeValue",
      function() {
        __rating.value = 3;
      }.bind(this),
      function(ev) {
        assert.equal(3, ev.value);
        assert.equal(0, ev.old);
        assert.equal(__rating, ev.target);
      }.bind(this)
    );
  });


  it("SetSymbol", function() {
    assert.equal("★", __rating.getChildren().getHtml());
    __rating.symbol = "X";
    assert.equal("X", __rating.getChildren().getHtml());
  });


  it("SetSize", function() {
    assert.equal(5, __rating.getChildren().length);
    __rating.value = 2;
    __rating.size = 7;
    assert.equal(7, __rating.getChildren().length);
    assert.equal(2, __rating.value);
  });


  it("TwoCollections", function() {
    __rating.value = 2;
    var rating2 = qxWeb(getRoot().find(".qx-rating"));
    assert.equal(__rating, rating2);
    assert.equal(2, rating2.value);
  });


  it("ListenerRemove", function() {
    var calledChange = 0;
    var calledCustom = 0;

    __rating.on("changeValue", function() {
      calledChange++;
    });
    __rating.on("custom", function() {
      calledCustom++;
    });
    __rating.dispose();
    __rating.value = 3;
    __rating.emit("custom");

    assert.equal(0, calledChange);
    assert.equal(1, calledCustom);
  });


  it("DomConfig", function() {
    __rating = qxWeb.create("<div data-qx-widget='qx.ui.mobile.Rating' data-qx-config-symbol='+' data-qx-config-size='3' data-qx-config-value='2'>")
      .appendTo(getRoot());
    assert.equal("+", __rating.getChildren().getHtml());
    assert.equal(3, __rating.getChildren().length);
    assert.equal(2, __rating.value);
  });


  it("Factory", function(done) {
    var rating = __rating = qxWeb.create("<div>").rating().appendTo(getRoot());
    assert.instanceOf(rating, qx.ui.mobile.Rating);
    assert.equal(rating, rating[0].$$widget);
    setTimeout(function() {
      assert.equal("qx.ui.mobile.Rating", rating.getData("qxWidget"));
      done();
    }, 100);

  });
});
