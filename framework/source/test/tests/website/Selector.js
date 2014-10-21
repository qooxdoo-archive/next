 describe('Selector', function() {

   beforeEach(function() {
     globalSetup();
   });


   afterEach(function() {
     globalTeardown();
   });


   it("Id", function() {
     var test = q.create("<div id='testdiv'/>");
     test.appendTo(sandbox[0]);
     assert.equal(test[0], q("#testdiv")[0]);
     test.remove();
   });
 });
