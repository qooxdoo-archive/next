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

qx.Class.define("qx.test.mobile.Rating", {
  extend: qx.test.mobile.MobileTestCase,

  members: {

    __rating: null,

    setUp: function() {
      this.super(qx.test.mobile.MobileTestCase, "setUp");
      this.__rating = new qx.ui.mobile.Rating();
      this.getRoot().append(this.__rating);
    },

    testPlainConstructor : function() {
      this.assertEquals(0, this.__rating.value);
      this.assertEquals(5, this.__rating.size);
      this.assertEquals("★", this.__rating.symbol);
    },

    testFullConstructor : function() {
      this.__rating = new qx.ui.mobile.Rating(11, "X");
      this.getRoot().append(this.__rating);
      this.assertEquals(11, this.__rating.size);
      this.assertEquals("X", this.__rating.symbol);
    },

    testSetGetValue : function() {
      this.__rating.value = 3;
      this.assertEquals(3, this.__rating.value);
    },

    testChangeEvent : function() {
      this.assertEventFired(
        this.__rating,
        "changeValue",
        function() {
          this.__rating.value = 3;
        }.bind(this),
        function(ev) {
          this.assertEquals(3, ev.value);
          this.assertEquals(0, ev.old);
          this.assertEquals(this.__rating, ev.target);
        }.bind(this)
      );
    },

    testSetSymbol : function() {
      this.assertEquals("★", this.__rating.getChildren().getHtml());
      this.__rating.symbol = "X";
      this.assertEquals("X", this.__rating.getChildren().getHtml());
    },

    testSetSize : function() {
      this.assertEquals(5, this.__rating.getChildren().length);
      this.__rating.value = 2;
      this.__rating.size = 7;
      this.assertEquals(7, this.__rating.getChildren().length);
      this.assertEquals(2, this.__rating.value);
    },

    testTwoCollections : function() {
      this.__rating.value = 2;
      var rating2 = qxWeb(this.getRoot().find(".rating"));
      this.assertEquals(this.__rating, rating2);
      this.assertEquals(2, rating2.value);
    },

    testListenerRemove : function() {
      var calledChange = 0;
      var calledCustom = 0;

      this.__rating.on("changeValue", function() {
        calledChange++;
      });
      this.__rating.on("custom", function() {
        calledCustom++;
      });
      this.__rating.dispose();
      this.__rating.value = 3;
      this.__rating.emit("custom");

      this.assertEquals(0, calledChange);
      this.assertEquals(1, calledCustom);
    },

    testDomConfig : function() {
      this.__rating = qxWeb.create("<div data-qx-widget='qx.ui.mobile.Rating' data-qx-config-symbol='+' data-qx-config-size='3' data-qx-config-value='2'>")
      .appendTo(this.getRoot());
      this.assertEquals("+", this.__rating.getChildren().getHtml());
      this.assertEquals(3, this.__rating.getChildren().length);
      this.assertEquals(2, this.__rating.value);
    },

    testFactory: function() {
      var rating = this.__rating = qxWeb.create("<div>").rating().appendTo(this.getRoot());
      this.assertInstance(rating, qx.ui.mobile.Rating);
      this.assertEquals(rating, rating[0].$$widget);
      this.wait(100, function() {
        this.assertEquals("qx.ui.mobile.Rating", rating.getData("qxWidget"));
      }, this);
    }
  }
});
