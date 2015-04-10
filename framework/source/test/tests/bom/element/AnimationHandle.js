/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

describe("bom.element.AnimationHandle", function() {

  beforeEach(function() {
    __keys = qx.core.Environment.get("css.animation");
    if (__keys === null) {
      // skip the test
      this.test.skipped = true;
      return;
    }
  });


  it("Stop of CSS animation", function(done) {
    var el = qx.dom.Element.create("div");
    var handle = qx.bom.element.Animation.animate(el, {
      "duration": 100,
      "keyFrames": {
        0: {
          "opacity": 1
        },
        100: {
          "opacity": 0
        }
      },
      "delay": 200
    });
    var spy = sinonSandbox.spy(qx.bom.element.AnimationJs, "stop");
    handle.on("start", spy);
    handle.stop();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      done();
    }, 500);
  });


  it("IsEnded", function(done) {
    var el = qx.dom.Element.create("div");
    var handle = qx.bom.element.Animation.animate(el, {
      "duration": 100,
      "keyFrames": {
        0: {
          "opacity": 1
        },
        100: {
          "opacity": 0
        }
      },
      "delay": 200
    });
    var spy = sinonSandbox.spy(qx.bom.element.AnimationJs, "stop");
    handle.on("start", spy);
    handle.stop();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      assert.isTrue(handle.isEnded());
      done();
    }, 500);
  });


  it("IsPaused", function(done) {
    var el = qx.dom.Element.create("div");
    var handle = qx.bom.element.Animation.animate(el, {
      "duration": 100,
      "keyFrames": {
        0: {
          "opacity": 1
        },
        100: {
          "opacity": 0
        }
      },
      "delay": 200
    });
    var spy = sinonSandbox.spy(qx.bom.element.AnimationJs, "pause");
    handle.on("start", spy);
    handle.pause();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      assert.isTrue(handle.isPaused());
      done();
    }, 500);
  });


  it("IsPlaying", function(done) {
    var el = qx.dom.Element.create("div");
    var handle = qx.bom.element.Animation.animate(el, {
      "duration": 100,
      "keyFrames": {
        0: {
          "opacity": 1
        },
        100: {
          "opacity": 0
        }
      },
      "delay": 200
    });
    var spy = sinonSandbox.spy(qx.bom.element.AnimationJs, "play");
    handle.on("start", spy);
    handle.play();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      assert.isTrue(handle.isPlaying());
      done();
    }, 500);
  });
});
