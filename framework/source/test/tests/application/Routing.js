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

describe("application.Routing", function() {

  var __r = null;
  var __initialState = null;
  var fakeHistory = new qx.event.Emitter();

  beforeEach(function() {
    qx.log.appender.Native.SILENT = true;

    fakeHistory.state = "/";
    sinonSandbox.stub(qx.bom.History, "getInstance").returns(fakeHistory);
    __r = new qx.application.Routing();
  });


  afterEach(function() {
    qx.log.appender.Native.SILENT = false;

    qx.bom.History.getInstance.restore();
    __r.dispose();
  });


  it("Get", function() {
    var handler = sinonSandbox.spy();
    __r.onGet("/abc", handler);
    __r.executeGet("/abc");
    sinon.assert.calledOnce(handler);
  });


  it("Back", function() {
    var aHandler = sinonSandbox.spy();
    var bHandler = sinonSandbox.spy();
    __r.onGet("/a", aHandler);
    __r.onGet("/b", bHandler);
    __r.executeGet("/a");
    __r.executeGet("/b");
    __r.back();
    sinon.assert.calledTwice(aHandler);
    sinon.assert.calledOnce(bHandler);
  });

  /**
   * Tests the ability of app routing to detect and remove route cycles.
   * After A >> B >> C >> B >> routing.back(), the routing should display A and not C.
   */

  it("BackCycle", function() {
    var aHandler = sinonSandbox.spy();
    var bHandler = sinonSandbox.spy();
    var cHandler = sinonSandbox.spy();
    __r.onGet("/a", aHandler);
    __r.onGet("/b", bHandler);
    __r.onGet("/c", cHandler);
    __r.executeGet("/a");
    __r.executeGet("/b");
    __r.executeGet("/c");
    __r.executeGet("/b");
    __r.back();
    sinon.assert.calledTwice(aHandler);
    sinon.assert.calledTwice(bHandler);
    sinon.assert.calledOnce(cHandler);
  });


  it("GetCustomData", function() {
    var handler = sinonSandbox.spy();
    __r.onGet("/abc", handler);
    __r.executeGet("/abc", {
      a: true
    });
    sinon.assert.calledOnce(handler);
    assert.isTrue(handler.args[0][0].customData.a);
  });


  it("GetCustomDataTwoInstances", function() {
    var r2 = new qx.application.Routing();
    var handler = sinonSandbox.spy();
    __r.onGet("/abc", handler);
    r2.executeGet("/abc", {
      a: true
    });
    fakeHistory.emit("changeState", {value: "/abc"})

    sinon.assert.calledOnce(handler);
    assert.isTrue(handler.args[0][0].customData.a);
    r2.dispose();
  });


  it("On", function() {
    var handler = sinonSandbox.spy();
    __r.on("/", handler);
    __r.execute("/");
    sinon.assert.calledOnce(handler);
  });


  it("Post", function() {
    var handler = sinonSandbox.spy();
    __r.onPost("/abc", handler);
    __r.executePost("/abc");
    sinon.assert.calledOnce(handler);
  });


  it("PostParam", function() {
    var handler = sinonSandbox.spy();
    var data = {
      data: "test"
    };
    __r.onPost("/{id}/affe", handler);
    __r.executePost("/123456/affe", data, "custom data");
    sinon.assert.calledOnce(handler);
    sinon.assert.calledWith(handler, {
      customData: "custom data",
      params: {
        id: "123456",
        data: "test"
      },
      path: "/123456/affe"
    });
  });


  it("Delete", function() {
    var handler = sinonSandbox.spy();
    __r.onDelete("/abc", handler);
    __r.executeDelete("/abc");
    sinon.assert.calledOnce(handler);
  });


  it("Put", function() {
    var handler = sinonSandbox.spy();
    __r.onPut("/abc", handler);
    __r.executePut("/abc");
    sinon.assert.calledOnce(handler);
  });


  it("Any", function() {
    var handler = sinonSandbox.spy();
    __r.onAny("/abc", handler);
    __r.executePost("/abc");
    __r.executeDelete("/abc");
    sinon.assert.calledTwice(handler);
  });


  it("Init", function() {
    var handler = sinonSandbox.spy();
    var defaultHandler = sinonSandbox.spy();

    __r.dispose();
    __r = new qx.application.Routing();

    __r.onGet("/a/b/c", handler);
    sinon.assert.notCalled(handler);
    __r.onGet("/", defaultHandler);
    sinon.assert.notCalled(defaultHandler);

    __r.init();
    sinon.assert.notCalled(handler);
    sinon.assert.calledOnce(defaultHandler);

    fakeHistory.emit("changeState", {value: "/a/b/c"});
    sinon.assert.calledOnce(handler);
  });


  it("GetPathOrFallback", function() {
    __r.on("/registered", function() {});

    assert.equal("/", __r._getPathOrFallback(""));
    assert.equal("/", __r._getPathOrFallback(null));
    assert.equal("/", __r._getPathOrFallback("/not/registered"));
    assert.equal("/given/default", __r._getPathOrFallback("use_default_instead_of_this", "/given/default"));
    assert.equal("/registered", __r._getPathOrFallback("/registered"));
  });
});
