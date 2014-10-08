 describe('Basic', function() {

  beforeEach (function () {
    globalSetup();
  });
  afterEach (function () {
    globalTeardown();
  });
  
  it("InstanceOf", function() {
    var c = q.create("<div>");
    assert.isTrue(c instanceof q);
    c = q();
    assert.isTrue(c instanceof q);
  });
 
  it("Init", function() {

    sandbox = q.create("<div id='sandbox'></div>");
    // add a second element
    sandbox.push(q.create("<div>")[0]);

    assert.isTrue(sandbox.testInit);
    assert.equal(2, sandbox.length);

    assert.isTrue(sandbox.filter(function() {return true;}).testInit);
    assert.equal(2, sandbox.filter(function() {return true;}).length);

    assert.isTrue(sandbox.concat().testInit);
    assert.equal(2, sandbox.concat().length);
    assert.equal(4, sandbox.concat(sandbox.concat()).length);

    assert.isTrue(sandbox.slice(0).testInit);
    assert.equal(2, sandbox.slice(0).length);
    assert.equal(1, sandbox.slice(1).length);
    assert.equal(0, sandbox.slice(0,0).length);
    assert.equal(1, sandbox.slice(0,1).length);

    var clone = sandbox.clone().splice(0, 2);
    assert.isTrue(clone.testInit);
    assert.equal(2, clone.length);

    assert.isTrue(sandbox.map(function(i) {return i;}).testInit);
    assert.equal(2, sandbox.map(function(i) {return i;}).length);
  });
 
  it("Dependencies", function() {
    if (q.$$qx.core.Environment.get("qx.debug")) {
      //this.skip("Only reasonable in non-debug version.");
      return;
    }
    assert.isUndefined(q.$$qx.Class, "Class");
    assert.isUndefined(q.$$qx.Interface, "Interface");
    assert.isUndefined(q.$$qx.Mixin, "Mixin");
    assert.isUndefined(q.$$qx.core.Assert, "Assert");
    if (q.$$qx.event) {
      assert.isUndefined(q.$$qx.event.Registration, "event.Registration");
    }
  });
 
  it("NoConflict", function() {
    assert.equal(q, qxWeb);
  });
 }); 