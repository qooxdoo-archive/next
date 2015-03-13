/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

describe("core.Environment", function ()
{

    // /////////////////////////////////
    // TESTS FOR THE ENVIRONMENT CLASS
    // ////////////////////////////// //

  it("Get", function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      assert.equal("affe", qx.core.Environment.get("affe"));
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("GetAsync", function(done) {
      // fake the check
      qx.core.Environment.getAsyncChecks()["affe"] = function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "affe");
        }, 0);
      };

      qx.core.Environment.getAsync("affe", function(result) {
        setTimeout(function() {
          assert.equal("affe", result);
          // clear the fake check
          delete qx.core.Environment.getAsyncChecks()["affe"];
          qx.core.Environment.invalidateCacheKey("affe");
          done();
        }, 0);
      }, this);

  });


  it("Select", function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      var test;
      test = qx.core.Environment.select("affe", {
        "affe" : "affe"
      });

      assert.equal(test, "affe");
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("SelectDefault", function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      var test;
      test = qx.core.Environment.select("affe", {
        "default" : "affe"
      });

      assert.equal(test, "affe");
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("SelectAsync", function(done) {
      // fake the check
      qx.core.Environment.addAsync("affe", function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "AFFE");
        }, 0);
      });


      qx.core.Environment.selectAsync("affe", {
        "affe" : function(result) {
          setTimeout(function() {
            // clear the fake check
            delete qx.core.Environment.getChecks()["affe"];
            qx.core.Environment.invalidateCacheKey("affe");
            assert.equal("AFFE", result);
            done();
          }, 0);
        }
      }, this);

  });


  it("Cache", function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      assert.equal("affe", qx.core.Environment.get("affe"));
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];

      assert.equal("affe", qx.core.Environment.get("affe"));

      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("CacheInvalidation", function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      assert.equal("affe", qx.core.Environment.get("affe"));

      qx.core.Environment.invalidateCacheKey("affe");

      // fake another check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe2";
      };
      assert.equal("affe2", qx.core.Environment.get("affe"));

      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("AddFunction", function() {
      qx.core.Environment.add("affe", function() {
        return "AFFE";
      });

      assert.equal("AFFE", qx.core.Environment.get("affe"));

      // clear the check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("AddValue", function() {
      qx.core.Environment.add("affe", "AFFE");

      assert.equal("AFFE", qx.core.Environment.get("affe"));

      // clear the check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
  });


  it("AddAsyncFunction", function(done) {
      qx.core.Environment.addAsync("affe", function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "AFFE");
        }, 0);
      });

      qx.core.Environment.getAsync("affe", function(result) {
        setTimeout(function() {
          assert.equal("AFFE", result);
          // clear the fake check
          delete qx.core.Environment.getAsyncChecks()["affe"];
          qx.core.Environment.invalidateCacheKey("affe");
          done();
        }, 0);
      }, this);

  });


  it("Filter", function() {
      // fake the checks
      qx.core.Environment.getChecks()["affe1"] = function() {
        return true;
      };
      qx.core.Environment.getChecks()["affe2"] = function() {
        return false;
      };
      qx.core.Environment.getChecks()["affe3"] = function() {
        return true;
      };

      var array = qx.core.Environment.filter({
        "affe1" : 1,
        "affe2" : 2,
        "affe3" : 3
      });

      assert.equal(2, array.length);
      assert.equal(1, array[0]);
      assert.equal(3, array[1]);

      // clear the fake check
      delete qx.core.Environment.getChecks()["affe1"];
      delete qx.core.Environment.getChecks()["affe2"];
      delete qx.core.Environment.getChecks()["affe3"];
      qx.core.Environment.invalidateCacheKey("affe1");
      qx.core.Environment.invalidateCacheKey("affe2");
      qx.core.Environment.invalidateCacheKey("affe3");
  });

    // //////////////////////////////
    // TESTS FOR THE CHECKS
    // //////////////////////////////

  it("EngineName", function() {
      assert.notEqual("", qx.core.Environment.get("engine.name"));
  });


  it("EngineVersion", function() {
      assert.notEqual("", qx.core.Environment.get("engine.version"));
  });


  it("Browser", function() {
      assert.notEqual("", qx.core.Environment.get("browser.name"));
      assert.notEqual("", qx.core.Environment.get("browser.version"));

      qx.core.Environment.get("browser.documentmode");
  });


  it("Locale", function() {
      assert.notEqual("", qx.core.Environment.get("locale"));
  });


  it("Variant", function() {
      // just make sure the call is working
      qx.core.Environment.get("locale.variant");
  });


  it("OS", function() {
      // just make sure the call is working
      assert.isString(qx.core.Environment.get("os.name"));
      assert.isString(qx.core.Environment.get("os.version"));
  });


  it("Quicktime", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.quicktime"));
      qx.core.Environment.get("plugin.quicktime.version");
  });


  it("Skype", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.skype"));
  });


  it("Wmv", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.windowsmedia"));
      qx.core.Environment.get("plugin.windowsmedia.version");
  });


  it("Divx", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.divx"));
      qx.core.Environment.get("plugin.divx.version");
  });


  it("Silverlight", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.silverlight"));
      qx.core.Environment.get("plugin.silverlight.version");
  });


  it("Pdf", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("plugin.pdf"));
      qx.core.Environment.get("plugin.pdf.version");
  });


  it("IO", function() {
      // just make sure the call is working
      qx.core.Environment.get("io.maxrequests");
      assert.isBoolean(qx.core.Environment.get("io.ssl"));
  });


  it("Html", function() {
      // just make sure the call is working
      assert.isBoolean(qx.core.Environment.get("html.webworker"));
      assert.isBoolean(qx.core.Environment.get("html.geolocation"));
      assert.isBoolean(qx.core.Environment.get("html.audio"));

      assert.isString(qx.core.Environment.get("html.audio.ogg"));
      assert.isString(qx.core.Environment.get("html.audio.mp3"));
      assert.isString(qx.core.Environment.get("html.audio.wav"));
      assert.isString(qx.core.Environment.get("html.audio.aif"));
      assert.isString(qx.core.Environment.get("html.audio.au"));

      assert.isBoolean(qx.core.Environment.get("html.video"));
      assert.isString(qx.core.Environment.get("html.video.ogg"));
      assert.isString(qx.core.Environment.get("html.video.h264"));
      assert.isString(qx.core.Environment.get("html.video.webm"));
      assert.isBoolean(qx.core.Environment.get("html.classlist"));
      assert.isBoolean(qx.core.Environment.get("html.xpath"));
      assert.isBoolean(qx.core.Environment.get("html.vml"));

      assert.isBoolean(qx.core.Environment.get("html.stylesheet.createstylesheet"));
      assert.isBoolean(qx.core.Environment.get("html.stylesheet.addimport"));
      assert.isBoolean(qx.core.Environment.get("html.stylesheet.removeimport"));

      assert.isBoolean(qx.core.Environment.get("html.history.state"));
  });


  it("ActiveX", function() {
      assert.isBoolean(qx.core.Environment.get("plugin.activex"));
  });


  it("Css", function() {
      assert.isBoolean(qx.core.Environment.get("css.placeholder"));
      var borderImage = qx.core.Environment.get("css.borderimage");
      assert(typeof borderImage == "string" || borderImage === null);
      var borderImageSyntax = qx.core.Environment.get("css.borderimage.standardsyntax");
      assert(typeof borderImageSyntax == "boolean" || borderImageSyntax === null);
      var userSelect = qx.core.Environment.get("css.userselect");
      assert(typeof userSelect == "string" || userSelect === null);
      var userSelectNone = qx.core.Environment.get("css.userselect.none");
      assert(typeof userSelectNone == "string" || userSelectNone === null);
      var userModify = qx.core.Environment.get("css.usermodify");
      assert(typeof userModify == "string" || userModify === null);
      var appearance = qx.core.Environment.get("css.appearance");
      assert(typeof appearance == "string" || appearance === null);
      var linearGradient = qx.core.Environment.get("css.gradient.linear");
      assert(typeof linearGradient == "string" || linearGradient === null);
      assert.isBoolean(qx.core.Environment.get("css.gradient.filter"));
      var radialGradient = qx.core.Environment.get("css.gradient.radial");
      assert(typeof radialGradient == "string" || radialGradient === null);
      assert.isBoolean(qx.core.Environment.get("css.gradient.legacywebkit"));
      assert.isBoolean(qx.core.Environment.get("css.pointerevents"));
  });


  it("PhoneGap", function() {
      assert.isBoolean(qx.core.Environment.get("phonegap"));
      assert.isBoolean(qx.core.Environment.get("phonegap.notification"));
  });


  it("Event", function() {
      assert.isBoolean(qx.core.Environment.get("event.touch"));
      assert.isBoolean(qx.core.Environment.get("event.help"));
      assert.isBoolean(qx.core.Environment.get("event.customevent"));
      assert.isBoolean(qx.core.Environment.get("event.mouseevent"));
  });


  it("EcmaScript", function() {
      var stackTrace = qx.core.Environment.get("ecmascript.error.stacktrace");
      assert(typeof stackTrace == "string" || stackTrace === null);
  });


  it("Device", function() {
      assert.isString(qx.core.Environment.get("device.name"));
  });


  it("DeviceType", function() {
      assert.isString(qx.core.Environment.get("device.type"));
  });


  it("DevicePixelRatio", function() {
      assert.isNumber(qx.core.Environment.get("device.pixelRatio"));
  });


  it("Qx", function() {
      assert.isBoolean(qx.core.Environment.get("qx.allowUrlSettings"), "1");
      assert.isBoolean(qx.core.Environment.get("qx.allowUrlVariants"), "2");
      assert.isBoolean(qx.core.Environment.get("qx.nativeScrollBars"), "9");
      assert.isNumber(qx.core.Environment.get("qx.debug.property.level"), "10");
      assert.isBoolean(qx.core.Environment.get("qx.debug"), "11");
      assert.isBoolean(qx.core.Environment.get("qx.mobile.nativescroll"), "15");
  });


  it("AnimationTransformTransition", function() {
      // smoke test... make sure the method is doing something
      qx.core.Environment.get("css.animation");
      qx.core.Environment.get("css.transform");
      qx.core.Environment.get("css.transition");

      // 3d transform support
      assert.isBoolean(qx.core.Environment.get("css.transform.3d"));
  });
});
