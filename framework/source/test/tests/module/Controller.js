describe("module.Controller", function() {

  // ATTRIBUTE

  it("simple attribute", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getData("a"));
  });

  it("two attributes", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> data-a; {{b}} -> data-b'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getData("a"));
    ctrl.b = "B";
    assert.equal("B", sandbox.getChildren().getData("b"));
  });

  it("simple attribute on root", function() {
    sandbox.setData("bind", "{{a}} -> data-a");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getData("a"));
  });

  it("deep attribute", function() {
    sandbox.setHtml("<div data-bind='{{a.b}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = qx.data.marshal.Json.createModel({b: "A"});
    assert.equal("A", sandbox.getChildren().getData("a"));
  });

  it("deep attribute with array", function() {
    sandbox.setHtml("<div data-bind='{{a[0]}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = new qx.data.Array(["A"]);
    assert.equal("A", sandbox.getChildren().getData("a"));
  });

  it("two way attribute", function() {
    sandbox.setHtml("<input type='checkbox' data-bind='{{a}} <-> checked'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = true;
    assert.isTrue(sandbox.getChildren().getAttribute("checked"));
    sandbox.getChildren().setAttribute("checked", false);
    sandbox.getChildren().emit("change"); // fake change event
    assert.isFalse(ctrl.a);
  });

  it("init attribute", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> data-a' data-a='A'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    assert.equal("A", sandbox.getChildren().getData("a"));
    assert.equal("A", ctrl.a);
  });

  it("attribute with text", function() {
    sandbox.setHtml("<div data-bind='x{{a}}y -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("xAy", sandbox.getChildren().getData("a"));
  });

  it("attribute with converter", function() {
    sandbox.setHtml("<div data-bind='{{trim(a)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = " A ";
    assert.equal("A", sandbox.getChildren().getData("a"));
  });

  it("attribute with multiple", function() {
    sandbox.setHtml("<div data-bind='{{a}}{{b}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isUndefined(sandbox.getChildren().getData("a"));
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getData("a"));
    ctrl.b = "B";
    assert.equal("AB", sandbox.getChildren().getData("a"));
  });

  it("attribute with multiple and text", function() {
    sandbox.setHtml("<div data-bind='{{a}}-{{b}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isUndefined(sandbox.getChildren().getData("a"));
    ctrl.a = "A";
    assert.equal("A-", sandbox.getChildren().getData("a"));
    ctrl.b = "B";
    assert.equal("A-B", sandbox.getChildren().getData("a"));
  });


  // STYLE

  it("simple style", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> style.paddingTop'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "10px";
    assert.equal("10px", sandbox.getChildren().getStyle("paddingTop"));
  });

  it("simple style on root", function() {
    sandbox.setData("bind", "{{a}} -> style.paddingTop");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "10px";
    assert.equal("10px", sandbox.getStyle("paddingTop"));
  });

  it("deep style", function() {
    sandbox.setHtml("<div data-bind='{{a.b}} -> style.paddingTop'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = qx.data.marshal.Json.createModel({b: "10px"});
    assert.equal("10px", sandbox.getChildren().getStyle("paddingTop"));
  });

  it("deep style with array", function() {
    sandbox.setHtml("<div data-bind='{{a[0]}} -> style.paddingTop'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = new qx.data.Array(["10px"]);
    assert.equal("10px", sandbox.getChildren().getStyle("paddingTop"));
  });

  it("style with text", function() {
    sandbox.setHtml("<div data-bind='{{a}}px -> style.paddingTop'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "10";
    assert.equal("10px", sandbox.getChildren().getStyle("paddingTop"));
  });

  it("style with converter", function() {
    sandbox.setHtml("<div data-bind='{{trim(a)}} -> style.paddingTop'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "   10px   ";
    assert.equal("10px", sandbox.getChildren().getStyle("paddingTop"));
  });


  // CLASS

  it("simple class", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> class.myClass'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = true;
    assert.isTrue(sandbox.getChildren().hasClass("myClass"));
    ctrl.a = false;
    assert.isFalse(sandbox.getChildren().hasClass("myClass"));
  });

  it("simple class on root", function() {
    sandbox.setData("bind", "{{a}} -> class.myClass");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = true;
    assert.isTrue(sandbox.hasClass("myClass"));
    ctrl.a = false;
    assert.isFalse(sandbox.hasClass("myClass"));
  });

  it("deep class", function() {
    sandbox.setHtml("<div data-bind='{{a.b}} -> class.myClass'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = qx.data.marshal.Json.createModel({b: true});
    assert.isTrue(sandbox.getChildren().hasClass("myClass"));
    ctrl.a.b = false;
    assert.isFalse(sandbox.getChildren().hasClass("myClass"));
  });

  it("deep class with array", function() {
    sandbox.setHtml("<div data-bind='{{a[0]}} -> class.myClass'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = new qx.data.Array([true])
    assert.isTrue(sandbox.getChildren().hasClass("myClass"));
    ctrl.a.setItem(0, false);
    assert.isFalse(sandbox.getChildren().hasClass("myClass"));
  });

  it("class with converter", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> class.myClass'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = true;
    assert.isTrue(sandbox.getChildren().hasClass("myClass"));
    ctrl.a = false;
    assert.isFalse(sandbox.getChildren().hasClass("myClass"));
  });

  it("class with two tag contents", function() {
    sandbox.setHtml("<div data-bind='{{a}}{{b}} -> class.myClass'></div>");
    assert.throws(function() {
      new qx.module.Controller(sandbox);
    });
  });



  // WIDGET

  it("simple widget", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a}} -> data-qx-config-value'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    ctrl.a = 1;
    assert.equal(1, rating.value);
  });

  it("simple widget on root", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a}} -> data-qx-config-value'></div>");
    var rating = sandbox.getChildren();
    var ctrl = new qx.module.Controller(rating);

    ctrl.a = 1;
    assert.equal(1, rating.value);
  });

  it("deep widget", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a.b}} -> data-qx-config-value'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    ctrl.a = qx.data.marshal.Json.createModel({b: 2});
    assert.equal(2, rating.value);
  });

  it("deep widget with array", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a[0]}} -> data-qx-config-value'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    ctrl.a = new qx.data.Array([1])
    assert.equal(1, rating.value);
  });

  it("two way widget", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a}} <-> data-qx-config-value'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    ctrl.a = 1;
    assert.equal(1, rating.value);

    rating.value = 2;
    assert.equal(2, ctrl.a);
  });

  it("init widget", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{a}} -> data-qx-config-value' data-qx-config-value='2'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    assert.equal(2, rating.value);
    assert.equal(2, ctrl.a);
  });

  it("widget with converter", function() {
    sandbox.setHtml("<div data-qx-widget='qx.ui.Rating' data-bind='{{twice(a}} -> data-qx-config-value'></div>");
    qx.module.Controller.twice = function(data) {
      return data ? data * 2 : data;
    }
    var ctrl = new qx.module.Controller(sandbox);
    var rating = sandbox.getChildren();
    ctrl.a = 1;
    assert.equal(2, rating.value);
    qx.module.Controller.twice = null;
  });


  // COLLECTION

  it("simple collection", function() {
    sandbox.setHtml("<input data-bind='{{a}} -> value'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getValue());
  });

  it("simple collection on root", function() {
    sandbox.setHtml("<input data-bind='{{a}} -> value'>");
    var ctrl = new qx.module.Controller(sandbox.getChildren());
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getValue());
  });

  it("deep collection", function() {
    sandbox.setHtml("<input data-bind='{{a.b}} -> value'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = qx.data.marshal.Json.createModel({b: "A"});
    assert.equal("A", sandbox.getChildren().getValue());
  });

  it("deep collection with array", function() {
    sandbox.setHtml("<input data-bind='{{a[0]}} -> value'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = new qx.data.Array(["A"]);
    assert.equal("A", sandbox.getChildren().getValue());
  });

  it("two way collection", function() {
    sandbox.setHtml("<input data-bind='{{a}} <-> value'>");

    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getValue());

    sandbox.getChildren().setValue("B");
    sandbox.getChildren().emit("change"); // fake change event
    assert.equal("B", ctrl.a);

    sandbox.getChildren().setValue("C");
    sandbox.getChildren().emit("input"); // fake change event
    assert.equal("C", ctrl.a);
  });

  it("init collection", function() {
    sandbox.setHtml("<input data-bind='{{a}} -> value' value='A'>");
    var ctrl = new qx.module.Controller(sandbox);
    assert.equal("A", sandbox.getChildren().getValue());
    assert.equal("A", ctrl.a);
  });

  it("collection with text", function() {
    sandbox.setHtml("<input data-bind='x{{a}}y -> value'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("xAy", sandbox.getChildren().getValue());
  });

  it("collection with converter", function() {
    sandbox.setHtml("<input data-bind='{{trim(a)}} -> value'>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "  A   ";
    assert.equal("A", sandbox.getChildren().getValue());
  });


  // ERROR

  it("error binding empty", function() {
    sandbox.setHtml("<div data-bind=''></div>");
    var ctrl = new qx.module.Controller(sandbox);
  });

  it("error binding wrong content", function() {
    sandbox.setHtml("<div data-bind='test;no;yes'></div>");
    var ctrl = new qx.module.Controller(sandbox);
  });

  it("error binding mixed wrong content", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> data-a;test;no;yes'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A", sandbox.getChildren().getData("a"));
  });



  // CONVERTER

  it("converter: not", function() {
    sandbox.setHtml("<div data-bind='{{not(a)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = true;
    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.a = false;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));
  });

  it("converter: trim", function() {
    sandbox.setHtml("<div data-bind='{{trim(a)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "  A  ";
    assert.equal("A", sandbox.getChildren().getData("a"));
  });

  it("converter: and", function() {
    sandbox.setHtml("<div data-bind='{{and(a, b)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.b = true;
    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.a = true;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));

    ctrl.b = false;
    assert.isNull(sandbox.getChildren().getAttribute("data-a"));
  });

  it("converter: and with 3", function() {
    sandbox.setHtml("<div data-bind='{{and(a, b, c)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.a = true;
    ctrl.b = true;
    ctrl.c = true;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));
  });

  it("converter: or", function() {
    sandbox.setHtml("<div data-bind='{{or(a, b)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.b = true;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));

    ctrl.a = true;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));

    ctrl.b = false;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));
  });

  it("converter: or with 3", function() {
    sandbox.setHtml("<div data-bind='{{or(a, b, c)}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);

    assert.isNull(sandbox.getChildren().getAttribute("data-a"));

    ctrl.b = true;
    assert.equal("data-a", sandbox.getChildren().getAttribute("data-a"));
  });

  it("converter: custom", function() {
    sandbox.setHtml("<div data-bind='{{custom(a)}} -> data-a'></div>");
    qx.module.Controller.custom = function(data) {
      return data ? data + "!!!" : data;
    };
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.equal("A!!!", sandbox.getChildren().getData("a"));
  });

  it("converter: custom extend", function() {
    var C = qx.Class.define(null, {
      extend : qx.module.Controller,
      statics: {
        custom : function(data) {
          return data ? data + "!!!" : data;
        }
      }
    });
    sandbox.setHtml("<div data-bind='{{custom(a)}} -> data-a'></div>");

    var ctrl = new C(sandbox);
    ctrl.a = "A";
    assert.equal("A!!!", sandbox.getChildren().getData("a"));
  });

  it("converter: extend", function() {
    var C = qx.Class.define(null, {
      extend : qx.module.Controller,
    });
    sandbox.setHtml("<div data-bind='{{trim(a)}} -> data-a'></div>");

    var ctrl = new C(sandbox);
    ctrl.a = "  A   ";
    assert.equal("A", sandbox.getChildren().getData("a"));
  });


  // MODEL PROPERTIES

  it("model auto generate", function() {
    sandbox.setHtml("<div data-bind='{{a}} -> data-a'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = "A";
    assert.isTrue(qx.Class.hasProperty(ctrl, "a"));
  });

  it("model add", function() {
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.addModel("a")
    assert.isTrue(qx.Class.hasProperty(ctrl, "a"));
  });

  it("model add with init", function() {
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.addModel("a", "A")
    assert.isTrue(qx.Class.hasProperty(ctrl, "a"));
    assert.equal("A", ctrl.a);
  });

  it("model add with init multiple", function() {
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.addModel("a", "A")
    assert.isTrue(qx.Class.hasProperty(ctrl, "a"));
    assert.equal("A", ctrl.a);
    ctrl.addModel("a", "B")
    assert.equal("A", ctrl.a);
  });



  // DATA REPEAT

  it("repeat", function() {
    sandbox.setHtml("<div data-repeat='{{a}}'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    assert.equal("qx.ui.List", sandbox.getChildren().getData("qx-widget"));
    assert.equal("{{a}} <-> data-qx-config-model", sandbox.getChildren().getData("bind"));
  });


  it("repeat with binding", function() {
    sandbox.setHtml("<div data-repeat='{{a}}' data-bind='{{b}} -> data-b'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    assert.equal("qx.ui.List", sandbox.getChildren().getData("qx-widget"));
    var bindings = sandbox.getChildren().getData("bind").split(";");

    bindings = bindings.map(function(txt) {
      return txt.trim();
    });

    assert.isTrue(bindings.indexOf("{{b}} -> data-b") != -1);
    assert.isTrue(bindings.indexOf("{{a}} <-> data-qx-config-model") != -1);
  });


  // EVENTS

  it("simple event", function() {
    sandbox.setHtml("<div data-event='custom -> custom()'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.custom = sinon.spy();
    sandbox.getChildren().emit("custom");

    sinon.assert.calledOnce(ctrl.custom);
  });

  it("simple event on root", function() {
    sandbox.setData("event", "custom -> custom()");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.custom = sinon.spy();
    sandbox.emit("custom");

    sinon.assert.calledOnce(ctrl.custom);
  });

  it("two events", function() {
    sandbox.setHtml("<div data-event='custom -> custom(); custom -> custom2()'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.custom = sinon.spy();
    ctrl.custom2 = sinon.spy();
    sandbox.getChildren().emit("custom");

    sinon.assert.calledOnce(ctrl.custom);
    sinon.assert.calledOnce(ctrl.custom2);
  });

  it("event with nested handler", function() {
    sandbox.setHtml("<div data-event='custom -> a.custom()'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = {custom: sinon.spy()};
    sandbox.getChildren().emit("custom");

    sinon.assert.calledOnce(ctrl.a.custom);
  });

  it("event missing brakets", function() {
    sandbox.setHtml("<div data-event='custom -> custom'></div>");
    assert.throws(function() {
      new qx.module.Controller(sandbox);
    })
  });

  it("event with nested handler - object in array", function() {
    sandbox.setHtml("<div data-event='custom -> a[0].custom()'></div>");
    var ctrl = new qx.module.Controller(sandbox);
    ctrl.a = new qx.data.Array([{custom: sinon.spy()}]);
    sandbox.getChildren().emit("custom");

    sinon.assert.calledOnce(ctrl.a.getItem(0).custom);
  });

  it("event missing brakets", function() {
    sandbox.setHtml("<div data-event='custom -> custom'></div>");
    assert.throws(function() {
      new qx.module.Controller(sandbox);
    })
  });


  // CLOAK

  it("cloak", function() {
    sandbox.setHtml("<div class='cloak'></div>");
    assert.isTrue(sandbox.getChildren().hasClass("cloak"));
    var ctrl = new qx.module.Controller(sandbox);
    assert.isFalse(sandbox.getChildren().hasClass("cloak"));
  });

  it("cloak root", function() {
    sandbox.addClass("cloak");
    assert.isTrue(sandbox.hasClass("cloak"));
    var ctrl = new qx.module.Controller(sandbox);
    assert.isFalse(sandbox.hasClass("cloak"));
  });
});
