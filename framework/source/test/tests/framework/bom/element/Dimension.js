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

describe("bom.element.Dimension", function ()
{
  beforeEach (function () 
  {
    __inlineElement = document.createElement("span");
    document.body.appendChild(__inlineElement);

    __inlineElementWithPadding = document.createElement("span");
    __inlineElementWithPadding.style.padding = "2px";
    document.body.appendChild(__inlineElementWithPadding);

    __blockElement = document.createElement("div");
    __blockElement.style.width = "200px";
    document.body.appendChild(__blockElement);

    __blockElementWithPadding = document.createElement("div");
    __blockElementWithPadding.style.padding = "2px";
    __blockElementWithPadding.style.width = "200px";
    document.body.appendChild(__blockElementWithPadding);
  });


  afterEach (function () 
  {
    document.body.removeChild(__inlineElement);
    __inlineElement = null;

    document.body.removeChild(__inlineElementWithPadding);
    __inlineElementWithPadding = null;

    document.body.removeChild(__blockElement);
    __blockElement = null;

    document.body.removeChild(__blockElementWithPadding);
    __blockElementWithPadding = null;
  });
 
  it("ContentWidthOfInlineElement", function() {
      assert.equal(0, qx.bom.element.Dimension.getContentWidth(__inlineElement));
  });
 
  it("ContentWidthOfInlineElementWithPadding", function() {
      assert.equal(0, qx.bom.element.Dimension.getContentWidth(__inlineElementWithPadding));
  });
 
  it("ContentWidthOfBlockElement", function() {
      assert.equal(200, qx.bom.element.Dimension.getContentWidth(__blockElement));
  });
 
  it("ContentWidthOfBlockElementWithPadding", function() {
      assert.equal(200, qx.bom.element.Dimension.getContentWidth(__blockElementWithPadding));
  });
 
  it("RoundingErrorInWidthAndHeightGetters", function() {
      // width = left - right = height = bottom - top = 38.416656494140625
      var mockElement1 =
      {
        getBoundingClientRect : function() {
          return {
            right: 91.58332824707031,
            left: 53.16667175292969,
            bottom: 91.58332824707031,
            top: 53.16667175292969
          };
        }
      };
      // exactly same width and height as mockElement1
      var mockElement2 =
      {
        getBoundingClientRect : function() {
          return {
            right: 91.58332824707031,
            left: 53.16667175292969,
            bottom: 91.58332824707031,
            top: 53.16667175292969
          };
        }
      };
      // make sure both mock objects have the same width
      assert.equal(mockElement1.getBoundingClientRect().right - mockElement1.getBoundingClientRect().left,
       mockElement2.getBoundingClientRect().right - mockElement2.getBoundingClientRect().left);
      // ... and the same height
      assert.equal(mockElement1.getBoundingClientRect().bottom - mockElement1.getBoundingClientRect().top,
       mockElement2.getBoundingClientRect().bottom - mockElement2.getBoundingClientRect().top);

      // the width and height calculation for both objects should return the same
      assert.equal(qx.bom.element.Dimension.getWidth(mockElement1), qx.bom.element.Dimension.getWidth(mockElement2));
      assert.equal(qx.bom.element.Dimension.getHeight(mockElement1), qx.bom.element.Dimension.getHeight(mockElement2));
    
  });
});