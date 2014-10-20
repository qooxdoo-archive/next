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
  var __childElement = null;
  var __siblingElement = null;
  var __iframe = null;
  beforeEach (function ()
  {
    __renderedElement = qx.dom.Element.create("div");
    document.body.appendChild(__renderedElement);

    __unRenderedElement = qx.dom.Element.create("div");

    __notDisplayedElement = qx.dom.Element.create("div");
    document.body.appendChild(__notDisplayedElement);
    qx.bom.element.Style.set(__notDisplayedElement, "display", "none");

    __childOfNotDisplayedElement = qx.dom.Element.create("div");
    __notDisplayedElement.appendChild(__childOfNotDisplayedElement);
  });


  afterEach (function ()
  {
    if (__childElement) {
      __renderedElement.removeChild(__childElement);
      __childElement = null;
    }

    if (__siblingElement) {
      document.body.removeChild(__siblingElement);
      __siblingElement = null;
    }

    document.body.removeChild(__renderedElement);
    __renderedElement = null;

    __unRenderedElement = null;

    document.body.removeChild(__notDisplayedElement);
    __notDisplayedElement = null;

    if (__iframe) {
      document.body.removeChild(__iframe);
      __iframe = null;
    }
  });

  it("IsRendered", function() {
      assert.isTrue(qx.dom.Hierarchy.isRendered(__renderedElement));
      assert.isFalse(qx.dom.Hierarchy.isRendered(__unRenderedElement));
      assert.isTrue(qx.dom.Hierarchy.isRendered(__notDisplayedElement));
      assert.isTrue(qx.dom.Hierarchy.isRendered(__childOfNotDisplayedElement));
  });

  it("IsRenderedIframe", function(done) {
      __iframe = qx.bom.Iframe.create();
      var src = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/static/blank.html");
      src = qx.util.Uri.getAbsolute(src);
      qx.bom.Iframe.setSource(__iframe, src);
      document.body.appendChild(__iframe);

      qxWeb(__iframe).once("load", function(e) {
        setTimeout( function()  {
          assert.isTrue(qx.dom.Hierarchy.isRendered(__iframe));
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
      document.body.appendChild(__siblingElement);
      assert.isFalse(qx.dom.Hierarchy.contains(__renderedElement, __siblingElement));
  });

  it("GetCommonParent", function() {
      __siblingElement = qx.dom.Element.create("div");
      document.body.appendChild(__siblingElement);

      assert.equal(document.body,
      qx.dom.Hierarchy.getCommonParent(__renderedElement, __siblingElement));

      __childElement = qx.dom.Element.create("div");
      __renderedElement.appendChild(__childElement);
      assert.equal(__renderedElement,
      qx.dom.Hierarchy.getCommonParent(__renderedElement, __childElement));

  });
});
