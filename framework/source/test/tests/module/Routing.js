describe("module.Routing", function() {

   it("init", function() {
     var routing = qxWeb.getRouting();
     assert.equal("qx.application.Routing", routing.classname);
     assert.equal(routing, qxWeb.getRouting());
     routing.dispose();
     assert.notEqual(routing, qxWeb.getRouting());
   });
 });
