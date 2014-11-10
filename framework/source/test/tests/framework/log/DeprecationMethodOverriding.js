describe("log.DeprecationMethodOverriding", function ()
{

  var __lastWarnMsg = null;
  var __orgWarnMesthod = null;
  var __orgTraceMesthod = null;

  beforeEach (function ()  {
    __orgWarnMesthod = qx.log.Logger.warn;
    __orgTraceMesthod = qx.log.Logger.trace;

    qx.log.Logger.warn = function(msg) {
      __lastWarnMsg = msg;
    };
    qx.log.Logger.trace = function() {};
  });


  afterEach (function ()  {
    qx.log.Logger.warn = __orgWarnMesthod;
    qx.log.Logger.trace = __orgTraceMesthod;
    __orgWarnMesthod = null;
    __orgTraceMesthod = null;
    __lastWarnMsg = null;
  });


  it("ClassA: baseclass", function() {
    var instance = new log.fixture.ClassA();
    __test(instance, 1, 1, null);
  });


  it("ClassB1: overrides method", function() {
    var instance = new log.fixture.ClassB1();
    __test(instance, 2, 2, /log.fixture.ClassB1.prototype._applyOldProperty()/);
  });


  it("ClassC1: doesn't override method", function() {
    var instance = new log.fixture.ClassC1();
    __test(instance, 2, 3, /log.fixture.ClassB1.prototype._applyOldProperty()/);
  });


  it("ClassB2: doesn't override method", function() {
    var instance = new log.fixture.ClassB2();
    __test(instance, 1, 2, null);
  });


  it("ClassC2: overrides method", function() {
    var instance = new log.fixture.ClassC2();
    __test(instance, 2, 3, /log.fixture.ClassC2.prototype._applyOldProperty()/);
  });


  function __test(instance, callCountOldProperty, callCountNewProperty, reqExpWarnMsg)
  {
    instance.oldProperty = "Jo";
    instance.newProperty = "Do";

    assert.equal(callCountOldProperty, instance.getCallCountApplyOldProperty());
    assert.equal(callCountNewProperty, instance.getCallCountApplyNewProperty());

    if (qx.core.Environment.get("qx.debug"))
    {
      if (reqExpWarnMsg) {
        assert.isTrue(reqExpWarnMsg.test(__lastWarnMsg));
      } else {
        assert.isNull(__lastWarnMsg);
      }
    }
  }
});


qx.Class.define("log.fixture.ClassA",
{
  extend : Object,

  construct : function()
  {
    this._callCountApplyOldProperty = 0;
    this._callCountApplyNewProperty = 0;

    qx.log.Logger.deprecateMethodOverriding(this, log.fixture.ClassA, "_applyOldProperty");
  },

  properties :
  {
    oldProperty : {
      init : "oldProperty",
      apply : "_applyOldProperty"
    },

    newProperty : {
      init : "newProperty",
      apply : "_applyNewProperty"
    }
  },

  members :
  {
    _callCountApplyOldProperty : null,
    _callCountApplyNewProperty : null,

    _applyOldProperty : function () {
      this._callCountApplyOldProperty++;
    },

    _applyNewProperty : function () {
      this._callCountApplyNewProperty++;
    },

    getCallCountApplyOldProperty : function () {
      return this._callCountApplyOldProperty;
    },

    getCallCountApplyNewProperty : function () {
      return this._callCountApplyNewProperty;
    }
  }
});


qx.Class.define("log.fixture.ClassB1",
{
  extend : log.fixture.ClassA,

  members :
  {
    _applyOldProperty: function () {
      this.super(log.fixture.ClassA, "_applyOldProperty");

      this._callCountApplyOldProperty++;
    },

    _applyNewProperty: function () {
      this.super(log.fixture.ClassA, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});


qx.Class.define("log.fixture.ClassB2",
{
  extend : log.fixture.ClassA,

  members :
  {
    _applyNewProperty: function () {
      this.super(log.fixture.ClassA, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});


qx.Class.define("log.fixture.ClassC1",
{
  extend : log.fixture.ClassB1,

  members :
  {
    _applyNewProperty: function () {
      this.super(log.fixture.ClassB1, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});


qx.Class.define("log.fixture.ClassC2",
{
  extend : log.fixture.ClassB2,

  members :
  {
    _applyOldProperty: function () {
      this.super(log.fixture.ClassB2, "_applyOldProperty");

      this._callCountApplyOldProperty++;
    },

    _applyNewProperty: function () {
      this.super(log.fixture.ClassB2, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});