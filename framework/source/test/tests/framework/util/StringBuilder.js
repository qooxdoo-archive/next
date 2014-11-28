/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */
describe("util.StringBuilder", function () {
  var __stringBuilder;

  beforeEach(function () {
    __stringBuilder = new qx.util.StringBuilder();
  });


  it("AddGet", function () {
    __stringBuilder.add("1");
    __stringBuilder.add("2");
    sinonSandbox.spy()("12", __stringBuilder.get());
    __stringBuilder.add("3");
    sinonSandbox.spy()("123", __stringBuilder.get());
  });


  it("Size", function () {
    __stringBuilder.add("123");
    sinonSandbox.spy()(3, __stringBuilder.size());
    __stringBuilder.add("4567");
    sinonSandbox.spy()(7, __stringBuilder.size());
  });


  it("EmptyClear", function () {
    assert.isTrue(__stringBuilder.isEmpty());
    __stringBuilder.add("123");
    assert.isFalse(__stringBuilder.isEmpty());
    __stringBuilder.clear();
    assert.isTrue(__stringBuilder.isEmpty());
  });

});

