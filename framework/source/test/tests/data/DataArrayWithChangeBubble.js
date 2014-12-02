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
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */
// qx.Class.define("qx.test.data.DataArrayWithChangeBubble",
// {
//   extend : qx.dev.unit.TestCase,
describe('data.dataArrayWithChangeBubble', function() {

  var testObject = null;
  var array = null;

  beforeEach(function() {
    testObject = {
      name: "test",
      data: ["A", "B", "C"]
    };
    testObject = qx.data.marshal.Json.createModel(testObject, true);
    array = testObject.data;
  });


  afterEach(function() {
    testObject = null;
  });


  it("RootArray", function() {
    if (qx.data.model) {
      delete qx.data.model.b;
    }
    var m = [{
      b: 10
    }];
    m = qx.data.marshal.Json.createModel(m, true);

    qx.core.Assert.assertEventFired(m, "changeBubble", function() {
      m.getItem(0).b = "affee";
    }, function(data) {
      assert.equal("[0].b", data.name);
      assert.isString(data.name, "name is not a String.");
      assert.equal(m.getItem(0), data.item);
    });
  });


  it("Append", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "C", "D", "E", "F"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["D", "E", "F"], data.value);
      assert.equal("data[3-5]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.append(["D", "E", "F"]);
    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "C", "D", "E", "F"], array.toArray(), "Changes are not applied!");
  });


  it("AppendOne", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "C", "D"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["D"], data.value);
      assert.equal("data[3]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.append(["D"]);

    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "C", "D"], array.toArray(), "Changes are not applied!");
  });


  it("InsertAfter", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["BB"], data.value);
      assert.equal("data[2]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);
    array.insertAfter("B", "BB");
    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied!");
  });


  it("InsertAt", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["BB"], data.value);
      assert.equal("data[2]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.insertAt(2, "BB");

    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied!");
  });


  it("InsertBefore", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["BB"], data.value);
      assert.equal("data[2]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.insertBefore("C", "BB");

    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "BB", "C"], array.toArray(), "Changes are not applied!");
  });


  it("Pop", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[2]", data.name);
      assert.deepEqual(["C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.pop();

    assert(spy.calledOnce);
    assert.deepEqual(["A", "B"], array.toArray(), "Changes are not applied!");
  });


  it("Push", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "C", "D"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["D"], data.value);
      assert.equal("data[3]", data.name);
      assert.deepEqual([], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.push("D");
    //here
    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "C", "D"], array.toArray(), "Changes are not applied!");
  });


  it("Remove", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[1]", data.name);
      assert.deepEqual(["B"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.remove("B");

    assert(spy.calledOnce);
    assert.deepEqual(["A", "C"], array.toArray(), "Changes are not applied!");
  });


  it("RemoveAll", function() {

    var handler = function(data) {
      assert.deepEqual([], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[0-2]", data.name);
      assert.deepEqual(["A", "B", "C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.removeAll();

    assert(spy.calledOnce);
    assert.deepEqual([], array.toArray(), "Changes are not applied!");
  });


  it("RemoveAt", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[1]", data.name);
      assert.deepEqual(["B"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.removeAt(1);

    assert(spy.calledOnce);
    assert.deepEqual(["A", "C"], array.toArray(), "Changes are not applied!");
  });


  it("Reverse", function() {

    var handler = function(data) {
      assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied when handler is executed!");

      // check the data
      assert.deepEqual(["C", "B", "A"], data.value);
      assert.equal("data[0-2]", data.name);
      assert.deepEqual(["A", "B", "C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.reverse();

    assert(spy.calledOnce);
    assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied!");
  });


  it("SetItem", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "BB", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["BB"], data.value);
      assert.equal("data[1]", data.name);
      assert.deepEqual(["B"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.setItem(1, "BB");

    assert(spy.calledOnce);
    assert.deepEqual(["A", "BB", "C"], array.toArray(), "Changes are not applied!");
  });


  it("Shift", function() {

    var handler = function(data) {
      assert.deepEqual(["B", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[0]", data.name);
      assert.deepEqual(["A"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.shift();

    assert(spy.calledOnce);
    assert.deepEqual(["B", "C"], array.toArray(), "Changes are not applied!");
  });


  it("Sort", function() {

    var handler = function(data) {
      assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["C", "B", "A"], data.value);
      assert.equal("data[0-2]", data.name);
      assert.deepEqual(["A", "B", "C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.sort(function(a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    });

    assert(spy.calledOnce);
    assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied!");
  });


  it("SortSecondTime", function() {

    var changeBubbleExecutionCounter = 0;

    var handler = function(data) {
      assert.equal(0, changeBubbleExecutionCounter, "Handler was fired more than one times.");
      assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["C", "B", "A"], data.value);
      assert.equal("data[0-2]", data.name);
      assert.deepEqual(["A", "B", "C"], data.old);
      assert.equal(array, data.item);

      changeBubbleExecutionCounter++;
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.sort(function(a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    });

    assert(spy.calledOnce);
    assert.deepEqual(["C", "B", "A"], array.toArray(), "Changes are not applied!");

    // Sort array second time with same method
    array.sort(function(a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    });
  });


  it("Splice", function() {

    var handler = function(data) {
      assert.deepEqual(["A", "B", "D", "E", "F"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["D", "E", "F"], data.value);
      assert.equal("data[2-4]", data.name);
      assert.deepEqual(["C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.splice(2, 3, "D", "E", "F").dispose();

    assert(spy.calledOnce);
    assert.deepEqual(["A", "B", "D", "E", "F"], array.toArray(), "Changes are not applied!");
  });


  it("SpliceRemoveOnly", function() {

    var handler = function(data) {
      assert.deepEqual(["A"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual([], data.value);
      assert.equal("data[1-2]", data.name);
      assert.deepEqual(["B", "C"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.splice(1, 2).dispose();

    assert(spy.calledOnce);
    assert.deepEqual(["A"], array.toArray(), "Changes are not applied!");
  });


  it("Unshift", function() {

    var handler = function(data) {
      assert.deepEqual(["D", "A", "B", "C"], array.toArray(), "Changes are not applied when handler is executed!");
      // check the data
      assert.deepEqual(["D"], data.value);
      assert.equal("data[0]", data.name);
      assert.deepEqual(["A"], data.old);
      assert.equal(array, data.item);
    };

    var spy = sinonSandbox.spy(handler);
    testObject.on("changeBubble", spy, this);

    array.unshift("D");

    assert(spy.calledOnce);
    assert.deepEqual(["D", "A", "B", "C"], array.toArray(), "Changes are not applied!");
  });


  it("ShiftAndSet", function() {
    // [BUG #6406]
    var model = qx.data.marshal.Json.createModel(
      [{
        foo: "one"
      }, {
        foo: "two"
      }, {
        foo: "three"
      }], true
    );
    // first do a shift operation
    model.shift();


    var handler = function(data) {
      // check the data
      assert.equal("zwei", data.value);
      assert.equal("[0].foo", data.name);
      assert.equal("two", data.old);
    };

    var spy = sinonSandbox.spy(handler);
    model.on("changeBubble", spy, this);

    model.getItem(0).foo = ("zwei");
  });


  it("ReverseAndSet", function() {
    // [BUG #6406]
    var model = qx.data.marshal.Json.createModel(
      [{
        foo: "one"
      }, {
        foo: "two"
      }, {
        foo: "three"
      }], true
    );
    // first do a shift operation
    model.reverse();


    var handler = function(data) {
      // check the data
      assert.equal("drei", data.value);
      assert.equal("[0].foo", data.name);
      assert.equal("three", data.old);
    };

    var spy = sinonSandbox.spy(handler);
    model.on("changeBubble", spy, this);

    model.getItem(0).foo = ("drei");
  });


  it("UnshiftAndSet", function() {
    // [BUG #6406]
    var model = qx.data.marshal.Json.createModel(
      [{
        foo: "one"
      }, {
        foo: "two"
      }, {
        foo: "three"
      }], true
    );
    // first do a shift operation
    model.unshift(qx.data.marshal.Json.createModel({
      foo: "zero"
    }, true));


    var handler = function(data) {
      // check the data
      assert.equal("eins", data.value);
      assert.equal("[1].foo", data.name);
      assert.equal("one", data.old);
    };

    var spy = sinonSandbox.spy(handler);
    model.on("changeBubble", spy, this);

    model.getItem(1).foo = "eins";
  });


  it("SortAndSet", function() {
    // [BUG #6406]
    var model = qx.data.marshal.Json.createModel(
      [{
        foo: "one",
        n: 1
      }, {
        foo: "two",
        n: 2
      }, {
        foo: "three",
        n: 0
      }], true
    );

    // sort by number
    model.sort(function(a, b) {
      return a.n < b.n ? -1 : a.n > b.n ? 1 : 0;
    });


    var handler = function(data) {
      // check the data
      assert.equal("drei", data.value);
      assert.equal("[0].foo", data.name);
      assert.equal("three", data.old);
    };

    var spy = sinonSandbox.spy(handler);
    model.on("changeBubble", spy, this);

    model.getItem(0).foo = "drei";
  });


  it("SpliceAndSet", function() {
    // [BUG #6406]
    var model = qx.data.marshal.Json.createModel(
      [{
        foo: "one"
      }, {
        foo: "two"
      }, {
        foo: "three"
      }], true
    );
    // first do a shift operation
    model.splice(0, 0, qx.data.marshal.Json.createModel({
      foo: "zero"
    }, true));


    var handler = function(data) {
      // check the data
      assert.equal("eins", data.value);
      assert.equal("[1].foo", data.name);
      assert.equal("one", data.old);
    };

    var spy = sinonSandbox.spy(handler);
    model.on("changeBubble", spy, this);
    model.getItem(1).foo = ("eins");
  });
});
