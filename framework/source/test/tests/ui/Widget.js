/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

describe("ui.Widget", function() {

  it("Create", function() {
    var widget = new qx.ui.Widget();
    widget.setAttribute("id", "affe");
    sandbox.append(widget);

    var element = document.getElementById("affe");
    qx.core.Assert.assertElement(element);

    widget.dispose();
  });


  it("SetCssClass", function() {
    var widget = new qx.ui.Widget();

    sandbox.append(widget);

    var element = widget[0];

    var className = qx.bom.element.Class.get(element);
    assert.equal(className, "");

    widget.defaultCssClass = "affe";
    className = qx.bom.element.Class.get(element);
    assert.equal(className, "affe");

    widget.defaultCssClass = "bar";
    className = qx.bom.element.Class.get(element);
    assert.equal(className, "bar");

    widget.dispose();
  });


  it("AddRemoveCssClass", function() {
    var widget = new qx.ui.Widget();
    sandbox.append(widget);

    var element = widget[0];

    var className = qx.bom.element.Class.get(element);
    assert.equal(className, "");

    widget.addClass("affe");
    assert.isTrue(widget.hasClass("affe"));

    widget.removeClass("affe");
    assert.isFalse(widget.hasClass("affe"));

    widget.dispose();
  });


  it("AutoId", function() {
    var widget1 = new qx.ui.Widget();
    var widget2 = new qx.ui.Widget();

    var idPrefix = qx.ui.Widget.ID_PREFIX;
    var id1 = widget1.getAttribute("id").replace(idPrefix, "");
    var id2 = widget2.getAttribute("id").replace(idPrefix, "");

    // check that the id's are next to each other
    assert.equal(parseInt(id1), parseInt(id2) - 1);

    widget1.dispose();
    widget2.dispose();
  });


  it("WidgetRegistration", function() {
    var widget = new qx.ui.Widget();
    sandbox.append(widget);

    widget = qx.ui.Widget.getWidgetById(widget.getAttribute("id"));
    assert.instanceOf(widget, qx.ui.Widget)

    widget.dispose();
  });


  it("Dispose", function() {
    var widget = new qx.ui.Widget();

    var id = widget.getAttribute("id");
    widget.dispose();
    widget = qx.ui.Widget.getWidgetById(id);
    assert.isUndefined(widget);
    var element = document.getElementById(id);
    assert.isNull(element);
  });


  it("Visibility", function() {
    var widget = new qx.ui.Widget();
    sandbox.append(widget);

    __assertShow(widget);

    widget.exclude();
    assert.notEqual("visible", widget.visibility, "Exclude: Widget should not be visible");
    assert.equal("excluded", widget.visibility, "Exclude: Widget should be excluded");
    assert.isTrue(widget.hasClass("exclude"), "Exclude: No exclude class set");
    assert.equal("visible", widget.getStyle("visibility"), "Exclude: Visibility style should be null");

    widget.show();
    __assertShow(widget);

    widget.hide();
    assert.notEqual("visible", widget.visibility, "Hide: Widget should not be visible");
    assert.isFalse(widget.visibility === "excluded", "Hide: Widget should not be excluded");
    assert.equal("hidden", widget.visibility, "Hide: Widget should be hidden");
    assert.isTrue(widget[0].offsetWidth > 0, "Hide: Widget should be seeable");
    assert.equal("block", widget.getStyle("display"), "Hide: Display style should be block");
    assert.isFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
    assert.equal("hidden", widget.getStyle("visibility"), "Hide: Visibility style should be hidden");

    widget.show();
    __assertShow(widget);

    widget.dispose();
  });


  function __assertShow(widget) {
    assert.equal("visible", widget.visibility, "Show: Widget should be visible");
    assert.notEqual("excluded", widget.visibility, "Show: Widget should not be excluded");
    assert.notEqual("hidden", widget.visibility, "Show: Widget should not be hidden");
    assert.isTrue(widget[0].offsetWidth > 0, "Show: Widget should be seeable");
    assert.equal("block", widget.getStyle("display"), "Show: Display style should be block");
    assert.isFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
    assert.equal("visible", widget.getStyle("visibility"), "Show: Visibility style should be visible");
  }


  it("Enabled", function() {
    var widget = new qx.ui.Widget();
    sandbox.append(widget);

    assert.equal(true, widget.enabled);
    assert.isFalse(qx.bom.element.Class.has(widget[0], 'disabled'));

    widget.enabled = false;
    assert.equal(false, widget.enabled);
    assert.equal(true, qx.bom.element.Class.has(widget[0], 'disabled'));

    assert.equal('none', qx.bom.element.Style.get(widget[0], 'pointerEvents'));

    widget.dispose();

    widget = new qx.ui.Widget();
    sandbox.append(widget);

    widget.enabled = true;
    widget.anonymous = true;
    assert.isFalse(qx.bom.element.Class.has(widget[0], 'disabled'));
    assert.equal('none', qx.bom.element.Style.get(widget[0], 'pointerEvents'));

    widget.enabled = false;
    assert.equal(true, qx.bom.element.Class.has(widget[0], 'disabled'));
    assert.equal('none', qx.bom.element.Style.get(widget[0], 'pointerEvents'));

    widget.enabled = true;
    assert.equal('none', qx.bom.element.Style.get(widget[0], 'pointerEvents'));

    widget.dispose();
  });


  it("InitWidget", function() {
    var el1 = document.createElement("div");
    el1.setAttribute("data-qx-widget", "qx.ui.Widget");
    sandbox[0].appendChild(el1);

    var el2 = document.createElement("div");
    el2.setAttribute("data-qx-widget", "qx.ui.Widget");
    sandbox[0].appendChild(el2);

    qx.ui.Widget.initWidgets();

    assert.instanceOf(el1.$$widget, qx.ui.Widget);
    assert.instanceOf(el2.$$widget, qx.ui.Widget);
  });


  it("InitWidgetSelector", function() {
    var el1 = document.createElement("div");
    el1.setAttribute("data-qx-widget", "qx.ui.Widget");
    sandbox[0].appendChild(el1);

    var el2 = document.createElement("div");
    el2.setAttribute("class", "foo");
    el2.setAttribute("data-qx-widget", "qx.ui.Widget");
    sandbox[0].appendChild(el2);

    qx.ui.Widget.initWidgets(".foo");

    assert.isUndefined(el1.$$widget);
    assert.instanceOf(el2.$$widget, qx.ui.Widget);
  });


  it("InitWidgetFunction", function() {
    var el1 = document.createElement("div");
    sandbox[0].appendChild(el1);

    var el2 = document.createElement("div");
    el2.affe = true;
    el2.setAttribute("data-qx-widget", "qx.ui.Widget");
    sandbox[0].appendChild(el2);

    qx.ui.Widget.initWidgets(function(el) {
      return !!el2.affe;
    });

    assert.isUndefined(el1.$$widget);
    assert.instanceOf(el2.$$widget, qx.ui.Widget);
  });


  it("RestoreInstance", function() {
    var widget = new qx.ui.Widget();
    widget.setAttribute("id", "affe");
    sandbox.append(widget);

    var element = document.getElementById("affe");
    assert.equal(widget, qxWeb(element));

    widget.dispose();
  });


  function _testAddedChild(invokeFunc) {
    var child = new qx.ui.Widget();

    var spyChild = sinon.spy();
    child.on("addedToParent", spyChild);

    var spyParent = sinon.spy();
    sandbox.on("addedChild", spyParent);

    invokeFunc.call(this, child);

    sinon.assert.calledOnce(spyParent);
    sinon.assert.calledWith(spyParent, child);

    sinon.assert.calledOnce(spyChild);
    sinon.assert.calledWith(spyChild, sandbox);
  };


  function _testAddedChildTwice(invokeFunc) {
    var children = qxWeb.create(
      "<div data-qx-widget='qx.ui.Widget'></div>" +
      "<div data-qx-widget='qx.ui.Widget'></div>"
    );

    var spyChild1 = sinon.spy();
    children.eq(0).on("addedToParent", spyChild1);

    var spyChild2 = sinon.spy();
    children.eq(1).on("addedToParent", spyChild2);

    var spyParent = sinon.spy();
    sandbox.on("addedChild", spyParent);

    invokeFunc.call(this, children);

    sinon.assert.calledTwice(spyParent);
    assert.isTrue(children.contains(spyParent.args[0][0][0]).length > 0);
    assert.isTrue(children.contains(spyParent.args[1][0][0]).length > 0);

    sinon.assert.calledOnce(spyChild1);
    sinon.assert.calledWith(spyChild1, sandbox);

    sinon.assert.calledOnce(spyChild2);
    sinon.assert.calledWith(spyChild2, sandbox);
  };


  function _testAddedChildHtml(invokeFunc) {
    var child = "<div></div>";

    var spy = sinon.spy();
    sandbox.on("addedChild", spy);

    invokeFunc.call(this, child);

    sinon.assert.calledOnce(spy);
    assert.equal(child, spy.args[0][0][0].outerHTML);
  };


  it("addedChild - append", function() {
    _testAddedChild(function(child) {
      sandbox.append(child);
    });
  });

  it("addedChild - append - multiple", function() {
    _testAddedChildTwice(function(children) {
      sandbox.append(children);
    });
  });

  it("addedChild - append - html", function() {
    _testAddedChildHtml(function(html) {
      sandbox.append(html);
    });
  });


  it("addedChild - appendAt", function() {
    _testAddedChild(function(child) {
      sandbox.appendAt(child, 0);
    });
  });

  it("addedChild - appendAt - multiple", function() {
    _testAddedChildTwice(function(children) {
      sandbox.appendAt(children, 0);
    });
  });

  it("addedChild - insertAfter", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      child.insertAfter(sibling);
    });
  });

  it("addedChild - insertAfter - multiplie", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChildTwice(function(children) {
      children.insertAfter(sibling);
    });
  });

  it("addedChild - insertBefore", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      child.insertBefore(sibling);
    });
  });

  it("addedChild - insertBefore - multiple", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChildTwice(function(children) {
      children.insertBefore(sibling);
    });
  });


  it("addedChild - after", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      sibling.after(child);
    });
  });

  it("addedChild - after - multiple", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChildTwice(function(children) {
      sibling.after(children);
    });
  });


  it("addedChild - before", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      sibling.before(child);
    });
  });

  it("addedChild - before - multiple", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChildTwice(function(children) {
      sibling.before(children);
    });
  });


  it("addedChild - appendTo", function() {
    _testAddedChild(function(child) {
      child.appendTo(sandbox);
    });
  });

  it("addedChild - appendTo - multiple", function() {
    _testAddedChildTwice(function(children) {
      children.appendTo(sandbox);
    });
  });


  it("removedChild - remove", function() {
    sandbox.append(qxWeb.create("<div>"));
    var child = new qx.ui.Widget();
    sandbox.append(child);

    qx.core.Assert.assertEventFired(sandbox,
      "removedChild",
      function() {
        child.remove();
      }.bind(this),
      function(removedChild) {
        assert.equal(child, removedChild);
        assert.equal(removedChild.priorPosition, 1);
      }.bind(this)
    );
  });


  it("removedChild - remove - multiple", function() {
    sandbox.append(new qx.ui.Widget());
    sandbox.append(new qx.ui.Widget());
    sandbox.append(new qx.ui.Widget());

    var spy = sinon.spy();
    sandbox.on("removedChild", spy);
    sandbox.getChildren().remove();

    sinon.assert.calledThrice(spy);
  });


  it("removedChild - empty", function() {
    var child1 = new qx.ui.Widget();
    sandbox.append(child1);
    var child2 = new qx.ui.Widget();
    sandbox.append(child2);

    var cb = sinonSandbox.spy();
    sandbox.on("removedChild", cb);
    sandbox.empty();
    sinon.assert.calledTwice(cb);
    assert.equal(cb.args[0][0], child1);
    assert.equal(cb.args[0][0].priorPosition, 0);
    assert.equal(cb.args[1][0], child2);
    assert.equal(cb.args[1][0].priorPosition, 1);
    sandbox.off("removedChild", cb);
  });


  it("Factory", function() {
    var widget = qxWeb.create("<div>").toWidget().appendTo(sandbox);
    assert.instanceOf(widget, qx.ui.Widget);
    assert.equal(widget, widget[0].$$widget);
    assert.equal("qx.ui.Widget", widget.getData("qxWidget"));

    widget.dispose();
  });


  it("Wrapper", function() {
    var w0 = q.create('<div id="w0" class="wrapped">').toWidget().appendTo(sandbox);
    var w1 = q.create('<div id="w1" class="wrapped">').toWidget().appendTo(sandbox);

    var wrapper = q(".wrapped").toWidgetCollection();
    assert.instanceOf(wrapper, qx.core.Wrapper);
    assert.equal(wrapper.length, 2);
    assert.equal(wrapper[0], w0);
    assert.equal(wrapper[1], w1);

    assert.equal(wrapper.getAttribute("id"), "w0");

    wrapper.set({enabled: false});
    assert.isTrue(w0.hasClass("disabled"));
    assert.isTrue(w1.hasClass("disabled"));

    var spy = sinon.spy();
    wrapper.on("removedFromParent", spy).remove();
    sinon.assert.calledTwice(spy);
    assert.equal(spy.firstCall.thisValue, w0);
    assert.equal(spy.secondCall.thisValue, w1);
  });
});
