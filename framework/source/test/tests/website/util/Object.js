 describe('ObjectUtil', function() {

   beforeEach(function() {
     globalSetup();
   });


   afterEach(function() {
     globalTeardown();
   });


   it("ObjectMerge", function() {

     var target = {
       name: 'vanillebaer',
       test: {
         foo: 'bar'
       }
     };

     var source = {
       surname: 'flachzange',
       test: {
         bar: 'baz'
       }
     };

     var source2 = {
       middlename: 'bambi',
       secondTest: [0, 1, 2]
     };

     var result = q.object.merge(target, source, source2);

     assert.isObject(result, 'Result value has to be an object!');
     assert.isDefined(result['name']);
     assert.isDefined(result['surname']);
     assert.isDefined(result['test']);
     assert.equal(result.test, source.test);
     assert.isDefined(result['middlename']);
     assert.isDefined(result['secondTest']);
     assert.deepEqual(result.secondTest, [0, 1, 2]);
   });
 });
