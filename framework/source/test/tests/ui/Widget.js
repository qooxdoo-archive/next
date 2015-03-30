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
    qx.core.Assert.assertEventFired(sandbox,
      "addedChild",
      invokeFunc.bind(this, child),
      function(newChild) {
        assert.equal(child, newChild);
      }.bind(this)
    );
  }


  it("AddedChildAppend", function() {
    _testAddedChild(function(child) {
      sandbox.append(child);
    });
  });


  it("AddedChildAppendAt", function() {
    _testAddedChild(function(child) {
      sandbox.appendAt(child, 0);
    });
  });


  it("AddedChildInsertAfter", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      child.insertAfter(sibling);
    });
  });


  it("AddedChildInsertBefore", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      child.insertBefore(sibling);
    });
  });


  it("AddedChildAfter", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      sibling.after(child);
    });
  });


  it("AddedChildBefore", function() {
    var sibling = new qx.ui.Widget();
    sandbox.append(sibling);
    _testAddedChild(function(child) {
      sibling.before(child);
    });
  });


  it("AddedChildAppendTo", function() {
    _testAddedChild(function(child) {
      child.appendTo(sandbox);
    });
  });


  it("RemovedChildRemove", function() {
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


  it("RemovedChildEmpty", function() {
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
