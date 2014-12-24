/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This class demonstrates how to define unit tests for your application.
 *
 * Execute <code>generate.py test</code> to generate a testrunner application
 * and open it from <tt>test/index.html</tt>
 *
 * The methods that contain the tests are instance methods with a
 * <code>test</code> prefix. You can create an arbitrary number of test
 * classes like this one. They can be organized in a regular class hierarchy,
 * i.e. using deeper namespaces and a corresponding file structure within the
 * <tt>test</tt> folder.
 */
assert = require('chai').assert;

describe("${Namespace}.test.DemoTest", function() {

  /*
  ---------------------------------------------------------------------------
    TESTS
  ---------------------------------------------------------------------------
  */

  /**
   * Here are some simple tests
   */
  it("Simple", function() {
    assert.equal(4, 3 + 1, "This should never fail!");
    assert.isFalse(false, "Can false be true?!");
  });




  /**
   * Here are some more advanced tests
   */
  it("Advanced", function() {
    var a = 3;
    var b = a;
    assert.strictEqual(a, b, "A rose by any other name is still a rose");
    assert.isTrue(1 < b < 10, "You must be kidding, 3 can never be outside [1,10]!");
  });

});
