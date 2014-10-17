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

describe("bom.History", function (){


  var __history = null;


  function hasNoIe ()
  {
    return qx.core.Environment.get("engine.name") !== "mshtml";
  }


  beforeEach (function ()
  {
    __history = qx.bom.History.getInstance();
});

  it("Instance", function() {
      var runsInIframe = !(window == window.top);
      if (!$$instance)
      {
        // in iframe + IE9
        if (runsInIframe
          && qx.core.Environment.get("browser.documentmode") == 9
        ) {
          assert.instanceOf(__history, qx.bom.HashHistory);
        }

        // browser with hashChange event
        else {
          assert.instanceOf(__history, qx.bom.NativeHistory);
        }
      }
  });

  it("AddState", function(done) {
      __history.addToHistory("foo", "Title Foo");

      setTimeout(function() {
          __checkState();
          done();
      }, 200);
  });

  it("NavigateBack", function(done) {
      __history.addToHistory("foo", "Title Foo");
      setTimeout(function() {
          __checkFooAndSetBar();
          done();
      }, 200);

    });


    function __checkFooAndSetBar (done)
    {

      assert.equal("foo", __history._readState(), "check1");
      __history.addToHistory("bar", "Title Bar");
     setTimeout(function() {
          __checkBarAndGoBack();
          done();
      }, 200);
    }


    function __checkBarAndGoBack (done)
    {

      assert.equal("bar", __history._readState(), "check2");
      history.back();
      setTimeout(function() {

          __checkState();
          done();
      }, 200);
    }


    function __checkState ()
    {
      assert.equal("foo", __history._readState(), "check3");
      assert.equal("Title Foo", __history.title);
    }

  it("NavigateBackAfterSetState", function(done) {
      __history.state = "affe";
      window.setTimeout(function() {
          __setState_checkAffeAndSetFoo();
          done();
      }, 200);
  });


  function __setState_checkAffeAndSetFoo (done)
  {

    assert.equal("affe", __history._readState(), "check0");
    __history.state = "foo";
    setTimeout(function() {
        __setState_checkFooAndSetBar();
        done();
    }, 200);
  }


  function __setState_checkFooAndSetBar (done)
  {

    assert.equal("foo", __history._readState(), "check1");
    __history.state = "bar";
    setTimeout(function() {
        __setState_checkBarAndGoBack();
        done();
    }, 300);
  }


  function __setState_checkBarAndGoBack (done)
  {

    assert.equal("bar", __history._readState(), "check2");
    history.back();
    setTimeout(function() {
        assert.equal("foo", __history._readState(), "check3");
        done();
    }, 200);
  }

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

      window.setTimeout(function() {
        __history.addToHistory("baz");
      }, 250);


  });
});
