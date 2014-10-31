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
qx.Class.define("qx.test.data.controller.Form",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    __form : null,
    __tf1 : null,
    __tf2 : null,
    __cb : null,
    __model : null,

    setUp : function() {
      // create the objects
      this.__form = new qx.ui.form.Form();
      this.__tf1 = new qx.ui.form.TextField();
      this.__tf2 = new qx.ui.form.TextField("init");
      this.__cb = new qx.ui.form.CheckBox();
      this.__model = qx.data.marshal.Json.createModel({tf1: null, tf2: null, cb: null});

      // build the form
      this.__form.add(this.__tf1, "label1", null, "tf1");
      this.__form.add(this.__tf2, "label2", null, "tf2");
      this.__form.add(this.__cb, "label3", null, "cb");
    },

    tearDown : function() {
      this.__tf1.dispose();
      this.__tf2.dispose();
      this.__cb.dispose();
    },


    testSetModelNull : function() {
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // set some values
      this.__tf1.value = ("1111");
      this.__tf2.value = ("2222");
      this.__cb.value = (true);

      // set model to null
      c.model = (null);

      // all values should be null as well
      this.assertEquals("", this.__tf1.value);
      this.assertEquals("", this.__tf2.value);
      this.assertEquals("", this.__cb.value);

      c.dispose();
    },


    testInitialResetter : function() {
      // create the controller which set the inital values and
      // saves them for resetting
      var c = new qx.data.controller.Form(this.__model, this.__form);

      this.__tf2.value = ("affe");
      this.__form.reset();
      this.assertEquals("", this.__tf2.value);

      c.dispose();
    },


    testUnidirectionalDeep: function() {
      this.__form = new qx.ui.form.Form();

      this.__form.add(this.__tf1, "label1", null, "a.tf1");
      this.__form.add(this.__tf2, "label2", null, "a.tf2");
      // just create the controller
      var c = new qx.data.controller.Form(null, this.__form, true);
      var model = c.createModel();
      // check if the binding from the model to the view works
      model.a.tf1 = ("affe");
      this.assertEquals("affe", this.__tf1.value);

      // check if the other direction does not work
      this.__tf2.value = ("affee");
      this.assertEquals("init", model.a.tf2);

      // use the commit method
      c.updateModel();
      this.assertEquals("affee", model.a.tf2);

      c.dispose();
    },


    testUnidirectionalOptions: function(){
      // just create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form, true);

      c.addBindingOptions("tf1",
        {converter : function(data) { return data && data.substr(0, data.length - 1);}},
        {converter : function(data) { return data + "a";}}
      );

      // check if the other direction does not work
      this.__tf1.value = ("affe");
      this.assertEquals(null, this.__model.tf1);

      // use the commit method
      c.updateModel();
      this.assertEquals("affea", this.__model.tf1);

      c.dispose();
    },


    testUnidirectional: function(){
      // just create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form, true);

      // check if the binding from the model to the view works
      this.__model.tf1 = ("affe");
      this.assertEquals("affe", this.__tf1.value);

      // check if the other direction does not work
      this.__tf2.value = ("affee");
      this.assertEquals(null, this.__model.tf2);

      // use the commit method
      c.updateModel();
      this.assertEquals("affee", this.__model.tf2);

      c.dispose();
    },


    testCreateEmpty : function() {
      // just create the controller
      var c = new qx.data.controller.Form();
      // check the defaults for the properties
      this.assertNull(c.model);
      this.assertNull(c.target);

      c.dispose();
    },

    testCreateWithModel : function() {
      // just create the controller
      var c = new qx.data.controller.Form(this.__model);
      // check for the properties
      this.assertEquals(this.__model, c.model);
      this.assertNull(c.target);

      c.dispose();
    },

    testCreateWithForm : function() {
      // just create the controller
      var c = new qx.data.controller.Form(null, this.__form);
      // check for the properties
      this.assertEquals(this.__form, c.target);
      this.assertNull(c.model);

      c.dispose();
    },

    testCreateWithBoth : function() {
      // just create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);
      // check for the properties
      this.assertEquals(this.__form, c.target);
      this.assertEquals(this.__model, c.model);

      c.dispose();
    },

    testBindingCreate : function() {
      // create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");
      this.__cb.value = (true);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      // change the values
      this.__tf1.value = ("11");
      this.__tf2.value = ("21");
      this.__cb.value = (false);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      // change the data in the model
      this.__model.tf1 = ("a");
      this.__model.tf2 = ("b");
      this.__model.cb = (true);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      c.dispose();
    },


    testBindingChangeModel : function() {
      // create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");
      this.__cb.value = (true);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      var model2 = qx.data.marshal.Json.createModel({tf1: null, tf2: null, cb: null});

      c.model = (model2);

      // set values in the form
      this.__tf1.value = ("11");
      this.__tf2.value = ("22");
      this.__cb.value = (false);

      // check the new model
      this.assertEquals(this.__tf1.value, model2.tf1);
      this.assertEquals(this.__tf2.value, model2.tf2);
      this.assertEquals(this.__cb.value, model2.cb);

      // check the old model
      this.assertEquals("1", this.__model.tf1);
      this.assertEquals("2", this.__model.tf2);
      this.assertEquals(true, this.__model.cb);

      c.dispose();
    },


    testBindingChangeForm : function() {
      // create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");
      this.__cb.value = (true);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      // create a new form
      var form = new qx.ui.form.Form();
      var tf1 = new qx.ui.form.TextField();
      var tf2 = new qx.ui.form.TextField("init");
      var cb = new qx.ui.form.CheckBox();
      form.add(tf1, "tf1");
      form.add(tf2, "tf2");
      form.add(cb, "cb");

      c.target = (form);

      // set the values in the new form
      tf1.value = ("11");
      tf2.value = ("22");
      cb.value = (false);

      // check the binding
      this.assertEquals(tf1.value, this.__model.tf1);
      this.assertEquals(tf2.value, this.__model.tf2);
      this.assertEquals(cb.value, this.__model.cb);

      // check the old from
      this.assertEquals(this.__tf1.value, "1");
      this.assertEquals(this.__tf2.value, "2");
      this.assertEquals(this.__cb.value, true);

      tf1.dispose();
      tf2.dispose();
      cb.dispose();
      c.dispose();
    },


    testBindingDeep : function() {
      // a - b - cb
      // |   \
      // tf1  c
      //       \
      //        tf2
      var data = {a: {tf1: null}, b:{c: {tf2: null}}, cb: null};
      var model = qx.data.marshal.Json.createModel(data);

      // create the form
      var form = new qx.ui.form.Form();
      var tf1 = new qx.ui.form.TextField();
      var tf2 = new qx.ui.form.TextField();
      var cb = new qx.ui.form.CheckBox();

      // add the form incl. deep binding instructions
      form.add(tf1, "label1", null, "a.tf1");
      form.add(tf2, "label2", null, "b.c.tf2");
      form.add(cb, "label3", null, "cb");

      // create the controller
      var c = new qx.data.controller.Form(model, form);

      // set the values in the model
      model.a.tf1 = "1";
      model.b.c.tf2 = "2";
      model.cb = true;

      // check the binding
      this.assertEquals(tf1.value, model.a.tf1);
      this.assertEquals(tf2.value, model.b.c.tf2);
      this.assertEquals(cb.value, model.cb);

      // set the values in the form items
      tf1.value = 11;
      tf2.value = "22";
      cb.value = false;

      // check the binding
      this.assertEquals(tf1.value, model.a.tf1);
      this.assertEquals(tf2.value, model.b.c.tf2);
      this.assertEquals(cb.value, model.cb);

      tf1.dispose();
      tf2.dispose();
      cb.dispose();
      c.dispose();
    },


    testModelCreation : function() {
      // set some initial values in the form
      this.__tf1.value = ("A");
      this.__tf2.value = ("B");
      this.__cb.value = (true);

      // create the controller
      var c = new qx.data.controller.Form(null, this.__form);
      c.addBindingOptions("tf1",
        {converter : function(data) {
          return data && data.substr(0, 1);
        }},
        {converter : function(data) {
          return data + "-";
        }}
      );
      var model = c.createModel();

      // check if the model and the form still have the initial value
      this.assertEquals("A", this.__tf1.value);
      this.assertEquals("B", this.__tf2.value);
      this.assertTrue(this.__cb.value);
      this.assertEquals("A-", model.tf1);
      this.assertEquals("B", model.tf2);
      this.assertTrue(model.cb);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");
      this.__cb.value = (true);

      // check the binding
      this.assertEquals(this.__tf1.value + "-", model.tf1);
      this.assertEquals(this.__tf2.value, model.tf2);
      this.assertEquals(this.__cb.value, model.cb);

      // change the values
      this.__tf1.value = ("11");
      this.__tf2.value = ("21");
      this.__cb.value = (false);

      // check the binding
      this.assertEquals(this.__tf1.value + "-", model.tf1);
      this.assertEquals(this.__tf2.value, model.tf2);
      this.assertEquals(this.__cb.value, model.cb);

      // change the data in the model
      this.__model.tf1 = ("a");
      this.__model.tf2 = ("b");
      this.__model.cb = (true);

      // check the binding
      this.assertEquals(this.__tf1.value + "-", model.tf1);
      this.assertEquals(this.__tf2.value, model.tf2);
      this.assertEquals(this.__cb.value, model.cb);

      c.dispose();
    },


    testModelCreationDeep : function() {
      var form = new qx.ui.form.Form();
      var tf1 = new qx.ui.form.TextField("A");
      var tf2 = new qx.ui.form.TextField("B");

      form.add(tf1, null, null, "a.b1");
      form.add(tf2, null, null, "a.b2.c");

      var c = new qx.data.controller.Form(null, form);
      var model = c.createModel(true);

      // check if the creation worked
      this.assertEquals("A", model.a.b1);
      this.assertEquals("B", model.a.b2.c);

      tf1.dispose();
      tf2.dispose();
      c.dispose();
    },


    testModelCreationSpecialCaracter : function() {
      var form = new qx.ui.form.Form();
      var tf1 = new qx.ui.form.TextField("A");

      form.add(tf1, "a&b-c+d*e/f|g!h i.,:?;!~+-*/%{}()[]<>=^&|@/\\");

      var c = new qx.data.controller.Form(null, form);
      var model = c.createModel(true);

      // check if the creation worked
      this.assertEquals("A", model.abcdefghi);

      tf1.dispose();
      c.dispose();
    },


    testRemoveTarget : function() {
      this.__form.add(this.__tf1, "tf1");

      var model = qx.data.marshal.Json.createModel({tf1: null, tf2: null, cb: null, sb: null});

      // create the controller
      var c = new qx.data.controller.Form(model, this.__form);

      // check the textfield
      this.assertEquals(this.__tf1.value, model.tf1);
      // change the values
      this.__tf1.value = ("11");
      // check the binding
      this.assertEquals(this.__tf1.value, model.tf1);

      // change the data in the model
      model.tf1 = ("a");

      // check the binding
      this.assertEquals(this.__tf1.value, model.tf1);

      // remove the target
      c.target = (null);

      // change the values in the model
      model.tf1 = ("affe");

      // check the form items
      this.assertEquals("a", this.__tf1.value);

      // change the values in the items
      this.__tf1.value = ("viele affen");

      // check the model
      this.assertEquals("affe", model.tf1);

      c.dispose();
    },


    testOptions : function()
    {
      // create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // add the options
      var tf2model = {converter : function(data) {
        return "X" + data;
      }};
      var model2tf = {converter : function(data) {
        return data && data.substring(1);
      }};
      c.addBindingOptions("tf1", model2tf, tf2model);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");

      // check the binding
      this.assertEquals("X" + this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);

      // change the values
      this.__tf1.value = ("11");
      this.__tf2.value = ("21");

      // check the binding
      this.assertEquals("X" + this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);

      // change the data in the model
      this.__model.tf1 = ("Xa");
      this.__model.tf2 = ("b");

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1.substring(1));
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      c.dispose();
    },


    testDispose : function() {
      // just create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);
      c.dispose();

      // check if the bindings has been removed
      this.__model.tf1 = ("AFFE");
      this.assertNotEquals("AFFE", this.__tf1.value);
    },


    testBindingCreateMissingOne : function() {
      // add an unknown item
      var tf = new qx.ui.form.TextField();
      this.__form.add(tf, "Unknown");

      // create the controller
      var c = new qx.data.controller.Form(this.__model, this.__form);

      // set values in the form
      this.__tf1.value = ("1");
      this.__tf2.value = ("2");
      this.__cb.value = (true);

      // check the binding
      this.assertEquals(this.__tf1.value, this.__model.tf1);
      this.assertEquals(this.__tf2.value, this.__model.tf2);
      this.assertEquals(this.__cb.value, this.__model.cb);

      // dispose the objects
      tf.dispose();
      c.dispose();
    }
  }
});
