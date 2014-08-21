/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Class.define("qx.test.performance.Event",
{
  extend : qx.dev.unit.TestCase,
  include : [qx.dev.unit.MMeasure, qx.event.MEmitter],

  events : {
    "plain" : "qx.event.type.Event",
    "data" : "qx.event.type.Data"
  },

  members :
  {
    FIRE_ITERATIONS : 10000,
    ADD_ITERATIONS : 5000,


    testFireEvent : function() {
      var that = this;
      this.measureRepeated(
        "fire plain events", function() {
          that.fireEvent("plain");
        },
        function() {}, this.FIRE_ITERATIONS
      );
    },


    testFireDataEvent : function() {
      var that = this;
      this.measureRepeated(
        "fire data events", function() {
          that.fireDataEvent("data", true, false);
        },
        function() {}, this.FIRE_ITERATIONS
      );
    },


    testFireDataEventCancelable : function() {
      var that = this;
      this.measureRepeated(
        "fire cancelable data events", function() {
          that.fireDataEvent("data", true, false, true);
        },
        function() {}, this.FIRE_ITERATIONS
      );
    },


    testOn : function() {
      var that = this;
      var handler = [];
      for (var i = 0; i < this.ADD_ITERATIONS; i++) {
        handler.push(function() {});
      }
      this.measureRepeated(
        "on", function(i) {
          that.on("plain", handler[i]);
        },
        function() {
          for (var i = 0; i < handler.length; i++) {
            that.off("plain", handler[i]);
          }
        }, this.ADD_ITERATIONS
      );
    },


    testRemoveListener : function()
    {
      var handler = [];
      for (var i = 0; i < this.ADD_ITERATIONS; i++) {
        handler.push(function() {});
        this.on("plain", handler[i]);
      }
      var that = this;
      this.measureRepeated(
        "remove listeners", function(i) {
          that.off("plain", handler[i]);
        },
        function() {}, this.ADD_ITERATIONS
      );
    },


    testRemoveListenerById : function() {
      var listeners = [];
      for (var i = 0; i < this.ADD_ITERATIONS; i++) {
        listeners.push(this.on("plain", function() {}));
      }
      var that = this;
      this.measureRepeated(
        "remove listeners by id", function(i) {
          that.offById(listeners[i]);
        },
        function() {}, this.ADD_ITERATIONS
      );
    },


    testExecutePlainListener : function() {
      var listeners = [];
      for (var i = 0; i < this.FIRE_ITERATIONS; i++) {
        listeners.push(this.on("plain", function() {}));
      }
      var that = this;
      this.measureRepeated(
        "execute plain listeners", function() {
          that.emit("plain");
        },
        function() {
          for (var i = 0; i < listeners.length; i++) {
            that.offById(listeners[i]);
          }
        }, 1, this.FIRE_ITERATIONS
      );
    },


    testExecuteDataListener : function() {
      var listeners = [];
      for (var i = 0; i < this.FIRE_ITERATIONS; i++) {
        listeners.push(this.on("data", function() {}));
      }
      var that = this;
      this.measureRepeated(
        "execute data listeners", function() {
          that.emit("data", true, false);
        },
        function() {
          for (var i = 0; i < listeners.length; i++) {
            that.offById(listeners[i]);
          }
        }, 1, this.FIRE_ITERATIONS
      );
    }
  }
});
