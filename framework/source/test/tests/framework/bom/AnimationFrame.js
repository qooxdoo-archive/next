/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */


describe("bom.AnimationFrame", function ()
{

  beforeEach (function () {
     this.__frame = new qx.bom.AnimationFrame();
  });

  it("Start", function(done) {
    var clb = sinon.spy();
    this.__frame.once("frame", clb);
    this.__frame.startSequence(300);
    setTimeout(function() {
      sinon.assert.calledOnce(clb);
      assert.isTrue(clb.args[0][0] >= 0);
      done();
    }, 300);
  });

  it("Cancel", function(done) {
    var clb = sinon.spy();
    this.__frame.once("frame", clb);
    this.__frame.startSequence(300);
    this.__frame.cancelSequence();
    setTimeout(function() {
      sinon.assert.notCalled(clb);
      done();
    }, 500);
  });
});