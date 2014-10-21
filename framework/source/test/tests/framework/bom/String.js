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
     * Jonathan Weiß (jonathan_rass)

************************************************************************ */

describe("bom.String", function() {

  it("ToText_Break", function() {
    assert.equal(qx.bom.String.toText("<br>"), "\n");
    assert.equal(qx.bom.String.toText("<br />"), "\n");
  });


  it("ToText_Advanced", function() {
    assert.equal(qx.bom.String.toText("<div style='padding:5px;'>"), "");
    assert.equal(qx.bom.String.toText("<div style='padding:5px;'>foo</div></div>"), "foo");

    assert.equal(qx.bom.String.toText("<div style='padding:5px;'> "), " ");
    assert.equal(qx.bom.String.toText("<div style='padding:5px;'> foo </div></div>"), " foo ");
  });


});
