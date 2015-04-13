/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (d_wagner)

************************************************************************ */

describe("bom.Viewport", function ()
{

  it("GetScrollLeft", function() {
    var value = qx.bom.Viewport.getScrollLeft();
    assert.isNumber(value);
    assert.isTrue(value >= 0);
  });


  it("GetScrollTop", function() {
    var value = qx.bom.Viewport.getScrollTop();
    assert.isNumber(value);
    assert.isTrue(value >= 0);
  });
});