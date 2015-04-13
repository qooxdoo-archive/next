/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("dom.Element", function() {

  beforeEach(function() {
    var div = document.createElement("div");
    div.id = "sandbox";
    document.body.appendChild(div);
  });


  afterEach(function() {
    qxWeb("#sandbox").remove();
  });


  it("Empty", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    qx.dom.Element.empty(sandbox);
    assert.equal("", sandbox.innerHTML);
  });


  it("HasChild", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.appendChild(e1);
    assert.isTrue(qx.dom.Element.hasChild(sandbox, e1));
    assert.isFalse(qx.dom.Element.hasChild(sandbox, e2));
  });


  it("HasChildren", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.appendChild(e1);
    assert.isTrue(qx.dom.Element.hasChildren(sandbox));
    assert.isFalse(qx.dom.Element.hasChildren(e1));
  });


  it("HasChildElements", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.appendChild(e1);
    assert.isTrue(qx.dom.Element.hasChildElements(sandbox));
    assert.isFalse(qx.dom.Element.hasChildElements(e1));
  });


  it("IsInDom", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.appendChild(e1);
    assert.isTrue(qx.dom.Element.isInDom(sandbox));
    assert.isFalse(qx.dom.Element.isInDom(e2));
  });



  it("InsertAt", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    qx.dom.Element.insertAt(e1, sandbox, 0);
    assert.deepEqual(sandbox.children[0], e1);
    qx.dom.Element.insertAt(e2, sandbox, 6);
    assert.deepEqual(sandbox.children[1], e2);
  });


  it("InsertBegin", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    qx.dom.Element.insertBegin(e1, sandbox);
    assert.deepEqual(sandbox.children[0], e1);
    qx.dom.Element.insertBegin(e2, sandbox);
    assert.deepEqual(sandbox.children[0], e2);
  });


  it("InsertEnd", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    qx.dom.Element.insertEnd(e1, sandbox);
    assert.deepEqual(sandbox.children[0], e1);
    qx.dom.Element.insertEnd(e2, sandbox);
    assert.deepEqual(sandbox.children[1], e2);
  });


  it("InsertAfter", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.appendChild(e1);
    qx.dom.Element.insertAfter(e2, e1);
    assert.deepEqual(sandbox.children[1], e2);
  });


  it("RemoveChild", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    qx.dom.Element.insertEnd(e1, sandbox);
    qx.dom.Element.insertEnd(e2, sandbox);
    qx.dom.Element.removeChild(e1, sandbox);
    assert.deepEqual(sandbox.children[0], e2);
  });


  it("RemoveChildAt", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    qx.dom.Element.insertEnd(e1, sandbox);
    qx.dom.Element.insertEnd(e2, sandbox);
    qx.dom.Element.removeChildAt(1, sandbox);
    assert.deepEqual(sandbox.children[0], e2);
    assert.isFalse(qx.dom.Element.removeChildAt(4, sandbox));
  });


  it("ReplaceChild", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    qx.dom.Element.insertEnd(e1, sandbox);
    assert.isFalse(qx.dom.Element.replaceChild(e1, e2));
    qx.dom.Element.replaceChild(e2, e1);
    assert.equal(sandbox.children[0], e2);
  });


  it("ReplaceAt", function() {
    var sandbox = document.getElementById("sandbox");
    sandbox.innerHTML = "Juhu";
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    qx.dom.Element.insertEnd(e1, sandbox);
    assert.isFalse(qx.dom.Element.replaceAt(e1,4,sandbox));
    qx.dom.Element.replaceAt(e2, 0, sandbox);
    assert.equal(sandbox.children[0], e2);
  });

});
