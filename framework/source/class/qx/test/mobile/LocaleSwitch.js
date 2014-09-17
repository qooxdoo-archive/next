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
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * @require(qxWeb)
 * @require(qx.module.Attribute)
 * @require(qx.module.Traversing)
 */

qx.Class.define("qx.test.mobile.LocaleSwitch",
{
  extend : qx.test.mobile.MobileTestCase,
  include : qx.locale.MTranslation,


  construct : function()
  {
    this.base(qx.test.mobile.MobileTestCase, "constructor");
    var manager = this.manager = qx.locale.Manager.getInstance();

    // add dummy translations
    manager.addTranslation("en_QX", {
      "test one": "test one",
      "test two": "test two",
      "test Hello %1!": "test Hello %1!",
      "test Jonny": "test Jonny"
    });
    manager.addTranslation("de_QX", {
      "test one": "Eins",
      "test two": "Zwei",
      "test Hello %1!": "Servus %1!",
      "test Jonny": "Jonathan"
    });
  },



  members :
  {
    setUp : function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.manager.locale = "en_QX";
    },


    testLabel : function()
    {
      var manager = qx.locale.Manager;

      var label = new qx.ui.mobile.basic.Label(manager.tr("test one"));
      this.getRoot().append(label);

      this.assertEquals("test one", label.value);
      this.manager.locale = "de_QX";
      this.assertEquals("Eins", label.value);
      this.manager.locale = "en_QX";

      label.value = manager.tr("test Hello %1!", manager.tr("test Jonny"));
      this.assertEquals("test Hello test Jonny!", label.value);
      this.manager.locale = "de_QX";
      this.assertEquals("Servus Jonathan!", label.value);

      // de -> en
      label.value = manager.tr("test two");
      this.assertEquals("Zwei", label.value);
      this.manager.locale = "en_QX";
      this.assertEquals("test two", label.value);

      label.dispose();
    },

    testList : function()
    {
      var manager = qx.locale.Manager;
      var list = new qx.ui.mobile.list.List({
        configureItem : function(item, data, row) {
          item.setTitle(data.title);
          item.setSubtitle(data.subTitle);
        }
      });

      var data = [
        {
          title: manager.tr("test one"),
          subTitle: manager.tr("test two")
        },
        {
          title: manager.tr("test Hello %1!", manager.tr("test Jonny")),
          subTitle: manager.tr("test Jonny")
        }
      ];

      list.model = new qx.data.Array(data);
      this.getRoot().append(list);

      this.__testListEn();

      this.manager.locale = "de_QX";
      var title0 = q(".list * .list-item-title").eq(0).getHtml();
      this.assertEquals("Eins". title0);
      var subtitle0 = q(".list * .list-item-subtitle").eq(0).getHtml();
      this.assertEquals("Zwei", subtitle0);
      var title1 = q(".list * .list-item-title").eq(1).getHtml();
      this.assertEquals("Servus Jonathan!", title1);
      var subtitle1 = q(".list * .list-item-subtitle").eq(1).getHtml();
      this.assertEquals("Jonathan", subtitle1);

      this.manager.locale = "en_QX";
      this.__testListEn();
    },

    __testListEn : function() {
      var title0 = q(".list * .list-item-title").eq(0).getHtml();
      this.assertEquals("test one". title0);
      var subtitle0 = q(".list * .list-item-subtitle").eq(0).getHtml();
      this.assertEquals("test two", subtitle0);
      var title1 = q(".list * .list-item-title").eq(1).getHtml();
      this.assertEquals("test Hello test Jonny!", title1);
      var subtitle1 = q(".list * .list-item-subtitle").eq(1).getHtml();
      this.assertEquals("test Jonny", subtitle1);
    },

    testFormRendererSingle : function()
    {
      var manager = qx.locale.Manager;

      var title = new qx.ui.mobile.form.Title(manager.tr("test one"));
      var form = new qx.ui.mobile.form.Form();
      form.add(new qx.ui.mobile.form.TextField(), manager.tr("test two"));

      this.getRoot().append(title);
      var renderer = new qx.ui.mobile.form.renderer.Single(form);
      this.getRoot().append(renderer);

      this.assertEquals("test one", title.value);
      this.assertEquals("test two", renderer._labels[0].value);
      this.manager.locale = "de_QX";
      this.assertEquals("Eins", title.value);
      this.assertEquals("Zwei", renderer._labels[0].value);
      this.manager.locale = "en_QX";

      title.dispose();
    }
  }
});
