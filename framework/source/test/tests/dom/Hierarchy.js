/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

describe("dom.Hierarchy", function() {

  var __childElement;
  var __siblingElement;
  var __unRenderedElement;
  var __notDisplayedElement;
  var __childOfNotDisplayedElement;
  var sandbox;

  beforeEach(function() {
    sandbox = q.create("<div id='sandbox'></div>").appendTo(document.body);
    __renderedElement = document.createElement("div");
    sandbox.append(__renderedElement);

    __unRenderedElement = document.createElement("div");

    __notDisplayedElement = document.createElement("div");
    sandbox.append(__notDisplayedElement);
    qx.bom.element.Style.set(__notDisplayedElement, "display", "none");

    __childOfNotDisplayedElement = document.createElement("div");
    __notDisplayedElement.appendChild(__childOfNotDisplayedElement);
  });


  afterEach(function() {
    sandbox.remove();
  });


  it("IsRendered", function() {
    assert.isTrue(qx.dom.Hierarchy.isRendered(__renderedElement));
    assert.isFalse(qx.dom.Hierarchy.isRendered(__unRenderedElement));
    assert.isTrue(qx.dom.Hierarchy.isRendered(__notDisplayedElement));
    assert.isTrue(qx.dom.Hierarchy.isRendered(__childOfNotDisplayedElement));
  });


  it("IsRenderedIframe", function(done) {
    if (!qx.bom.Iframe) {
      this.test.skipped = true;
      done();
      return;
    }
    var iframe = document.createElement("iframe");
    qx.bom.Iframe.setSource(iframe, "/");
    sandbox.append(iframe);

    qxWeb(iframe).once("load", function(e) {
      setTimeout(function() {
        assert.isTrue(qx.dom.Hierarchy.isRendered(iframe));
        done();
      }, 10);
    }, this);
  });


  it("GetCommonParent", function() {
    __siblingElement = document.createElement("div");
    sandbox.append(__siblingElement);

    assert.equal(sandbox[0],
      qx.dom.Hierarchy.getCommonParent(__renderedElement, __siblingElement));

    __childElement = document.createElement("div");
    __renderedElement.appendChild(__childElement);
    assert.equal(__renderedElement,
      qx.dom.Hierarchy.getCommonParent(__renderedElement, __childElement));
  });


  it("GetNodeIndex", function() {
    var nodeIndexSandbox = qx.dom.Hierarchy.getNodeIndex(sandbox);
    var nodeIndexSibling = qx.dom.Hierarchy.getNodeIndex(__siblingElement);
    assert.equal(nodeIndexSibling, 2);
    assert.equal(nodeIndexSandbox, 0);
  });


  it("GetElementIndex", function() {
    var SiblingElementIndex = qx.dom.Hierarchy.getElementIndex(__siblingElement);
    var childElementIndex = qx.dom.Hierarchy.getElementIndex(__childElement);
    assert.equal(SiblingElementIndex, 2);
    assert.equal(childElementIndex, 0);
  });


  it("GetNextElementSibling", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    var next = qx.dom.Hierarchy.getNextElementSibling(e1);
    assert.deepEqual(e2, next);
  });


  it("GetPreviousElementSibling", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    var previous = qx.dom.Hierarchy.getPreviousElementSibling(e2);
    assert.deepEqual(e1, previous);
  });

  it("GetPreviousSibling", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    var previous = qx.dom.Hierarchy.getPreviousSiblings(e2)[0];
    assert.deepEqual(e1, previous);
  });


  it("Contains", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    assert.isTrue(qx.dom.Hierarchy.contains(sandbox, e1));
    assert.isFalse(qx.dom.Hierarchy.contains(e1, sandbox[0]));
    assert.isTrue(qx.dom.Hierarchy.contains(document, sandbox[0]));
    assert.isFalse(qx.dom.Hierarchy.contains(sandbox, document));

    assert.isTrue(qx.dom.Hierarchy.contains(document.body, __renderedElement));

    __childElement = document.createElement("div");
    __renderedElement.appendChild(__childElement);
    assert.isTrue(qx.dom.Hierarchy.contains(__renderedElement, __childElement));
    assert.isFalse(qx.dom.Hierarchy.contains(__childElement, __renderedElement));

    __siblingElement = document.createElement("div");
    sandbox.append(__siblingElement);
    assert.isFalse(qx.dom.Hierarchy.contains(__renderedElement, __siblingElement));
  });


  it("IsDescendantOf", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    assert.isTrue(qx.dom.Hierarchy.isDescendantOf(e1, sandbox));
    assert.isTrue(qx.dom.Hierarchy.isDescendantOf(e2, sandbox));
  });


  it("GetAncestors", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    assert.deepEqual(qx.dom.Hierarchy.getAncestors(e1)[0], sandbox[0]);
    assert.deepEqual(qx.dom.Hierarchy.getAncestors(e2)[0], sandbox[0]);
  });


  it("GetChildElements", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    assert.deepEqual(qx.dom.Hierarchy.getChildElements(sandbox[0])[2], e1);
    assert.deepEqual(qx.dom.Hierarchy.getChildElements(sandbox[0])[3], e2);
  });


  it("GetDescendants", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    var e2 = document.createElement("div");
    e2.id = "elem2";
    sandbox.append(e1);
    sandbox.append(e2);
    assert.deepEqual(e1, qx.dom.Hierarchy.getDescendants(sandbox[0])[3]);
    assert.deepEqual(e2, qx.dom.Hierarchy.getDescendants(sandbox[0])[4]);
  });


  it("GetFirstDescendant", function() {
    assert.deepEqual(__renderedElement, qx.dom.Hierarchy.getFirstDescendant(sandbox[0]));
  });


  it("GetLastDescendant", function() {
    var e1 = document.createElement("div");
    e1.id = "elem1";
    sandbox.append(e1);
    assert.deepEqual(e1, qx.dom.Hierarchy.getLastDescendant(sandbox[0]));
  });


  it("IsEmpty", function() {
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    sandbox.append(e1);
    assert.isTrue(qx.dom.Hierarchy.isEmpty(e1));
    e1.appendChild(e2);
    assert.isFalse(qx.dom.Hierarchy.isEmpty(e1));
  });

});
