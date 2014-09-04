qx.Bootstrap.define("qx.test.performance.oo.Definition",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MMeasure,

  members :
  {
    __duration: 200,

    testDefineBootstrap: function() {
      this.measureIterations("Define Bootstrap classes", null,
        function() {
          qx.Bootstrap.define(null, {
            extend: Object,
            properties: {
              a: {
                init: true,
                check: "Boolean",
                event: true
              },
              b: {
                nullable: true,
                apply: "applyB"
              }
            }
          });
        },
        null,
        this.__duration
      );
    },

    testDefineClass: function() {
      this.measureIterations("Define Classes", null,
        function() {
          qx.Bootstrap.define(null, {
            extend: Object,
            properties: {
              a: {
                init: true,
                check: "Boolean",
                event: true
              },
              b: {
                nullable: true,
                apply: "applyB"
              }
            }
          });
        },
        null,
        this.__duration
      );
    },

    testInstantiateBootstraps: function() {
      qx.Bootstrap.define("qx.test.performance.oo.A", {
        extend: Object,
        properties: {
          a: {
            init: true,
            check: "Boolean",
            event: true
          },
          b: {
            nullable: true,
            apply: "applyB"
          }
        }
      });

      this.measureIterations("Instantiate Bootstrap classes",
        null,
        function() {
          new qx.test.performance.oo.A();
        },
        null,
        this.__duration
      );

      delete qx.test.performance.oo.A;
    },

    testInstantiateClasses: function() {
      qx.Bootstrap.define("qx.test.performance.oo.A", {
        extend: Object,
        properties: {
          a: {
            init: true,
            check: "Boolean",
            event: true
          },
          b: {
            nullable: true,
            apply: "applyB"
          }
        }
      });
      this.measureIterations("Instantiate Classes",
        null,
        function() {
          new qx.test.performance.oo.A();
        },
        null,
        this.__duration
      );
      delete qx.test.performance.oo.A;
    }
  }
});