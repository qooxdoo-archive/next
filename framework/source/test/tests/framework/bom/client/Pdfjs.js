/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

************************************************************************ */

/**
 * Test for PDF.js detection.
 *
 * You can enable/disable it via "about:config"
 * and "pdfjs.disabled" (true/false).
 */
describe("bom.client.Pdfjs", function () {
  it("is PDF.js available", function(done) {
    //this.require(["firefox"]);
    qx.core.Environment.getAsync("plugin.pdfjs", function(result) {
      setTimeout(function() {
        assert.equal(qx.core.Environment.get("browser.name") === "Firefox", result);
        done();
      }, 0);
    }, this);
  });
});
