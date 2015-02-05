describe("module.Basic", function() {
  var initHook = function() {
    this.testInit = true;
  };

  beforeEach(function() {
    // attach a custom init function
    qxWeb.$attachInit(initHook);
  });


  afterEach(function() {
    qxWeb._init.splice(qxWeb._init.indexOf(initHook), 1);
  });


  it("InstanceOf", function() {
    var c = q.create("<div>");
    assert.isTrue(c instanceof q);
    c = q();
    assert.isTrue(c instanceof q);
  });


  it("Init", function() {
    var div = q.create("<div>");
    sandbox.append(div);
    // add a second element
    div.push(q.create("<div>")[0]);
    assert.isTrue(div.testInit);
    assert.equal(2, div.length);

    assert.isTrue(div.filter(function() {
      return true;
    }).testInit);
    assert.equal(2, div.filter(function() {
      return true;
    }).length);

    assert.isTrue(div.concat().testInit);
    assert.equal(2, div.concat().length);
    assert.equal(4, div.concat(div.concat()).length);

    assert.isTrue(div.slice(0).testInit);
    assert.equal(2, div.slice(0).length);
    assert.equal(1, div.slice(1).length);
    assert.equal(0, div.slice(0, 0).length);
    assert.equal(1, div.slice(0, 1).length);

    var clone = div.clone().splice(0, 2);
    assert.isTrue(clone.testInit);
    assert.equal(2, clone.length);

    assert.isTrue(div.map(function(i) {
      return i;
    }).testInit);
    assert.equal(2, div.map(function(i) {
      return i;
    }).length);
  });


  it("NoConflict", function() {
    assert.equal(q, qxWeb);
  });
});
