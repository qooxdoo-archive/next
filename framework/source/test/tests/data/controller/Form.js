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
describe('data.controller.Form', function() {

  var __form = null;
  var __tf1 = null;
  var __tf2 = null;
  var __cb = null;
  var __model = null;

  beforeEach(function() {
    __form = new qx.ui.form.Form();
    __tf1 = new qx.ui.form.TextField();
    __tf2 = new qx.ui.form.TextField("init");
    __cb = new qx.ui.form.CheckBox();
    __model = qx.data.marshal.Json.createModel({
      tf1: null,
      tf2: null,
      cb: null
    });

    // build the form
    __form.add(__tf1, "label1", null, "tf1");
    __form.add(__tf2, "label2", null, "tf2");
    __form.add(__cb, "label3", null, "cb");

  });


  afterEach(function() {
    __tf1.dispose();
    __tf2.dispose();
    __cb.dispose();
  });


  it("SetModelNull", function() {
    var c = new qx.data.controller.Form(__model, __form);

    // set some values
    __tf1.value = ("1111");
    __tf2.value = ("2222");
    __cb.value = (true);

    // set model to null
    c.model = (null);

    // all values should be null as well
    assert.equal("", __tf1.value);
    assert.equal("", __tf2.value);
    assert.equal("", __cb.value);

    c.dispose();
  });


  it("InitialResetter", function() {
    // create the controller which set the inital values and
    // saves them for resetting
    var c = new qx.data.controller.Form(__model, __form);

    __tf2.value = ("affe");
    __form.reset();
    assert.equal("", __tf2.value);

    c.dispose();
  });


  it("UnidirectionalDeep", function() {
    __form = new qx.ui.form.Form();

    __form.add(__tf1, "label1", null, "a.tf1");
    __form.add(__tf2, "label2", null, "a.tf2");
    // just create the controller
    var c = new qx.data.controller.Form(null, __form, true);
    var model = c.createModel();
    // check if the binding from the model to the view works
    model.a.tf1 = ("affe");
    assert.equal("affe", __tf1.value);

    // check if the other direction does not work
    __tf2.value = ("affee");
    assert.equal("init", model.a.tf2);

    // use the commit method
    c.updateModel();
    assert.equal("affee", model.a.tf2);

    c.dispose();
  });


  it("UnidirectionalOptions", function() {
    // just create the controller
    var c = new qx.data.controller.Form(__model, __form, true);

    c.addBindingOptions("tf1", {
      converter: function(data) {
        return data && data.substr(0, data.length - 1);
      }
    }, {
      converter: function(data) {
        return data + "a";
      }
    });

    // check if the other direction does not work
    __tf1.value = ("affe");
    assert.equal(null, __model.tf1);

    // use the commit method
    c.updateModel();
    assert.equal("affea", __model.tf1);

    c.dispose();
  });


  it("Unidirectional", function() {
    // just create the controller
    var c = new qx.data.controller.Form(__model, __form, true);

    // check if the binding from the model to the view works
    __model.tf1 = ("affe");
    assert.equal("affe", __tf1.value);

    // check if the other direction does not work
    __tf2.value = ("affee");
    assert.equal(null, __model.tf2);

    // use the commit method
    c.updateModel();
    assert.equal("affee", __model.tf2);

    c.dispose();
  });


  it("CreateEmpty", function() {
    // just create the controller
    var c = new qx.data.controller.Form();
    // check the defaults for the properties
    assert.isNull(c.model);
    assert.isNull(c.target);

    c.dispose();
  });


  it("CreateWithModel", function() {
    // just create the controller
    var c = new qx.data.controller.Form(__model);
    // check for the properties
    assert.equal(__model, c.model);
    assert.isNull(c.target);

    c.dispose();
  });


  it("CreateWithForm", function() {
    // just create the controller
    var c = new qx.data.controller.Form(null, __form);
    // check for the properties
    assert.equal(__form, c.target);
    assert.isNull(c.model);

    c.dispose();
  });


  it("CreateWithBoth", function() {
    // just create the controller
    var c = new qx.data.controller.Form(__model, __form);
    // check for the properties
    assert.equal(__form, c.target);
    assert.equal(__model, c.model);

    c.dispose();
  });


  it("BindingCreate", function() {
    // create the controller
    var c = new qx.data.controller.Form(__model, __form);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");
    __cb.value = (true);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

    // change the values
    __tf1.value = ("11");
    __tf2.value = ("21");
    __cb.value = (false);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

    // change the data in the model
    __model.tf1 = ("a");
    __model.tf2 = ("b");
    __model.cb = (true);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

    c.dispose();
  });


  it("BindingChangeModel", function() {
    // create the controller
    var c = new qx.data.controller.Form(__model, __form);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");
    __cb.value = (true);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

    var model2 = qx.data.marshal.Json.createModel({
      tf1: null,
      tf2: null,
      cb: null
    });

    c.model = (model2);

    // set values in the form
    __tf1.value = ("11");
    __tf2.value = ("22");
    __cb.value = (false);

    // check the new model
    assert.equal(__tf1.value, model2.tf1);
    assert.equal(__tf2.value, model2.tf2);
    assert.equal(__cb.value, model2.cb);

    // check the old model
    assert.equal("1", __model.tf1);
    assert.equal("2", __model.tf2);
    assert.equal(true, __model.cb);

    c.dispose();
  });


  it("BindingChangeForm", function() {
    // create the controller
    var c = new qx.data.controller.Form(__model, __form);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");
    __cb.value = (true);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

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
    assert.equal(tf1.value, __model.tf1);
    assert.equal(tf2.value, __model.tf2);
    assert.equal(cb.value, __model.cb);

    // check the old from
    assert.equal(__tf1.value, "1");
    assert.equal(__tf2.value, "2");
    assert.equal(__cb.value, true);

    tf1.dispose();
    tf2.dispose();
    cb.dispose();
    c.dispose();
  });


  it("BindingDeep", function() {
    // a - b - cb
    // |   \
    // tf1  c
    //       \
    //        tf2
    var data = {
      a: {
        tf1: null
      },
      b: {
        c: {
          tf2: null
        }
      },
      cb: null
    };
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
    assert.equal(tf1.value, model.a.tf1);
    assert.equal(tf2.value, model.b.c.tf2);
    assert.equal(cb.value, model.cb);

    // set the values in the form items
    tf1.value = 11;
    tf2.value = "22";
    cb.value = false;

    // check the binding
    assert.equal(tf1.value, model.a.tf1);
    assert.equal(tf2.value, model.b.c.tf2);
    assert.equal(cb.value, model.cb);

    tf1.dispose();
    tf2.dispose();
    cb.dispose();
    c.dispose();
  });


  it("ModelCreation", function() {
    // set some initial values in the form
    __tf1.value = ("A");
    __tf2.value = ("B");
    __cb.value = (true);

    // create the controller
    var c = new qx.data.controller.Form(null, __form);
    c.addBindingOptions("tf1", {
      converter: function(data) {
        return data && data.substr(0, 1);
      }
    }, {
      converter: function(data) {
        return data + "-";
      }
    });
    var model = c.createModel();

    // check if the model and the form still have the initial value
    assert.equal("A", __tf1.value);
    assert.equal("B", __tf2.value);
    assert.isTrue(__cb.value);
    assert.equal("A-", model.tf1);
    assert.equal("B", model.tf2);
    assert.isTrue(model.cb);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");
    __cb.value = (true);

    // check the binding
    assert.equal(__tf1.value + "-", model.tf1);
    assert.equal(__tf2.value, model.tf2);
    assert.equal(__cb.value, model.cb);

    // change the values
    __tf1.value = ("11");
    __tf2.value = ("21");
    __cb.value = (false);

    // check the binding
    assert.equal(__tf1.value + "-", model.tf1);
    assert.equal(__tf2.value, model.tf2);
    assert.equal(__cb.value, model.cb);

    // change the data in the model
    __model.tf1 = ("a");
    __model.tf2 = ("b");
    __model.cb = (true);

    // check the binding
    assert.equal(__tf1.value + "-", model.tf1);
    assert.equal(__tf2.value, model.tf2);
    assert.equal(__cb.value, model.cb);

    c.dispose();
  });


  it("ModelCreationDeep", function() {
    var form = new qx.ui.form.Form();
    var tf1 = new qx.ui.form.TextField("A");
    var tf2 = new qx.ui.form.TextField("B");

    form.add(tf1, null, null, "a.b1");
    form.add(tf2, null, null, "a.b2.c");

    var c = new qx.data.controller.Form(null, form);
    var model = c.createModel(true);

    // check if the creation worked
    assert.equal("A", model.a.b1);
    assert.equal("B", model.a.b2.c);

    tf1.dispose();
    tf2.dispose();
    c.dispose();
  });


  it("ModelCreationSpecialCaracter", function() {
    var form = new qx.ui.form.Form();
    var tf1 = new qx.ui.form.TextField("A");

    form.add(tf1, "a&b-c+d*e/f|g!h i.,:?;!~+-*/%{}()[]<>=^&|@/\\");

    var c = new qx.data.controller.Form(null, form);
    var model = c.createModel(true);

    // check if the creation worked
    assert.equal("A", model.abcdefghi);

    tf1.dispose();
    c.dispose();
  });


  it("RemoveTarget", function() {
    __form.add(__tf1, "tf1");

    var model = qx.data.marshal.Json.createModel({
      tf1: null,
      tf2: null,
      cb: null,
      sb: null
    });

    // create the controller
    var c = new qx.data.controller.Form(model, __form);

    // check the textfield
    assert.equal(__tf1.value, model.tf1);
    // change the values
    __tf1.value = ("11");
    // check the binding
    assert.equal(__tf1.value, model.tf1);

    // change the data in the model
    model.tf1 = ("a");

    // check the binding
    assert.equal(__tf1.value, model.tf1);

    // remove the target
    c.target = (null);

    // change the values in the model
    model.tf1 = ("affe");

    // check the form items
    assert.equal("a", __tf1.value);

    // change the values in the items
    __tf1.value = ("viele affen");

    // check the model
    assert.equal("affe", model.tf1);

    c.dispose();
  });


  it("Options", function() {
    // create the controller
    var c = new qx.data.controller.Form(__model, __form);

    // add the options
    var tf2model = {
      converter: function(data) {
        return "X" + data;
      }
    };
    var model2tf = {
      converter: function(data) {
        return data && data.substring(1);
      }
    };
    c.addBindingOptions("tf1", model2tf, tf2model);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");

    // check the binding
    assert.equal("X" + __tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);

    // change the values
    __tf1.value = ("11");
    __tf2.value = ("21");

    // check the binding
    assert.equal("X" + __tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);

    // change the data in the model
    __model.tf1 = ("Xa");
    __model.tf2 = ("b");

    // check the binding
    assert.equal(__tf1.value, __model.tf1.substring(1));
    assert.equal(__tf2.value, __model.tf2);
    c.dispose();
  });


  it("Dispose", function() {
    // just create the controller
    var c = new qx.data.controller.Form(__model, __form);
    c.dispose();

    // check if the bindings has been removed
    __model.tf1 = ("AFFE");
    assert.notEqual("AFFE", __tf1.value);
  });


  it("BindingCreateMissingOne", function() {
    // add an unknown item
    var tf = new qx.ui.form.TextField();
    __form.add(tf, "Unknown");

    // create the controller
    var c = new qx.data.controller.Form(__model, __form);

    // set values in the form
    __tf1.value = ("1");
    __tf2.value = ("2");
    __cb.value = (true);

    // check the binding
    assert.equal(__tf1.value, __model.tf1);
    assert.equal(__tf2.value, __model.tf2);
    assert.equal(__cb.value, __model.cb);

    // dispose the objects
    tf.dispose();
    c.dispose();
  });
});
