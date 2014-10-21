/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-20011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

describe("toolchain.PrivateOptimization", function() {
  /*
   * The next test tests whether privates are renamed at all.
   */

  it("PrivatesRenaming", function() {
    // Can only fail in build version with all optimizations
    assert.equal("__te" + "st a", __test(), "Variable in a string renamed!");
    assert.equal("__te" + "st a test", __test() + " test", "Variable in a string renamed!");
  });
  // needed for testPrivatesRenaming
  function __test() {
    return "__test a";
  }
});
