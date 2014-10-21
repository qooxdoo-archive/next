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

describe("dom.Hierarchy", function()
{
  var __childElement;
  var __siblingElement;
  var __unRenderedElement;
  var __notDisplayedElement;
  var __childOfNotDisplayedElement;
  var sandbox;

  beforeEach (function () {
    sandbox = q.create("<div id='sandbox'></div>").appendTo(document.body);
    __renderedElement = qx.dom.Element.create("div");
    sandbox.append(__renderedElement);

    __unRenderedElement = qx.dom.Element.create("div");

    __notDisplayedElement = qx.dom.Element.create("div");
    sandbox.append(__notDisplayedElement);
    qx.bom.element.Style.set(__notDisplayedElement, "display", "none");

    __childOfNotDisplayedElement = qx.dom.Element.create("div");
    __notDisplayedElement.appendChild(__childOfNotDisplayedElement);
  });


  afterEach (function () {
    sandbox.remove();
  });



  it("IsRendered", function() {
    assert.isTrue(qx.dom.Hierarchy.isRendered(__renderedElement));
    assert.isFalse(qx.dom.Hierarchy.isRendered(__unRenderedElement));
    assert.isTrue(qx.dom.Hierarchy.isRendered(__notDisplayedElement));
    assert.isTrue(qx.dom.Hierarchy.isRendered(__childOfNotDisplayedElement));
  });


  it("IsRenderedIframe", function(done) {
    var iframe = qx.bom.Iframe.create();
    qx.bom.Iframe.setSource(iframe, "/");
    sandbox.append(iframe);

    qxWeb(iframe).once("load", function(e) {
      setTimeout( function()  {
        assert.isTrue(qx.dom.Hierarchy.isRendered(iframe));
        done();
      }, 10);
    }, this);
  });


  it("Contains", function() {
    assert.isTrue(qx.dom.Hierarchy.contains(document.body, __renderedElement));

    __childElement = qx.dom.Element.create("div");
    __renderedElement.appendChild(__childElement);
    assert.isTrue(qx.dom.Hierarchy.contains(__renderedElement, __childElement));
    assert.isFalse(qx.dom.Hierarchy.contains(__childElement, __renderedElement));

    __siblingElement = qx.dom.Element.create("div");
    sandbox.append(__siblingElement);
    assert.isFalse(qx.dom.Hierarchy.contains(__renderedElement, __siblingElement));
  });


  it("GetCommonParent", function() {
    __siblingElement = qx.dom.Element.create("div");
    sandbox.append(__siblingElement);

    assert.equal(sandbox[0],
    qx.dom.Hierarchy.getCommonParent(__renderedElement, __siblingElement));

    __childElement = qx.dom.Element.create("div");
    __renderedElement.appendChild(__childElement);
    assert.equal(__renderedElement,
    qx.dom.Hierarchy.getCommonParent(__renderedElement, __childElement));
  });
});
