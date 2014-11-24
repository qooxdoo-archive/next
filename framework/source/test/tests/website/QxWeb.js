 describe('q', function() {

   beforeEach(function() {
     globalSetup();
   });


   afterEach(function() {
     globalTeardown();
   });


   it("Unique", function() {
     var c = q("#sandbox").add(q("#sandbox"));
     assert.equal(2, c.length);
     assert.isTrue(c.is("#sandbox"));
     var u = c.unique();
     assert.equal(1, u.length);
     assert.isTrue(u.is("#sandbox"));
   });


   it("QuerySelector", function() {
     var test = document.createElement("div");
     test.id = "foo";
     document.getElementById("sandbox").appendChild(test);
     var collection = q("#foo");
     assert.instanceOf(collection, q);
     assert.equal(1, collection.length);
     assert.equal(document.getElementById("foo"), collection[0]);
   });


   it("Init", function() {
     var select = document.createElement("select");
     document.getElementById("sandbox").appendChild(select);
     var opt = document.createElement("option");
     select.appendChild(opt);

     // Element
     var coll = q(select);
     assert.equal(1, coll.length, "affe0");
     assert.equal(select, coll[0]);

     // Array of elements
     coll = q([select]);
     assert.equal(1, coll.length, "affe1");
     assert.equal(select, coll[0]);

     // NodeList
     coll = q(document.getElementsByTagName("select"));
     assert.equal(1, coll.length, "affe2");
     assert.equal(select, coll[0]);

     // HtmlCollection
     if (typeof select.selectedOptions !== "undefined") {
       coll = q(select.selectedOptions);
       assert.equal(1, coll.length, "affe3");
       assert.equal(opt, coll[0]);
     }

     // Bogus
     coll = q({
       length: 5
     });
     assert.equal(0, coll.length);
   });


   it("Context", function() {
     var container1 = document.createElement("div");
     var inner1 = document.createElement("h2");
     inner1.id = "inner1";
     container1.appendChild(inner1);
     document.getElementById("sandbox").appendChild(container1);

     var container2 = document.createElement("div");
     var inner2 = document.createElement("h2");
     inner2.id = "inner2";
     container2.appendChild(inner2);
     document.getElementById("sandbox").appendChild(container2);

     // no context
     assert.equal(2, q("#sandbox h2").length);
     // element as context
     var coll1 = q("h2", container1);
     assert.equal(1, coll1.length);
     assert.equal("inner1", coll1[0].id);

     // collection as context
     var coll2 = q("h2", q(container1));
     assert.equal(1, coll2.length);
     assert.equal("inner1", coll2[0].id);
   });


   it("Override qxWeb prototype methods with $attach", function () {
     assert.isUndefined(qxWeb.prototype['__attach_test']);

     qxWeb.$attach({
       "__attach_test": function () {
         return "foo";
       }
     });
     assert.isDefined(qxWeb.prototype['__attach_test']);
     assert.equal("foo", qxWeb(document.body).__attach_test());

     if (qx.core.Environment.get("qx.debug")) {
       assert.throw(function () {
         qxWeb.$attach({
           "__attach_test": function () {
             return "bar";
           }
         });
       }, Error);
     } else {
       qxWeb.$attach({
         "__attach_test": function () {
           return "bar";
         }
       });
     }

     assert.equal("foo", qxWeb(document.body).__attach_test());

     qxWeb.$attach({
       "__attach_test": function () {
         return "bar";
       }
     }, true);
     assert.equal("bar", qxWeb(document.body).__attach_test());
   });
 });
