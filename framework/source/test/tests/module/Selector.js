 describe("module.Selector", function() {

   it("Id", function() {
     var test = q.create("<div id='testdiv'/>");
     test.appendTo(sandbox[0]);
     assert.equal(test[0], qxWeb("#testdiv")[0]);
     test.remove();
   });
 });
