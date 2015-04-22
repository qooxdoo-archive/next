/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */
describe("core.Wrapper", function () {

  it("main", function () {
    var spyMethod = sinonSandbox.spy();
    
    var wrapper = new qx.core.Wrapper({
      foo: "bar",
      key: "value",
      fn: spyMethod
    });
    assert.equal("value", wrapper.key);
    wrapper.key = "value 2";
    assert.equal("value 2", wrapper.key);

    wrapper.fn();
    
    sinon.assert.calledOnce(spyMethod);
  });  
});