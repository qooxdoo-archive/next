/* ************************************************************************

 qooxdoo - the new era of web development

 http://qooxdoo.org

 Copyright:
 2007-20014 1&1 Internet AG, Germany, http://www.1und1.de

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Tobias Oberrauch <tobias.oberrauch@1und1.de>

 ************************************************************************
 */
describe("qx.test.event.util.Keyboard", function () {
  it("testCommaAsValidKeyIdentifier", function () {
    var isValidKeyIdentifier = qx.event.util.Keyboard.isValidKeyIdentifier(',');

    assert.equal(true, isValidKeyIdentifier);
  });
});