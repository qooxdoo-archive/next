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
     * Daniel Wagner (danielwagner)
     * Mustafa Sak (msak)

************************************************************************ */

describe("bom.History", function() {

  var __history = null;

  beforeEach(function() {
    __history = qx.bom.History.getInstance();
    if (__history._writeState.restore) {
      __history._writeState.restore();
    }
    sinonSandbox.spy(__history, "_writeState");
  });


  it("Instance", function() {
    var runsInIframe = !(window == window.top);
    // in iframe + IE9
    if (runsInIframe && qx.core.Environment.get("browser.documentmode") == 9) {
      assert.instanceOf(__history, qx.bom.HashHistory);
    }

    // browser with hashChange event
    else {
      assert.instanceOf(__history, qx.bom.NativeHistory);
    }
  });


  it("AddState", function() {
    __history.addToHistory("foo");
    sinon.assert.calledOnce(__history._writeState);
  });


  it("RequestEvent", function(done) {
    // "request" event just will be fired, if a user goes back or farward in
    // the history
    __history.once("request", function() {
      setTimeout(function() {
        // "request" event has been fired
        assert.isTrue(true);
        done();
      }, 0);
    }, this);

    __history.state = "bar";
    history.back();
  });


  it("RequestEventAddHistory", function(done) {
    __history.once("request", function(state) {
      setTimeout(function() {
        assert.equal("baz", state);
        done();
      }, 500);
    }, this);

    setTimeout(function() {
      __history.addToHistory("baz");
    }, 250);
  });
});
