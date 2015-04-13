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
describe("bom.element.AnimationJs", function ()
{

  it("Stop", function(done) {
    var el = document.createElement("div");
    var handle = qx.bom.element.AnimationJs.animate(el, {
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
    var spy = sinonSandbox.spy();
    handle.on("start", spy);
    handle.stop();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      done();
    }, 300);
  });


  it("animate properties which are CSS properties and element attributes", function(done) {
    var el = document.createElement("div");
    qx.bom.element.Style.setStyles(el, { width: "200px", height: "200px",
    backgroundColor: "red" });

    document.body.appendChild(el);
    // force re-rendering (fixes Chrome bug)
    el.offsetWidth;

    var handle = qx.bom.element.Animation.animate(el, {
      "duration": 30,
      "keyFrames": {
        0: {
          "width": "200px",
          "height": "200px"
        },
        100: {
          "width": "400px",
          "height": "400px"
        }
      },
      "keep": 100
    });

    handle.on("end", function() {
      assert.equal("400px", qx.bom.element.Style.get(el, "width"), "width");
      assert.equal("400px", qx.bom.element.Style.get(el, "height"), "height");
      document.body.removeChild(el);
      done();
    });
  });

});
