
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

describe('data.DataArray', function() { 

    var __a =  null;
    beforeEach (function () {
      __a = new qx.data.Array("one", "two", "three");
    });

    afterEach (function () {
      __a.dispose();
    });
 
  it("Constructor", function() {
      // create empty array
      var a = new qx.data.Array();
      assert.equal(0, a.length, "Length does not fit an an empty array!");
      a.dispose();

      // create an array with a length
      a = new qx.data.Array(10);
      assert.equal(10, a.length, "Length does not fit an an empty array!");
      a.dispose();

      // create an array with only elements
      a = new qx.data.Array("one", "two", "three");
      assert.equal(3, a.length, "Length does not fit an an empty array!");
      a.dispose();
      a = new qx.data.Array(1, 2, 3);
      assert.equal(3, a.length, "Length does not fit an an empty array!");
      a.dispose();

      // create an array with an given native array
      var newArray = ["one", "two", "three"];
      a = new qx.data.Array(newArray);
      assert.equal(3, a.length, "Length does not fit an an empty array!");
      a.dispose();

      // test some wrong inputs
      assert.throw(function() {
        new qx.data.Array(true);
      }, Error, null, "Boolean not supported!");
      assert.throw(function() {
        new qx.data.Array({});
      }, Error, null, "Objects not supported!");
      assert.throw(function() {
        new qx.data.Array(function() {});
      }, Error, null, "Functions not supported!");
  });
 
  it("GetItem", function() {
      // check the getvalue function
      assert.equal("one", __a.getItem(0), "IndexAt does not work at position 0");
      assert.equal("two", __a.getItem(1), "IndexAt does not work at position 1");
      assert.equal("three", __a.getItem(2), "IndexAt does not work at position 2");

      // try some wrong inputs
      assert.isUndefined(__a.getItem(-1), "There should be no element at -1");
      assert.isUndefined(__a.getItem(3), "There should be no element at 3");
  });
 
  it("SetItem", function() {
      __a.setItem(0, "eins");
      assert.equal("eins", __a.getItem(0), "IndexAt does not work at position 0");
      __a.setItem(3, "drei");
      assert.equal("drei", __a.getItem(3), "IndexAt does not work at position 0");
  });
 
  it("Join", function() {
      assert.equal("one, two, three", __a.join(", "), "Join does not work");
  });
 
  it("Reverse", function() {
      __a.reverse();
      assert.equal("one", __a.getItem(2), "Reverse does not work");

      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.reverse();
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(2, data.end, "Wrong end index in the event.");
        assert.equal("order", data.type, "Wrong type in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("Sort", function() {
      __a.sort();
      assert.equal("one three two", __a.join(" "), "Simple sort does not work");
      __a.sort(function(a, b) {
        return a > b ? -1 : 1;
      });
      assert.equal("two three one", __a.join(" "), "Own sort does not work");

      // test for the event
      var a = new qx.data.Array(2, 7, 5);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.sort();
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(2, data.end, "Wrong end index in the event.");
        assert.equal("order", data.type, "Wrong type in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("Concat", function() {
       var b = __a.concat(["four", "five"]);
       assert.equal("one two three four five", b.join(" "), "Concat does not work");
       b.dispose();
  });
 
  it("Slice", function() {
      var slice = __a.slice(0, 1);
      assert.equal("one", slice.getItem(0), "Slice does not work");
      slice.dispose();
      slice = __a.slice(1, 2);
      assert.equal("two", slice.getItem(0), "Slice does not work");
      slice.dispose();
      slice = __a.slice(0, 2);
      assert.equal("one", slice.getItem(0), "Slice does not work");
      slice.dispose();
      slice = __a.slice(0, 2);
      assert.equal("two", slice.getItem(1), "Slice does not work");
      slice.dispose();
  });
 
  it("Pop", function() {
      assert.equal("three", __a.pop(), "Pop does not work.");
      assert.equal(2, __a.length, "Wrong length after pop");
      assert.equal("two", __a.pop(), "Pop does not work.");
      assert.equal("one", __a.pop(), "Pop does not work.");
      assert.equal(0, __a.length, "Wrong length after pop");
  });
 
  it("Push", function() {
      assert.equal(4, __a.push("four"), "Push does not give the right length back.");
      assert.equal("one two three four", __a.join(" "), "Single push does not work.");
      assert.equal(4, __a.length, "Single push does not work.");
      __a.dispose();
      __a = new qx.data.Array();
      __a.push(1, 2, 3);
      assert.equal("1 2 3", __a.join(" "), "Multiple push does not work.");
  });
 
  it("Shift", function() {
      assert.equal("one", __a.shift(), "Shift does not work.");
      assert.equal("two three", __a.join(" "), "Shift does not work.");
      assert.equal("two", __a.shift(), "Shift does not work.");
      assert.equal(1, __a.length, "Shift does not work.");
  });
 
  it("ShiftWithEventPropagation", function() {
      var data = {
        "bar" : [1,2,3,4,5]
      };
      var model = qx.data.marshal.Json.createModel( data, true );
      assert.equal(1, model.bar.shift());
  });
 
  it("Unshift", function() {
      assert.equal(4, __a.unshift("zero"), "Unshift does not return the proper length.");
      assert.equal("zero one two three", __a.join(" "), "Unshift does not work!");
      assert.equal(6, __a.unshift("-2", "-1"), "Unshift does not return the proper length.");
      assert.equal("-2 -1 zero one two three", __a.join(" "), "Unshift does not work!");
  });
 
  it("Splice", function() {
      var a = new qx.data.Array(1, 2, 3, 4, 5, 6, 7, 8);

      var splice = a.splice(4, a.length - 1);
      assert.equal("5 6 7 8", splice.join(" "), "Splice does not work");
      splice.dispose();
      assert.equal("1 2 3 4", a.join(" "), "Splice does not work");
      splice = a.splice(1, 2);
      assert.equal("2 3", splice.join(" "), "Splice does not work");
      splice.dispose();
      assert.equal("1 4", a.join(" "), "Splice does not work");
      a.dispose();

      var a = new qx.data.Array(1, 2, 3, 4, 5);
      splice = a.splice(2, 0, "a", "b");
      assert.equal("", splice.join(" "), "Splice does not work");
      splice.dispose();
      assert.equal("1 2 a b 3 4 5", a.join(" "), "Splice does not work");
      splice = a.splice(2, 2, "c", 3);
      assert.equal("a b", splice.join(" "), "Splice does not work");
      splice.dispose();
      assert.equal("1 2 c 3 3 4 5", a.join(" "), "Splice does not work");

      splice = a.splice(1);
      assert.instanceOf(splice, qx.data.Array, "Wrong return type");
      splice.dispose();
      a.dispose();
  });
 
  it("ToArray", function() {
      assert.equal("one two three", __a.toArray().join(" "), "toArray does not work!");
      assert.instanceOf( __a.toArray(), Array, "toArray does not work!");
  });
 
  it("LengthEvent", function() {
      
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      qx.core.Assert.assertEventFired(a, "changeLength", function () {
        a.pop();
      }, function(data) {
        assert.equal(2, data);
      }, "ChangeLength event not fired!");
      a.dispose();
  });
 
  it("ToString", function() {
      assert.equal(__a.toArray().toString(), __a.toString(), "toString does not work!");
  });
 
  it("Contains", function() {
      assert.isTrue(__a.contains("one"), "contains does not work!");
      assert.isTrue(__a.contains("two"), "contains does not work!");
      assert.isTrue(__a.contains("three"), "contains does not work!");
  });
 
  it("IndexOf", function() {
      assert.equal(0, __a.indexOf("one"), "indexOf does not work!");
      assert.equal(1, __a.indexOf("two"), "indexOf does not work!");
      assert.equal(2, __a.indexOf("three"), "indexOf does not work!");
  });
 
  it("LastIndexOf", function() {
      __a.push("one");
      __a.push("two");
      __a.push("three");
      assert.equal(3, __a.lastIndexOf("one"), "lastIndexOf does not work!");
      assert.equal(4, __a.lastIndexOf("two"), "lastIndexOf does not work!");
      assert.equal(5, __a.lastIndexOf("three"), "lastIndexOf does not work!");
  });

  it("Copy", function () {

      var a = __a.copy();
      // change the original array
      __a.setItem(0, "0");
      __a.setItem(1, "1");
      __a.setItem(2, "2");

      // check the value
      assert.equal("one", a.getItem(0), "Copy does not work");
      assert.equal("two", a.getItem(1), "Copy does not work");
      assert.equal("three", a.getItem(2), "Copy does not work");

      a.dispose();
  });
 
  it("InsertAt", function() {
      __a.insertAt(1, "eins");
      __a.insertAt(3, "drei");

      // check the value
      assert.equal("one", __a.getItem(0), "insertAt does not work");
      assert.equal("eins", __a.getItem(1), "insertAt does not work");
      assert.equal("two", __a.getItem(2), "insertAt does not work");
      assert.equal("drei", __a.getItem(3), "insertAt does not work");
      assert.equal("three", __a.getItem(4), "insertAt does not work");
  });
 
  it("InsertBefore", function() {
      __a.insertBefore("two", "eins");
      __a.insertBefore("three", "drei");

      // check the value
      assert.equal("one", __a.getItem(0), "insertBefore does not work");
      assert.equal("eins", __a.getItem(1), "insertBefore does not work");
      assert.equal("two", __a.getItem(2), "insertBefore does not work");
      assert.equal("drei", __a.getItem(3), "insertBefore does not work");
      assert.equal("three", __a.getItem(4), "insertBefore does not work");
  });
 
  it("InsertAfter", function() {
      __a.insertAfter("one", "eins");
      __a.insertAfter("two", "drei");

      // check the value
      assert.equal("one", __a.getItem(0), "insertAfter does not work");
      assert.equal("eins", __a.getItem(1), "insertAfter does not work");
      assert.equal("two", __a.getItem(2), "insertAfter does not work");
      assert.equal("drei", __a.getItem(3), "insertAfter does not work");
      assert.equal("three", __a.getItem(4), "insertAfter does not work");
  });
 
  it("RemoveAt", function() {
      var removed = __a.removeAt(1);

      // check the value
      assert.equal("two", removed, "no return type");
      assert.equal("one", __a.getItem(0), "removeAt does not work");
      assert.equal("three", __a.getItem(1), "removeAt does not work");
  });
 
  it("RemoveAll", function() {

      
      qx.core.Assert.assertEventFired(__a, "changeLength", function () {
        __a.removeAll();
      }, function(e) {
        assert.equal(0, __a.getLength(), "length not 0");
      }, "Change event not fired!");


      __a.push("a");
      __a.push("b");

      qx.core.Assert.assertEventFired(__a, "change", function () {
        var removed = __a.removeAll();
        assert.equal(2, removed.length);
        assert.equal("a", removed[0]);
        assert.equal("b", removed[1]);
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(1, data.end, "Wrong end index in the event.");
        assert.equal("remove", data.type, "Wrong type in the event.");
        assert.equal("a", data.removed[0]);
        assert.equal("b", data.removed[1]);
      }, "Change event not fired!");

      assert.equal(0, __a.length, "RemoveAll does not work.");
  });
 
  it("Append", function() {
      var dArray = new qx.data.Array("4", "5");
      __a.append(dArray.toArray());

      // check the value
      assert.equal("one", __a.getItem(0), "append does not work");
      assert.equal("two", __a.getItem(1), "append does not work");
      assert.equal("three", __a.getItem(2), "append does not work");
      assert.equal("4", __a.getItem(3), "append does not work");
      assert.equal("5", __a.getItem(4), "append does not work");
      dArray.dispose();

      // check if qx arrays work
      dArray = new qx.data.Array(["sechs"]);
      __a.append(dArray);
      assert.equal("sechs", __a.getItem(5), "append does not work");
      dArray.dispose();
  });
 
  it("Remove", function() {
      __a.remove("two");

      // check the value
      assert.equal("one", __a.getItem(0), "removeAt does not work");
      assert.equal("three", __a.getItem(1), "removeAt does not work");
  });
 
  it("Equals", function() {
      var a = new qx.data.Array("one", "two", "three");

      assert.isTrue(__a.equals(a), "equals does not work.");

      a.dispose();
  });
 
  it("Sum", function() {
      var a = new qx.data.Array(1, 2, 3);

      assert.equal(6, a.sum(), "sum does not work.");

      a.dispose();
  });
 
  it("Max", function() {
      var a = new qx.data.Array(1, 2, 3);

      assert.equal(3, a.max(), "max does not work.");

      a.dispose();
  });
 
  it("Min", function() {
      var a = new qx.data.Array(1, 2, -3);

      assert.equal(-3, a.min(), "min does not work.");

      a.dispose();
  });
 
  it("PopEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.pop();
      }, function(data) {
        assert.equal(1, data.start, "Wrong start index in the event.");
        assert.equal(1, data.end, "Wrong end index in the event.");
        assert.equal("remove", data.type, "Wrong type in the event.");
        assert.equal(3, data.removed[0], "Wrong removed array in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("PushEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.push(4);
      }, function(data) {
        assert.equal(3, data.start, "Wrong start index in the event.");
        assert.equal(3, data.end, "Wrong end index in the event.");
        assert.equal("add", data.type, "Wrong type in the event.");
        assert.equal(4, data.added[0], "Wrong item array in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("AppendEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.append([4, 5]);
      }, function(data) {
        assert.equal(3, data.start, "Wrong start index in the event.");
        assert.equal(4, data.end, "Wrong end index in the event.");
        assert.equal("add", data.type, "Wrong type in the event.");
        assert.equal(4, data.added[0], "Wrong item array in the event.");
        assert.equal(5, data.added[1], "Wrong item array in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("ShiftEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.shift();
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(1, data.end, "Wrong end index in the event.");
        assert.equal("remove", data.type, "Wrong type in the event.");
        assert.equal(1, data.removed[0], "Wrong item in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("UnshiftEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.unshift(0);
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(3, data.end, "Wrong end index in the event.");
        assert.equal("add", data.type, "Wrong type in the event.");
        assert.equal(0, data.added[0], "Wrong item in the event.");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("SpliceEvent", function() {
      // test for the event (remove)
      var a = new qx.data.Array("a", "b", "c", "d", "e");
      
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.splice(1, 2).dispose();
      }, function(data) {
        assert.equal(1, data.start, "Wrong start index in the event (remove).");
        assert.equal(2, data.end, "Wrong end index in the event (remove).");
        assert.equal("remove", data.type, "Wrong type in the event (remove).");
        assert.equal("b", data.removed[0], "Wrong item in the event (remove).");
        assert.equal("c", data.removed[1], "Wrong item in the event (remove).");
        assert.equal(2, data.removed.length, "Wrong item in the event (remove).");
        assert.equal(0, data.added.length, "Wrong item in the event (remove).");
      }, "Change event not fired!");
      a.dispose();

      // test for the event (add)
      a = new qx.data.Array("a", "b", "c");
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.splice(0, 0, "x").dispose();
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event. (add)");
        assert.equal(1, data.end, "Wrong end index in the event. (add)");
        assert.equal("add", data.type, "Wrong type in the event. (add)");
        assert.equal("x", data.added[0], "Wrong items in the event. (add)");
        assert.equal(1, data.added.length, "Wrong amount of items in the event. (add)");
        assert.equal(0, data.removed.length, "Wrong amount of items in the event. (add)");
      }, "Change event not fired!");
      a.dispose();

      // test for the event (add/remove)
      a = new qx.data.Array("a", "b", "c");
      qx.core.Assert.assertEventFired(a, "change", function () {
        a.splice(0, 1, "x").dispose();
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event. (add/remove)");
        assert.equal(0, data.end, "Wrong end index in the event. (add/remove)");
        assert.equal("add/remove", data.type, "Wrong type in the event. (add/remove)");
        assert.equal("x", data.added[0], "Wrong items in the event. (add/remove)");
        assert.equal(1, data.added.length, "Wrong amount of items in the event. (add/remove)");
        assert.equal("a", data.removed[0], "Wrong items in the event. (add/remove)");
        assert.equal(1, data.removed.length, "Wrong amount of items in the event. (add/remove)");
      }, "Change event not fired!");
      a.dispose();
  });
 
  it("SpliceBubbleEvent", function() {
      // test for the event (remove)
      var a = new qx.data.Array("a", "b", "c", "d", "e");
      
      qx.core.Assert.assertEventFired(a, "changeBubble", function () {
        a.splice(1, 2).dispose();
      }, function(data) {
        assert.equal(0, data.value.length, "Wrong amount of item(s) added in the bubble event (remove).");
        assert.equal(2, data.old.length, "Wrong amount of item(s) removed in the bubble event (remove).");
        assert.equal("1-2", data.name, "Wrong name in the bubble event (remove).");
      }, "changeBubble event not fired!");
      a.dispose();

      // test for the event (add)
      a = new qx.data.Array("a", "b", "c");
      qx.core.Assert.assertEventFired(a, "changeBubble", function () {
        a.splice(0, 0, "x").dispose();
      }, function(data) {
        assert.equal(1, data.value.length, "Wrong amount of item(s) added in the bubble event (add).");
        assert.equal(0, data.old.length, "Wrong amount of item(s) removed in the bubble event (add).");
        assert.equal("0", data.name, "Wrong name in the bubble event (add).");
      }, "changeBubble event not fired!");
      a.dispose();

      // test for the event (add/remove)
      a = new qx.data.Array("a", "b", "c");
      qx.core.Assert.assertEventFired(a, "changeBubble", function () {
        a.splice(0, 1, "x").dispose();
      }, function(data) {
        assert.equal(1, data.value.length, "Wrong amount of item(s) added in the bubble event (add/remove).");
        assert.equal(1, data.old.length, "Wrong amount of item(s) removed in the bubble event (add/remove).");
        assert.equal("0", data.name, "Wrong name in the bubble event (add/remove).");
      }, "changeBubble event not fired!");
      a.dispose();
  });
 
  it("SpliceEventNoChange", function() {
      var a = new qx.data.Array(1, 2, 3);
      qx.core.Assert.assertEventNotFired(a, "change", function () {
        a.splice(0, 0).dispose();
      }, "Change event fired!");

      a.dispose();
  });
 
  it("SpliceEventEqualContent", function() {
      var a = new qx.data.Array(1, 2, 3);

      qx.core.Assert.assertEventNotFired(a, "change", function () {
        a.splice(0, 2, 1, 2).dispose();
      }, "Change event fired!");

      a.dispose();
  });
 
  it("SpliceBubbleEventNoChange", function() {
      var a = new qx.data.Array(1, 2, 3);
      qx.core.Assert.assertEventNotFired(a, "changeBubble", function () {
        a.splice(0, 0).dispose();
      }, "Change bubble event fired!");

      a.dispose();
  });
 
  it("SpliceBubbleEventEqualContent", function() {
      var a = new qx.data.Array(1, 2, 3);
      qx.core.Assert.assertEventNotFired(a, "changeBubble", function () {
        a.splice(0, 2, 1, 2).dispose();
      }, "Change bubble event fired!");

      a.dispose();
  });
 
  it("SetItemEvent", function() {
      // test for the event
      var a = new qx.data.Array(1, 2, 3);
      

      qx.core.Assert.assertEventFired(a, "change", function () {
        a.setItem(0, 4);
      }, function(data) {
        assert.equal(0, data.start, "Wrong start index in the event.");
        assert.equal(0, data.end, "Wrong end index in the event.");
        assert.equal("add/remove", data.type, "Wrong type in the event.");
        assert.equal(4, data.added[0], "Wrong item in the event.");
        assert.equal(1, data.added.length, "Wrong item in the event.");
        assert.equal(1, data.removed[0], "Wrong item in the event.");
        assert.equal(1, data.removed.length, "Wrong item in the event.");
      }, "Change event not fired!");

      // set the same thing again and check if we get a second event
       qx.core.Assert.assertEventNotFired(a, "change", function () {
        a.setItem(0, 4);
      }, "Change event fired!");
      a.dispose();
  });
 
  it("ForEach", function() {
      
      var i = 0;
      var thisContext = {};
      var handlerCalled = false;

      var forEachHandler = function(item, index, array) {
        handlerCalled = true;
        // check for the context
        assert.equal(this, thisContext);
        // check the parameter
        assert.equal(i, index);
        assert.equal(__a, array);
        // check the tree items
        if (i == 0) {
          i++;
          assert.equal("one", item);
          return;
        } else if (i == 1) {
          i++
          assert.equal("two", item);
          return;
        } else if (i == 2) {
          i++;
          assert.equal("three", item);
          return;
        }
        // something went wrong!
        throw new Error("Wrong call in the handler.");
      }

      // invoke the forEach
      __a.forEach(forEachHandler, thisContext);

      // check if the handlers has been called
      assert.isTrue(handlerCalled);
  });
 
  it("Filter", function() {
      
      var b = __a.filter(function(item, index, array) {
        assert.isString(item);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return item == "one" || item == "three";
      });

      assert.equal(2, b.length);
      assert.equal("one", b.getItem(0));
      assert.equal("three", b.getItem(1));

      b.dispose();
  });
 
  it("Map", function() {
      
      var b = __a.map(function(item, index, array) {
    
        assert.isString(item);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return item + "!";
      }, this);

      assert.equal(3, b.length);
      assert.equal("one!", b.getItem(0));
      assert.equal("two!", b.getItem(1));
      assert.equal("three!", b.getItem(2));

      b.dispose();
  });
 
  it("Some", function() {
      
      assert.isTrue(__a.some(function(item, index, array) {
    
        assert.isString(item);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return item == "one";
      }, this));

      assert.isFalse(__a.some(function(item, index, array) {
        return item == "xxx";
      }, this));
  });
 
  it("Every", function() {
      
      assert.isTrue(__a.every(function(item, index, array) {
    
        assert.isString(item);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return ["one", "two", "three"].indexOf(item) >= 0;
      }, this));

      assert.isFalse(__a.every(function(item, index, array) {
        return item == "one";
      }, this));
  });
 
  it("Reduce", function() {
      
      var reduced = __a.reduce(function(previousValue, currentValue, index, array) {
        assert.isString(previousValue);
        assert.isString(currentValue);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return previousValue + currentValue;
      }, "---");

      assert.equal("---onetwothree", reduced);
  });
 
  it("ReduceRight", function() {
      
      var reduced = __a.reduceRight(function(previousValue, currentValue, index, array) {
        assert.isString(previousValue);
        assert.isString(currentValue);
        assert.isNumber(index);
        assert.equal(__a.toArray(), array);
        return previousValue + currentValue;
      }, "---");

      assert.equal("---threetwoone", reduced);
    
  });
});
