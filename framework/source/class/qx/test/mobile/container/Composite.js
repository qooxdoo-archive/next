/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Bootstrap.define("qx.test.mobile.container.Composite",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testAdd : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      this._assertChildren(composite, 2);

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testAddSame : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);
      composite.append(widget1);

      this._assertChildren(composite, 1);

      widget1.dispose();
      composite.dispose();
    },


    testAddOther : function()
    {
      var composite1 = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite1);
      var composite2 = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite2);

      var widget = new qx.ui.mobile.core.Widget();
      composite1.append(widget);

      this._assertChildren(composite1, 1);

      composite2.append(widget);

      this._assertChildren(composite1, 0);
      this.assertFalse(composite1[0].hasChildNodes());

      this._assertChildren(composite2, 1);
      this.assertEquals(composite2[0], widget[0].parentNode);

      widget.dispose();
      composite1.dispose();
      composite2.dispose();
    },


    testAddAt : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      var widget3 = new qx.ui.mobile.core.Widget();
      composite.addAt(widget3, 1);

      this.assertEquals(composite.indexOf(widget3), 1);

      this.assertEquals(composite[0].childNodes[1], widget3[0]);

      widget1.dispose();
      widget2.dispose();
      widget3.dispose();
      composite.dispose();
    },


    testAddBefore : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      if (qx.core.Environment.get("qx.debug"))
      {
        this.assertException(function() {
           widget2.insertBefore(widget3);
        });
      }

      var widget3 = new qx.ui.mobile.core.Widget();
      widget3.insertBefore(widget2);

      this.assertEquals(composite.indexOf(widget3), 1);

      this.assertEquals(composite[0].childNodes[1], widget3[0]);

      widget1.dispose();
      widget2.dispose();
      widget3.dispose();
      composite.dispose();
    },


    testAddAfter : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      if (qx.core.Environment.get("qx.debug"))
      {
        this.assertException(function() {
           composite.insertAfter(widget2, widget3);
        });
      }

      var widget3 = new qx.ui.mobile.core.Widget();

      widget3.insertAfter(widget2);

      this.assertEquals(composite.indexOf(widget3), 2);

      this.assertEquals(composite[0].childNodes[2], widget3[0]);

      widget3.remove();

      widget3.insertAfter(widget1);

      this.assertEquals(composite[0].childNodes[1], widget3[0]);

      widget1.dispose();
      widget2.dispose();
      widget3.dispose();
      composite.dispose();
    },


    testDestroy : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      this._assertChildren(composite, 2);

      widget1.dispose();
      widget2.dispose();

      this._assertChildren(composite, 0);

      composite.dispose();
    },


    testRemove : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      this._assertChildren(composite, 2);

      widget1.remove();
      this._assertChildren(composite, 1);

      widget2.remove();
      this._assertChildren(composite, 0);

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testRemoveAt : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      this.assertException(function() {
         composite.removeAt(1);
      });

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      var widget3 = new qx.ui.mobile.core.Widget();
      composite.append(widget3);

      this._assertChildren(composite, 3);

      composite.removeAt(1);
      this._assertChildren(composite, 2);

      this.assertEquals(widget1[0], composite.getChildren()[0]);
      this.assertEquals(widget3[0], composite.getChildren()[1]);

      widget1.dispose();
      widget2.dispose();
      widget3.dispose();
      composite.dispose();
    },


    testRemoveAll : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      this._assertChildren(composite, 2);

      composite.removeAll();
      this._assertChildren(composite, 0);

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testHasChildren : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      this.assertEquals(0, composite.getChildren().length);

      var widget = new qx.ui.mobile.core.Widget();
      composite.append(widget);

      this.assertTrue(composite.getChildren().length > 0);

      widget.dispose();

      this.assertEquals(0, composite.getChildren().length);

      composite.dispose();
    },


    testIndexOf : function()
    {
      var composite = new qx.ui.mobile.core.Widget();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.append(widget2);

      this.assertNumber(composite.indexOf(widget1));
      this.assertEquals(composite.indexOf(widget1), 0);
      this.assertNumber(composite.indexOf(widget2));
      this.assertEquals(composite.indexOf(widget2), 1);

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    _assertChildren : function(composite, number)
    {
      var children = composite.getChildren();
      this.assertNotNull(children);
      var length = children.length;
      this.assertEquals(length, number);
      length = composite[0].childNodes.length;
      this.assertEquals(length, number);
    }

  }

});
