qx.Class.define("qx.test.log.fixture.ClassC2",
{
  extend : qx.test.log.fixture.ClassB2,

  members :
  {
    _applyOldProperty: function () {
      this.base(qx.test.log.fixture.ClassB2, "_applyOldProperty");

      this._callCountApplyOldProperty++;
    },

    _applyNewProperty: function () {
      this.base(qx.test.log.fixture.ClassB2, "_applyNewProperty");

      this._callCountApplyNewProperty++;
    }
  }
});
