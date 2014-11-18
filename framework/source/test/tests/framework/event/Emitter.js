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

describe("event.Emitter", function () {

  var __eventEmitter;

  beforeEach(function () {
    __eventEmitter = new qx.event.Emitter();
  });


  it("OnOff", function () {
    var spy = sinon.spy();
    __eventEmitter.on("test", spy, this);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);
    sinon.assert.calledOn(spy, this);

    __eventEmitter.off("test", spy, this);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);
  });


  it("OnOffById", function () {
    var spy = sinon.spy();
    var id = __eventEmitter.on("test", spy, this);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);

    __eventEmitter.offById(id);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);
  });


  it("OffReturnId", function () {
    var spy = sinon.spy();
    __eventEmitter.on("test", spy, this);
    var id = __eventEmitter.on("test2", spy, this);

    var returnId = __eventEmitter.off("test2", spy, this);
    assert.equal(id, returnId);
  });


  it("OnTwoListeners", function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();

    __eventEmitter.on("test", spy1);
    __eventEmitter.on("test", spy2);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy1);
    sinon.assert.calledOnce(spy2);

    __eventEmitter.off("test", spy1);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy1);
    sinon.assert.calledTwice(spy2);
  });


  it("TwoEvents", function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();

    __eventEmitter.on("test1", spy1);
    __eventEmitter.on("test2", spy2);
    __eventEmitter.emit("test1");
    sinon.assert.calledOnce(spy1);
    sinon.assert.notCalled(spy2);

    __eventEmitter.emit("test2");
    sinon.assert.calledOnce(spy1);
    sinon.assert.calledOnce(spy2);
  });


  it("Once", function () {
    var spy = sinon.spy();

    __eventEmitter.once("test", spy);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);

    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);
  });


  it("OnAny", function () {
    var spy = sinon.spy();

    __eventEmitter.on("*", spy);
    __eventEmitter.emit("test");
    sinon.assert.calledOnce(spy);

    __eventEmitter.emit("test2");
    sinon.assert.calledTwice(spy);
  });


  it("EmitData", function () {
    var spy = sinon.spy();
    __eventEmitter.on("test", spy);
    __eventEmitter.emit("test", 123);
    sinon.assert.calledWith(spy, 123);
  });


  it("EmitOrder", function () {
    var i = 0;
    __eventEmitter.on("test", function () {
      i++;
      assert.equal(1, i);
    }, this);
    __eventEmitter.on("test", function () {
      i++;
      assert.equal(2, i);
    }, this);
    __eventEmitter.emit("test");
    assert.equal(2, i);
  });


  it("GetListenerId", function () {
    var id = __eventEmitter.on("test", function () {
    });
    assert.equal(id, __eventEmitter.getListenerId());

    id = __eventEmitter.on("test", function () {
    });
    assert.equal(id, __eventEmitter.getListenerId());
  });
});
