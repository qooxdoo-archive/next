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
     * Tristan Koch (tristankoch)

************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 *
 * @asset(framwork/source/resource/qx/test/primitive.json)
 */

describe("data.store.RestWithRemote", function() {


             //qx.test.io.MRemoteTest],

    beforeEach (function () {
      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/primitive.json");
          res = res = new qx.io.rest.Resource({index: {method: "GET", url: url} });
          store = store = new qx.data.store.Rest(res, "index");

      res.configureRequest(function(req) {
        req.setParser(qx.util.ResponseParser.PARSER.json);
      });

     // require(["http"]);
    });

    afterEach (function() {
      res.dispose();
      store.dispose();
    });

    
 
 it("populate store with response of resource action", function(done) {

      res.on("success", function() {
        setTimeout(function() {
          assert.equal("String", store.model.string);
          done();
        }, 0);
      }, this);

      res.index();
    });

    
 
 it("bind model property", function(done) {

          label = new qx.ui.mobile.basic.Label();

      res.on("success", function() {
        setTimeout(function () {
          assert.equal("String", label.value);
          done();
        },0);
      }, this);

      qx.data.SingleValueBinding.bind(store, "model.string", label, "value");
      res.index();

    });

    // skip: function(msg) {
    //   throw new qx.dev.unit.RequirementError(null, msg);
    // }  
});