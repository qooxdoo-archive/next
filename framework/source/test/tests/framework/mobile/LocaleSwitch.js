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

describe("mobile.LocaleSwitch", function()
{
  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
    //this.base(qx.test.mobile.MobileTestCase, "constructor");
    var manager = qx.locale.Manager.getInstance();

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

    beforeEach (function ()  {
     var manager = qx.locale.Manager.getInstance();

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
      setUpRoot();
      manager.locale = "en_QX";
    });
 
 it("Label", function() {
      var manager = qx.locale.Manager;
      var label = new qx.ui.mobile.basic.Label(manager.tr("test one"));
      getRoot().append(label);

      assert.equal("test one", label.value);
      manager.locale = "de_QX";
      assert.equal("Eins", label.value);
      manager.locale = "en_QX";

      label.value = manager.tr("test Hello %1!", manager.tr("test Jonny"));
      assert.equal("test Hello test Jonny!", label.value);
      manager.locale = "de_QX";
      assert.equal("Servus Jonathan!", label.value);

      // de -> en
      label.value = manager.tr("test two");
      assert.equal("Zwei", label.value);
      manager.locale = "en_QX";
      assert.equal("test two", label.value);

      label.dispose();
    });
  //test failed
 it("List", function() {
  
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
      getRoot().append(list);

      __ListEn();

      manager.locale = "de_QX";
      var title0 = q(".list * .list-item-title").eq(0).getHtml();
      assert.equal("Eins". title0);
      var subtitle0 = q(".list * .list-item-subtitle").eq(0).getHtml();
      assert.equal("Zwei", subtitle0);
      var title1 = q(".list * .list-item-title").eq(1).getHtml();
      assert.equal("Servus Jonathan!", title1);
      var subtitle1 = q(".list * .list-item-subtitle").eq(1).getHtml();
      assert.equal("Jonathan", subtitle1);

      manager.locale = "en_QX";
      __ListEn();
  });

  function __ListEn () {
      var title0 = q(".list * .list-item-title").eq(0).getHtml();
      assert.equal("test one". title0);
      var subtitle0 = q(".list * .list-item-subtitle").eq(0).getHtml();
      assert.equal("test two", subtitle0);
      var title1 = q(".list * .list-item-title").eq(1).getHtml();
      assert.equal("test Hello test Jonny!", title1);
      var subtitle1 = q(".list * .list-item-subtitle").eq(1).getHtml();
      assert.equal("test Jonny", subtitle1);
  };
  //test failed
  it("FormRendererSingle", function() {
      var manager = qx.locale.Manager;

      var title = new qx.ui.mobile.form.Title(manager.tr("test one"));
      var form = new qx.ui.mobile.form.Form();
      form.add(new qx.ui.mobile.form.TextField(), manager.tr("test two"));

      getRoot().append(title);
      var renderer = new qx.ui.mobile.form.renderer.Single(form);
      getRoot().append(renderer);

      assert.equal("test one", title.value);
      assert.equal("test two", renderer._labels[0].value);
      manager.locale = "de_QX";
      assert.equal("Eins", title.value);
      assert.equal("Zwei", renderer._labels[0].value);
      manager.locale = "en_QX";

      title.dispose();
    
  });
});
