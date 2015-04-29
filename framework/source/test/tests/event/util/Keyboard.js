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
describe("event.util.Keyboard", function() {

  it("isValidKeyIdentifier", function() {
    var keys = [",", "A", "1", "3"];

    for (var i = 0; i < keys.length; i++) {
      var isValidKeyIdentifier = qx.event.util.Keyboard.isValidKeyIdentifier(keys[i]);
      assert.equal(true, isValidKeyIdentifier);
    }
  });


  it("isInvalidKeyIdentifier", function() {
    var keys = ["k", ":", "123", "abc", ""];

    for (var i = 0; i < keys.length; i++) {
      var isValidKeyIdentifier = qx.event.util.Keyboard.isValidKeyIdentifier(keys[i]);
      assert.equal(false, isValidKeyIdentifier);
    }
  });


  it("isPrintableKeyIdentifier", function() {
    var isPrintable = qx.event.util.Keyboard.isPrintableKeyIdentifier("Space");
    assert.isTrue(isPrintable);

    var isPrintable = qx.event.util.Keyboard.isPrintableKeyIdentifier("");
    assert.isTrue(isPrintable);
  });

});
