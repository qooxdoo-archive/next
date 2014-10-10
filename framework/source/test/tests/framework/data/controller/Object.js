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

    var __a1 = null;
    var __a2 = null;
    var __model = null;
    var __controller = null;

describe("data.controller.Object", function(){

    beforeEach (function (){

       qx.Class.define("qx.test.Dummy", {
        include : [qx.event.MEmitter],
        properties :
        {
          a : {event: true, nullable: true},
          b : {event: true, nullable: true}
        }
      });

      __a1 = new qx.test.Dummy();
      __a2 = new qx.test.Dummy();

      __model = new qx.test.Dummy();

      __controller = new qx.data.controller.Object(__model);
    });

     
    afterEach(function (){
      __controller.dispose();
      delete qx.test.Dummy;
    });

  it("OneToOne", function() {
      __controller.addTarget(__a1, "a", "a");
      __model.a = 10;
      assert.equal(10, __a1.a, "Binding does not work!");
  });
 
  it("OneToTwo", function() {
      __controller.addTarget(__a1, "a", "a");
      __controller.addTarget(__a2, "a", "a");

      __model.a = 10;

      assert.equal(10, __a1.a, "Binding1 does not work!");
      assert.equal(10, __a2.a, "Binding2 does not work!");
  });
 
  it("ChangeModel", function() {
      __controller.addTarget(__a1, "a", "a");
      __controller.addTarget(__a2, "a", "a");

      __model.a = 10;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      __controller.model = newModel;

      // test for the binding
      assert.equal(20, __a1.a, "Binding1 does not work!");
      assert.equal(20, __a2.a, "Binding2 does not work!");
  });
 
  it("RemoveOneBinding", function() {
      __model.a = 20;

      __controller.addTarget(__a1, "a", "a");
      __controller.addTarget(__a2, "a", "a");

      // test for the binding
      assert.equal(20, __a1.a, "Binding1 does not work!");
      assert.equal(20, __a2.a, "Binding2 does not work!");

      // remove one target
      __controller.removeTarget(__a1, "a", "a");

      // set a new zIndex
      __model.a = 5;

      // test for the binding
      assert.equal(20, __a1.a, "Binding1 has not been removed!");
      assert.equal(5, __a2.a, "Binding2 has been removed!");
  });
 
  it("RemoveUnexistantTarget", function() {
      // test some cases
      __controller.removeTarget(__a1, "a", "a");
      __controller.removeTarget(null, "AFFE", "AFFEN");

      // set a target for testing
      __controller.addTarget(__a1, "a", "a");

      // test the same cases again
      __controller.removeTarget(__a1, "a", "a");
      __controller.removeTarget(null, "AFFE", "AFFEN");
  });
 
  it("TowToTwo", function() {
      // set up two links
      __controller.addTarget(__a1, "a", "a");
      __controller.addTarget(__a2, "a", "b");

      // set the values
      __model.a = 11;
      __model.b = "visible";

      // test for the binding
      assert.equal(11, __a1.a, "Binding1 does not work!");
      assert.equal("visible", __a2.a, "Binding2 does not work!");

      // set new values
      __model.a = 15;
      __model.b = "hidden";

      // test again for the binding
      assert.equal(15, __a1.a, "Binding1 does not work!");
      assert.equal("hidden", __a2.a, "Binding2 does not work!");
  });
 
  it("OneToOneBi", function() {
      __controller.addTarget(__a1, "a", "a", true);

      __model.a = 10;

      // test for the binding
      assert.equal(10, __a1.a, "Binding does not work!");

      // set a new content
      __a1.a = 20;

      // test the reverse binding
      assert.equal(20, __model.a, "Reverse-Binding does not work!");
  });
 
  it("OneToTwoBi", function() {
      __controller.addTarget(__a1, "a", "a", true);
      __controller.addTarget(__a2, "a", "a", true);

      // set a new zIndex to the model
      __model.a = 10;

      // test for the binding
      assert.equal(10, __a1.a, "Binding1 does not work!");
      assert.equal(10, __a2.a, "Binding2 does not work!");

      // change one label
      __a1.a = 100;

      // test for the binding
      assert.equal(100, __model.a, "Reverse Binding does not work!");
      assert.equal(100, __a2.a, "Binding2 does not work!");

      // change the other label
      __a2.a = 200;

      // test for the binding
      assert.equal(200, __model.a, "Reverse Binding does not work!");
      assert.equal(200, __a1.a, "Binding1 does not work!");
  });
 
  it("ChangeModelBi", function() {
      __controller.addTarget(__a1, "a", "a", true);
      __controller.addTarget(__a2, "a", "a", true);

      // set an old zIndex
      __model.a = 10;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      __controller.model = newModel;

      // test for the binding
      assert.equal(20, __a1.a, "Binding1 does not work!");
      assert.equal(20, __a2.a, "Binding2 does not work!");

      // set the zIndex in a label
      __a2.a = 11;

      // test for the bindings (working and should not work)
      assert.equal(11, __a1.a, "Binding1 does not work!");
      assert.equal(11, newModel.a, "Reverse-Binding does not work!");
      assert.equal(10, __model.a, "Binding has not been removed.");
  });
 
  it("Converting", function() {
      // create the options map
      var opt = {
        converter: function(value) {
          if (value > 10) {
            return "A";
          }
          return "B";
        }
      };

      __controller.addTarget(__a1, "a", "a", false, opt);

      __model.a = 11;
      assert.equal("A", __a1.a, "Converter does not work!");

      __model.a = 5;
      assert.equal("B", __a1.a, "Converter does not work!");
  });
 
  it("ConvertingBi", function() {
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

      __controller.addTarget(__a1, "a", "a", true, opt, revOpt);

      __model.a = 11;
      assert.equal("A", __a1.a, "Converter does not work!");

      __model.a = 5;
      assert.equal("B", __a1.a, "Converter does not work!");

      // change the target and check the model
      __a1.a = "A";
      assert.equal(11, __model.a, "Back-Converter does not work!");
      __a1.a = "B";
      assert.equal(10, __model.a, "Back-Converter does not work!");
  });
 
  it("ChangeModelCon", function() {
      // create the options map
      var opt = {
        converter: function(value) {
          if (value > 10) {
            return "A";
          }
          return "B";
        }
      };

      __controller.addTarget(__a1, "a", "a", false, opt);
      __controller.addTarget(__a2, "a", "a", false, opt);

      // set an old zIndex
      __model.a = 3;

      // create a new model with a different zIndex
      var newModel = new qx.test.Dummy();
      newModel.a = 20;

      // set the new Model
      __controller.model = newModel;

      // test for the binding
      assert.equal("A", __a1.a, "Binding1 does not work!");
      assert.equal("A", __a2.a, "Binding2 does not work!");
  });
 
  it("SetLateModel", function() {
      __controller.dispose();
      // create a blank controller
      __controller = new qx.data.controller.Object();

      // set the model
      __controller.model = __model;

      // Tie the label1s content to the zindex of the model
      __controller.addTarget(__a1, "a", "a");

      // set a new zIndex to the model
      __model.a = 10;

      // test for the binding
      assert.equal(10, __a1.a, "Binding does not work!");
  });
 
  it("SetModelNull", function() {
      __controller.addTarget(__a1, "a", "a");

      __a1.a = "test";

      // set the model of the controller to null and back
      __controller.model = null;

      // check if the values have been reseted
      assert.isUndefined(__a1.a);

      __controller.model = __model;

      __model.a = 10;

      // test for the binding
      assert.equal(10, __a1.a, "Binding does not work!");
  });
 
  it("CreateWithoutModel", function() {
      // create a new controller
      __controller.dispose();
      __controller = new qx.data.controller.Object();

      __controller.addTarget(__a1, "a", "a");
      __model.a = 10;

      __controller.model = __model;

      // test for the binding
      assert.equal("10", __a1.a, "Binding does not work!");
  });
 
  it("Dispose", function() {
      // Tie the label1s content to the zindex of the model
      __controller.addTarget(__a1, "a", "a", true);

      // create a common startbase
      __a1.a = 7;

      // dispose the controller to remove the bindings
      __controller.dispose();

      // set a new zIndex to the model
      __model.a = 10;

      // test if the binding has been removed and reseted
      assert.equal(null, __a1.a, "Binding does not work!");

      // set a new content
      __a1.a = 20;

      // test the reverse binding
      assert.equal(10, __model.a, "Reverse-Binding does not work!");
  });
});