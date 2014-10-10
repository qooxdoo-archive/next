/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("lang.Object", function()
{
 
 it("Object", function() {
      assert.isDefined(qx.lang.Object);
  });
 
  it("Empty", function() {
      var object = {a: 1};
      qx.lang.Object.empty(object);
      assert.isTrue(qx.lang.Object.isEmpty(object));

      var object = {};
      qx.lang.Object.empty(object);
      assert.isTrue(qx.lang.Object.isEmpty(object));
  });
 
  it("IsEmpty", function() {
      assert.equal(true, qx.lang.Object.isEmpty({}));
      assert.equal(false, qx.lang.Object.isEmpty({a:undefined}));
      assert.equal(false, qx.lang.Object.isEmpty({a:null}));
      assert.equal(false, qx.lang.Object.isEmpty({a:1}));
  });
 
  it("GetKeys", function() {
      var object = {
        a: undefined,
        b: null,
        c: 1
      }
      assert.deepEqual(
        ["a", "b", "c"].sort(),
        Object.keys(object).sort()
      );

      var object = {}
      assert.deepEqual(
        [],
        Object.keys(object)
      );

      var object = {
        "isPrototypeOf": 1,
        "hasOwnProperty": 1,
        "toLocaleString": 1,
        "toString": 1,
        "valueOf": 1
      };
      assert.deepEqual(
        [
          "isPrototypeOf",
          "hasOwnProperty",
          "toLocaleString",
          "toString",
          "valueOf"
        ].sort(),
        Object.keys(object).sort()
      );
  });
 
  it("GetValues", function() {
      var object = {
        a: undefined,
        b: null,
        c: 1
      }
      assert.deepEqual(
        [undefined, null, 1].sort(),
        qx.lang.Object.getValues(object).sort()
      );

      var object = {}
      assert.deepEqual(
        [],
        qx.lang.Object.getValues(object)
      );

      var object = {
        "isPrototypeOf": 1,
        "hasOwnProperty": 2,
        "toLocaleString": 3,
        "toString": 4,
        "valueOf": 5
      };
      assert.deepEqual(
        [1, 2, 3, 4, 5].sort(),
        qx.lang.Object.getValues(object).sort()
      );
  });
 
  it("MergeWith", function() {
      var original = {a: 0};
      var o1 = {a: 2, b: 1};

      qx.lang.Object.mergeWith(original, o1, true);

      // check the original
      assert.equal(2, original.a);
      assert.equal(1, original.b);
  });
 
  it("MergeWithCarefully", function() {
      var original = {a: 0};
      var o1 = {a: 2, b: 1};

      qx.lang.Object.mergeWith(original, o1, false);

      // check the original
      assert.equal(0, original.a);
      assert.equal(1, original.b);
  });
 
  it("Clone", function() {
      var original = {a: 12, b: true, c: "affe"};
      var clone = qx.lang.Object.clone(original);

      clone.a = 14;
      original.b = false;
      clone.c = "AFFE";

      // check the original
      assert.equal(12, original.a);
      assert.equal(false, original.b);
      assert.equal("affe", original.c);

      // check the clone
      assert.equal(14, clone.a);
      assert.equal(true, clone.b);
      assert.equal("AFFE", clone.c);
  });
 
  it("CloneDeep", function() {
      var original = {a: {b: 0}};
      var clone = qx.lang.Object.clone(original, true);

      // change the original
      original.a.b = 1;
      assert.equal(0, clone.a.b);

      original = {a: [{b: 0}]};
      clone = qx.lang.Object.clone(original, true);

      // change the original
      original.a[0].b = 1;
      assert.equal(0, clone.a[0].b);
  });
 
  it("Invert", function() {
      assert.isDefined(qx.lang.Object.invert);
      var Obj = qx.lang.Object;

      qx.core.Assert.assertJsonEquals(
      {
        a   : "1",
        "2" : "b"
      },
      Obj.invert(
      {
        1 : "a",
        b : 2
      }));
  });
 
  it("GetKeyFromValue", function() {
      var obj = {a: 123};
      assert.equal("a", qx.lang.Object.getKeyFromValue(obj, 123));
  });
 
  it("Contains", function() {
      assert.isTrue(qx.lang.Object.contains({a:1}, 1));
  });
 
  it("FromArray", function() {
      var array = ["a", "b"];
      var obj = qx.lang.Object.fromArray(array);

      assert.isTrue(obj.a);
      assert.isTrue(obj.b);
  });
 
  it("Equals", function() {

      var a = {a: 'text', b:[0,1]};
      var b = {a: 'text', b:[0,1]};
      var c = {a: 'text', b: 0};
      var d = {a: 'text', b: false};
      var e = {a: 'text', b:[1,0]};
      var f = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
      var g = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
      var h = {a: 'text', b:[1,0], f: function(){ this.a = this.b; }};

      var i = {
          a: 'text',
          c: {
              b: [1, 0],
              f: function(){
                  this.a = this.b;
              }
          }
      };

      var j = {
          a: 'text',
          c: {
              b: [1, 0],
              f: function(){
                  this.a = this.b;
              }
          }
      };
      var k = {a: 'text', b: null};
      var l = {a: 'text', b: undefined};



      assert.isTrue(qx.lang.Object.equals(a,b));
      assert.isFalse(qx.lang.Object.equals(a,c));
      assert.isFalse(qx.lang.Object.equals(c,d));
      assert.isFalse(qx.lang.Object.equals(a,e));
      assert.isFalse(qx.lang.Object.equals(f,g));
      assert.isFalse(qx.lang.Object.equals(h,g));
      assert.isFalse(qx.lang.Object.equals(i,j));
      assert.isFalse(qx.lang.Object.equals(d,k));
      assert.isFalse(qx.lang.Object.equals(k,l));


      assert.isFalse(qx.lang.Object.equals({}, null));
      assert.isFalse(qx.lang.Object.equals({}, undefined));
      assert.isTrue(qx.lang.Object.equals('qooxdoo','qooxdoo'));
      assert.isTrue(qx.lang.Object.equals(5,5));
      assert.isFalse(qx.lang.Object.equals(5,10));
      assert.isFalse(qx.lang.Object.equals(1,'1'));
      assert.isTrue(qx.lang.Object.equals([],[]));
      assert.isTrue(qx.lang.Object.equals([1,2],[1,2]));
      assert.isFalse(qx.lang.Object.equals([1,2],[2,1]));
      assert.isFalse(qx.lang.Object.equals([1,2],[1,2,3]));
      assert.isTrue(qx.lang.Object.equals(new Date("03/31/2014"), new Date("03/31/2014")));
      assert.isFalse(qx.lang.Object.equals({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));
      assert.isFalse(qx.lang.Object.equals(function(x){return x;},function(y){return y+2;}));
  });
});
