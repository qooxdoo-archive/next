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

/**
 * @ignore(qx.test.propA, qx.test.propB)
 */

qx.Bootstrap.define("qx.test.util.PropertyUtil",
{
  extend : qx.test.mobile.MobileTestCase,


  members :
  {
    setUp : function()
    {
      this.button = new qx.ui.mobile.form.Button();
      this.getRoot().add(this.button);
    },


    tearDown : function() {
      this.base(qx.test.mobile.MobileTestCase, "tearDown");
      this.button.remove().dispose();
    },


    testGetProperties : function()
    {
      qx.Bootstrap.define("qx.test.propA", {
        extend : Object,
        properties : {
          a : {}
        }
      });

      qx.Bootstrap.define("qx.test.propB", {
        extend : qx.test.propA,
        properties : {
          b : {}
        }
      });

      // check getProperties
      this.assertKeyInMap("a", qx.util.PropertyUtil.getProperties(qx.test.propA));
      this.assertKeyInMap("b", qx.util.PropertyUtil.getProperties(qx.test.propB));

      // check getAllProperties
      this.assertKeyInMap("a", qx.util.PropertyUtil.getAllProperties(qx.test.propB));
      this.assertKeyInMap("b", qx.util.PropertyUtil.getAllProperties(qx.test.propB));

      delete qx.test.propB;
      delete qx.test.propA;
    }
  }
});
