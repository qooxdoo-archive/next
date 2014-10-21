/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Adrian Olaru (adrianolaru)

************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 *
 * @asset(qx/test/webworker.js)
 */

describe("bom.WebWorker", function() {

  var _url = null;
  var _worker = null;
  var _send = null;

  /*
   * Firefox 8+ throws an exception ("Could not get domain") when trying
   * to create a worker using a source URI that doesn't contain a TLD, e.g.
   * "localhost" or an IP address.
   *
   * http://bugzilla.qooxdoo.org/show_bug.cgi?id=5565
   * https://bugzilla.mozilla.org/show_bug.cgi?id=683280
   */
  function _isBuggyGecko() {
    return qx.core.Environment.get("engine.name") === "gecko" &&
      parseInt(qx.core.Environment.get("engine.version"), 10) >= 8 &&
      parseInt(qx.core.Environment.get("engine.version"), 10) < 9;
  }


  beforeEach(function() {
    _url = qx.util.ResourceManager.getInstance().toUri("../resource/qx/test/webworker.js");

    if (_isBuggyGecko()) {
      throw new qx.dev.unit.RequirementError("foo", "Test skipped due to Firefox bug #683280");
    }

    _worker = new qx.bom.WebWorker(_url);

    _send = function(message, fn) {
      _worker.on("message", function(data) {
        assertType(data, typeof message);
        fn.call(this, message, e);
      }, this);
      _worker.postMessage(message);
    };
  });


  afterEach(function() {
    _worker.dispose();
    _worker = null;
    _send = null;
    _url = null;
  });


  it("Constructor", function() {
    assert.instanceOf(_worker, qx.bom.WebWorker);
  });


  it("MessageEvent", function() {
    _send("message", function(mess, message) {
      assert.strictEqual(mess, message);
    });
  });


  it("ErrorEvent", function() {
    var message = "error";

    _worker.on("error", function(message) {
      assert.isTrue(/error/.test(message));
    }, this);
    _worker.postMessage(message);
  });


  it("PostMessageWithNumber", function() {
    _send(1, function(mess, message) {
      assert.strictEqual(mess, message);
    });
  });


  it("PostMessageWithBoolean", function() {
    _send(true, function(mess, message) {
      assert.strictEqual(mess, message);
    });
  });


  it("PostMessageWithNull", function() {
    _send(null, function(mess, message) {
      assert.strictEqual(mess, message);
    });
  });


  it("PostMessageWithObject", function() {
    //_send({a:"1", b:2, c:3});
    _send({
      a: "1",
      b: 2,
      c: true
    }, function(mess, message) {
      assert.strictEqual(mess.a, message.a);
      assert.strictEqual(mess.b, message.b);
      assert.strictEqual(mess.c, message.c);
    });
  });


  it("PostMessageWithArray", function() {
    //_send(["1", 2, true]);
    _send(["1", 2, true], function(mess, message) {
      assert.strictEqual(mess[0], message[0]);
      assert.strictEqual(mess[1], message[1]);
      assert.strictEqual(mess[2], message[2]);
    });
  });
});
