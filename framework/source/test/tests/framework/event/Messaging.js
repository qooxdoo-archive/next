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

describe("event.Messaging", function () {

  var __messaging;

  beforeEach(function () {
    __messaging = new qx.event.Messaging();
  });

  it("TwoChannels", function () {
    var handlerGet = sinonSandbox.spy();
    var handlerPost = sinonSandbox.spy();
    var ctx = {a: 12};
    var data = {data: "test"};
    __messaging.on("GET", "/get", handlerGet, ctx);
    __messaging.emit("GET", "/get", null, data);
    sinon.assert.calledOnce(handlerGet);
    sinon.assert.calledOn(handlerGet, ctx);
    sinon.assert.calledWith(handlerGet, {customData: data, params: {}, path: "/get"});
    sinon.assert.notCalled(handlerPost);

    __messaging.on("POST", "/post", handlerPost, ctx);
    __messaging.emit("POST", "/post", null, data);
    sinon.assert.calledOnce(handlerPost);
    sinon.assert.calledOn(handlerPost, ctx);
    sinon.assert.calledWith(handlerPost, {customData: data, params: {}, path: "/post"});
    sinon.assert.calledOnce(handlerGet);
  });


  it("Get", function () {
    var handler = sinonSandbox.spy();
    var ctx = {a: 12};
    var data = {data: "test"};
    __messaging.on("get", "/", handler, ctx);
    __messaging.emit("get", "/", null, data);
    sinon.assert.calledOnce(handler);
    sinon.assert.calledOn(handler, ctx);
    sinon.assert.calledWith(handler, {customData: data, params: {}, path: "/"});
  });


  it("RegExp", function () {
    var handler = sinonSandbox.spy();
    var ctx = {a: 12};
    var data = {data: "abcdef"};
    __messaging.on("xyz", /^xyz/g, handler, ctx);
    __messaging.emit("xyz", "xyzabc", null, data);
    __messaging.emit("xyz", "abcxyz", null, data);
    sinon.assert.calledOnce(handler);
    sinon.assert.calledOn(handler, ctx);
    sinon.assert.calledWith(handler, {customData: data, params: {}, path: "xyzabc"});
  });


  it("GetAll", function () {
    var handler = sinonSandbox.spy();
    __messaging.on("a", /.*/, handler);
    __messaging.emit("a", "xyzabc");
    __messaging.emit("a", "abcxyz");
    sinon.assert.calledTwice(handler);
  });


  it("Any", function () {
    var handler = sinonSandbox.spy();
    __messaging.onAny(/.*/, handler);
    __messaging.emit("a", "xyzabc");
    __messaging.emit("b", "abcxyz");
    sinon.assert.calledTwice(handler);
  });


  it("Twice", function () {
    var handler = sinonSandbox.spy();
    var ctx = {a: 12};
    var data = {data: "test"};
    __messaging.on("GET", "/", handler, ctx);
    __messaging.emit("GET", "/", null, data);
    __messaging.emit("GET", "/", null, data);
    sinon.assert.calledTwice(handler);
    sinon.assert.calledOn(handler, ctx);
    sinon.assert.calledWith(handler, {customData: data, params: {}, path: "/"});
  });


  it("Param", function () {
    var handler = sinonSandbox.spy();
    var ctx = {a: 12};
    var data = {data: "test"};
    __messaging.on("POST", "/{id}/affe", handler, ctx);
    __messaging.emit("POST", "/123456/affe", data);
    sinon.assert.calledOnce(handler);
    sinon.assert.calledOn(handler, ctx);
    sinon.assert.calledWith(handler,
      {customData: undefined, params: {id: "123456", data: "test"}, path: "/123456/affe"}
    );
  });


  it("MultipleParam", function () {
    var handler = sinonSandbox.spy();
    var data = {data: "test"};
    __messaging.on("POST", "/{id}-{name}/affe", handler);
    __messaging.emit("POST", "/123456-xyz/affe", data);
    sinon.assert.calledOnce(handler);
    sinon.assert.calledWith(handler,
      {customData: undefined, params: {id: "123456", name: "xyz", data: "test"}, path: "/123456-xyz/affe"}
    );
  });


  it("Remove", function () {
    var handler = sinonSandbox.spy();
    var id = __messaging.on("GET", "/", handler);
    __messaging.emit("GET", "/");
    sinon.assert.calledOnce(handler);

    __messaging.remove(id);
    __messaging.emit("GET", "/");
    sinon.assert.calledOnce(handler);
  });


  it("Has", function () {
    __messaging.on("GET", "/affe", function () {
    });
    __messaging.on("POST", "/affe", function () {
    });

    assert.isTrue(__messaging.has("GET", "/affe"));
    assert.isTrue(__messaging.has("POST", "/affe"));

    assert.isFalse(__messaging.has("get", "/affe"));
    assert.isFalse(__messaging.has("GET", "/banane"));
    assert.isFalse(__messaging.has("PUT", "/affe"));
    assert.isFalse(__messaging.has("banane", "/affe"));
  });

});