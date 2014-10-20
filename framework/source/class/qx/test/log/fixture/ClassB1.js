qx.Class.define("qx.test.log.fixture.ClassB1",
{
  extend : qx.test.log.fixture.ClassA,

  members :
  {
    _applyOldProperty: function () {
      this.super(qx.test.log.fixture.ClassA, "_applyOldProperty");

      this._callCountApplyOldProperty++;
    },

    _applyNewProperty: function () {
      this.super(qx.test.log.fixture.ClassA, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});
