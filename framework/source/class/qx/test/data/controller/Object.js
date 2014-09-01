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

************************************************************************ */
/**
 * @ignore(qx.test.Dummy)
 */
qx.Bootstrap.define("qx.test.data.controller.Object",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    __a1: null,
    __a2: null,
    __model: null,
    __controller: null,

    setUp : function()
    {
      qx.Bootstrap.define("qx.test.Dummy", {
        include : [qx.event.MEmitter],
        properties :
        {
          a : {event: true, nullable: true},
          b : {event: true, nullable: true}
        }
      });

      this.__a1 = new qx.test.Dummy();
      this.__a2 = new qx.test.Dummy();

      this.__model = new qx.test.Dummy();

      this.__controller = new qx.data.controller.Object(this.__model);
    },


    tearDown : function() {
      this.__controller.dispose();
      delete qx.test.Dummy;
    },


    testOneToOne: function() {
      this.__controller.addTarget(this.__a1, "a", "a");
      this.__model.a = 10;
      this.assertEquals(10, this.__a1.a, "Binding does not work!");
    },


    testOneToTwo: function() {
      this.__controller.addTarget(this.__a1, "a", "a");
      this.__controller.addTarget(this.__a2, "a", "a");

      this.__model.a = 10;

      this.assertEquals(10, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(10, this.__a2.a, "Binding2 does not work!");
    },


    testChangeModel: function() {
      this.__controller.addTarget(this.__a1, "a", "a");
      this.__controller.addTarget(this.__a2, "a", "a");

      this.__model.a = 10;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      this.__controller.model = newModel;

      // test for the binding
      this.assertEquals(20, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(20, this.__a2.a, "Binding2 does not work!");
    },


    testRemoveOneBinding: function() {
      this.__model.a = 20;

      this.__controller.addTarget(this.__a1, "a", "a");
      this.__controller.addTarget(this.__a2, "a", "a");

      // test for the binding
      this.assertEquals(20, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(20, this.__a2.a, "Binding2 does not work!");

      // remove one target
      this.__controller.removeTarget(this.__a1, "a", "a");

      // set a new zIndex
      this.__model.a = 5;

      // test for the binding
      this.assertEquals(20, this.__a1.a, "Binding1 has not been removed!");
      this.assertEquals(5, this.__a2.a, "Binding2 has been removed!");
    },


    testRemoveUnexistantTarget: function() {
      // test some cases
      this.__controller.removeTarget(this.__a1, "a", "a");
      this.__controller.removeTarget(null, "AFFE", "AFFEN");

      // set a target for testing
      this.__controller.addTarget(this.__a1, "a", "a");

      // test the same cases again
      this.__controller.removeTarget(this.__a1, "a", "a");
      this.__controller.removeTarget(null, "AFFE", "AFFEN");
    },


    testTowToTwo: function() {
      // set up two links
      this.__controller.addTarget(this.__a1, "a", "a");
      this.__controller.addTarget(this.__a2, "a", "b");

      // set the values
      this.__model.a = 11;
      this.__model.b = "visible";

      // test for the binding
      this.assertEquals(11, this.__a1.a, "Binding1 does not work!");
      this.assertEquals("visible", this.__a2.a, "Binding2 does not work!");

      // set new values
      this.__model.a = 15;
      this.__model.b = "hidden";

      // test again for the binding
      this.assertEquals(15, this.__a1.a, "Binding1 does not work!");
      this.assertEquals("hidden", this.__a2.a, "Binding2 does not work!");
    },


    testOneToOneBi: function() {
      this.__controller.addTarget(this.__a1, "a", "a", true);

      this.__model.a = 10;

      // test for the binding
      this.assertEquals(10, this.__a1.a, "Binding does not work!");

      // set a new content
      this.__a1.a = 20;

      // test the reverse binding
      this.assertEquals(20, this.__model.a, "Reverse-Binding does not work!");
    },


    testOneToTwoBi: function() {
      this.__controller.addTarget(this.__a1, "a", "a", true);
      this.__controller.addTarget(this.__a2, "a", "a", true);

      // set a new zIndex to the model
      this.__model.a = 10;

      // test for the binding
      this.assertEquals(10, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(10, this.__a2.a, "Binding2 does not work!");

      // change one label
      this.__a1.a = 100;

      // test for the binding
      this.assertEquals(100, this.__model.a, "Reverse Binding does not work!");
      this.assertEquals(100, this.__a2.a, "Binding2 does not work!");

      // change the other label
      this.__a2.a = 200;

      // test for the binding
      this.assertEquals(200, this.__model.a, "Reverse Binding does not work!");
      this.assertEquals(200, this.__a1.a, "Binding1 does not work!");
    },


    testChangeModelBi: function() {
      this.__controller.addTarget(this.__a1, "a", "a", true);
      this.__controller.addTarget(this.__a2, "a", "a", true);

      // set an old zIndex
      this.__model.a = 10;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      this.__controller.model = newModel;

      // test for the binding
      this.assertEquals(20, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(20, this.__a2.a, "Binding2 does not work!");

      // set the zIndex in a label
      this.__a2.a = 11;

      // test for the bindings (working and should not work)
      this.assertEquals(11, this.__a1.a, "Binding1 does not work!");
      this.assertEquals(11, newModel.a, "Reverse-Binding does not work!");
      this.assertEquals(10, this.__model.a, "Binding has not been removed.");
    },


    testConverting: function() {
      // create the options map
      var opt = {
        converter: function(value) {
          if (value > 10) {
            return "A";
          }
          return "B";
        }
      };

      this.__controller.addTarget(this.__a1, "a", "a", false, opt);

      this.__model.a = 11;
      this.assertEquals("A", this.__a1.a, "Converter does not work!");

      this.__model.a = 5;
      this.assertEquals("B", this.__a1.a, "Converter does not work!");
    },



    testConvertingBi: function() {
      // create the options map for source to target
      var opt = {
        converter: function(value) {
          if (value > 10) {
            return "A";
          }
          return "B";
        }
      };

      // create the options map for target to source
      var revOpt = {
        converter: function(value) {
          if (value  == "A") {
            return 11;
          }
          return 10;
        }
      };

      this.__controller.addTarget(this.__a1, "a", "a", true, opt, revOpt);

      this.__model.a = 11;
      this.assertEquals("A", this.__a1.a, "Converter does not work!");

      this.__model.a = 5;
      this.assertEquals("B", this.__a1.a, "Converter does not work!");

      // change the target and check the model
      this.__a1.a = "A";
      this.assertEquals(11, this.__model.a, "Back-Converter does not work!");
      this.__a1.a = "B";
      this.assertEquals(10, this.__model.a, "Back-Converter does not work!");
    },


    testChangeModelCon: function() {
      // create the options map
      var opt = {
        converter: function(value) {
          if (value > 10) {
            return "A";
          }
          return "B";
        }
      };

      this.__controller.addTarget(this.__a1, "a", "a", false, opt);
      this.__controller.addTarget(this.__a2, "a", "a", false, opt);

      // set an old zIndex
      this.__model.a = 3;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      this.__controller.model = newModel;

      // test for the binding
      this.assertEquals("A", this.__a1.a, "Binding1 does not work!");
      this.assertEquals("A", this.__a2.a, "Binding2 does not work!");
    },


    testSetLateModel: function() {
      this.__controller.dispose();
      // create a blank controller
      this.__controller = new qx.data.controller.Object();

      // set the model
      this.__controller.model = this.__model;

      // Tie the label1s content to the zindex of the model
      this.__controller.addTarget(this.__a1, "a", "a");

      // set a new zIndex to the model
      this.__model.a = 10;

      // test for the binding
      this.assertEquals(10, this.__a1.a, "Binding does not work!");
    },


    testSetModelNull: function() {
      this.__controller.addTarget(this.__a1, "a", "a");

      this.__a1.a = "test";

      // set the model of the controller to null and back
      this.__controller.model = null;

      // check if the values have been reseted
      this.assertUndefined(this.__a1.a);

      this.__controller.model = this.__model;

      this.__model.a = 10;

      // test for the binding
      this.assertEquals(10, this.__a1.a, "Binding does not work!");
    },


    testCreateWithoutModel: function() {
      // create a new controller
      this.__controller.dispose();
      this.__controller = new qx.data.controller.Object();

      this.__controller.addTarget(this.__a1, "a", "a");
      this.__model.a = 10;

      this.__controller.model = this.__model;

      // test for the binding
      this.assertEquals("10", this.__a1.a, "Binding does not work!");
    },


    testDispose : function() {
      // Tie the label1s content to the zindex of the model
      this.__controller.addTarget(this.__a1, "a", "a", true);

      // create a common startbase
      this.__a1.a = 7;

      // dispose the controller to remove the bindings
      this.__controller.dispose();

      // set a new zIndex to the model
      this.__model.a = 10;

      // test if the binding has been removed and reseted
      this.assertEquals(null, this.__a1.a, "Binding does not work!");

      // set a new content
      this.__a1.a = 20;

      // test the reverse binding
      this.assertEquals(10, this.__model.a, "Reverse-Binding does not work!");
    }

  }
});