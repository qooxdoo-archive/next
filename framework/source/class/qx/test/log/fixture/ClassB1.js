qx.Bootstrap.define("qx.test.log.fixture.ClassB1",
{
  extend : qx.test.log.fixture.ClassA,

  members :
  {
    _applyOldProperty: function () {
      this.base(qx.test.log.fixture.ClassA, "_applyOldProperty");

      this._callCountApplyOldProperty++;
    },

    _applyNewProperty: function () {
      this.base(qx.test.log.fixture.ClassA, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});
