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

qx.Bootstrap.define("qx.test.locale.Locale",
{
  extend : qx.dev.unit.TestCase,
  include : qx.locale.MTranslation,

  members :
  {
    __defaultLocale : null,
    __listenerId : null,

    setUp : function() {
      var manager = qx.locale.Manager.getInstance();
      this.__defaultLocale = manager.locale;
    },


    tearDown : function() {
      var manager = qx.locale.Manager.getInstance();
      manager.locale = this.__defaultLocale;
      if (this.__listenerId) {
        manager.offById(this.__listenerId);
      }
    },


    testTranslation : function()
    {
      this.assertNotUndefined(qx.locale.Manager);
      var manager = qx.locale.Manager.getInstance();

      // add dummy translations
      manager.addTranslation("en_QX", {
        "test one": "test one",
        "test two": "test two",
        "test Hello %1!": "test Hello %1!",
        "test Jonny": "test Jonny",
        "test one car": "test one car",
        "test %1 cars": "test %1 cars"
      });
      manager.addTranslation("de_QX", {
        "test one": "Eins",
        "test two": "Zwei",
        "test Hello %1!": "Servus %1!",
        "test Jonny": "Jonathan",
        "test one car": "Ein Auto",
        "test %1 cars": "%1 Autos"
      });
      manager.locale = "en_QX";

      this.assertEquals("en", manager.getLanguage());
      this.assertEquals("QX", manager.getTerritory());

      // tr(): simple case
      var one = this.tr("test one");
      this.assertEquals("test one", one);

      // tr(): format string
      var hello = this.tr("test Hello %1!", "Fabian");
      this.assertEquals("test Hello Fabian!", hello);

      // tr(): format string with translated arguments
      var hiJonny = this.tr("test Hello %1!", this.tr("test Jonny"));
      this.assertEquals("test Hello test Jonny!", hiJonny);

      // trn(): plural
      var car = this.trn("test one car", "test %1 cars", 0, 0);
      this.assertEquals("test 0 cars", car);

      car = this.trn("test one car", "test %1 cars", 1);
      this.assertEquals("test one car", car);

      var cars = this.trn("test one car", "test %1 cars", 5, 5);
      this.assertEquals("test 5 cars", cars);

      // trc(): comments
      one = this.trc("comment simple", "test one");
      this.assertEquals("test one", one);
      hello = this.trc("comment format", "test Hello %1!", "Fabian");
      this.assertEquals("test Hello Fabian!", hello);
      hiJonny = this.trc("comment format args", "test Hello %1!", this.tr("test Jonny"));
      this.assertEquals("test Hello test Jonny!", hiJonny);

      // trnc(): comments and plural
      car = this.trnc("comment count 0", "test one car", "test %1 cars", 0, 0);
      this.assertEquals("test 0 cars", car);
      car = this.trnc("comment count 1", "test one car", "test %1 cars", 1);
      this.assertEquals("test one car", car);
      cars = this.trnc("comment count 5", "test one car", "test %1 cars", 5, 5);
      this.assertEquals("test 5 cars", cars);

      // check listener
      var fired = false;
      var evtLocale = "";
      var onChangeLocale = function(locale) {
        fired = true;
        evtLocale = locale;
      };
      manager.on("changeLocale", onChangeLocale);
      this.__listenerId = manager.getListenerId();

      // change locale
      manager.locale = "de_QX";
      this.assertTrue(fired);
      this.assertEquals("de_QX", evtLocale);


      // simple case
      one = one.translate();
      this.assertEquals("Eins", one);

      // format string
      hello = hello.translate();
      this.assertEquals("Servus Fabian!", hello);

      // format string with translated arguments
      hiJonny = hiJonny.translate();
      this.assertEquals("Servus Jonathan!", hiJonny);

      // plural
      car = car.translate();
      this.assertEquals("Ein Auto", car);

      cars = cars.translate();
      this.assertEquals("5 Autos", cars);

      manager.off("changeLocale", onChangeLocale);
    },


    testInvalidMessage : function()
    {
      this.assertNotUndefined(qx.locale.Manager);
      var manager = qx.locale.Manager.getInstance();

      // add dummy translations
      manager.addTranslation("en_QX", {
        "test one": "one!",
        "test two": "two!"
      });
      manager.addTranslation("de_QX", {
        "test one": "Eins!",
        "test two": "Zwei!"
      });
      manager.locale = "en_QX";

      var textField = new qx.ui.mobile.form.TextField();
      textField.invalidMessage = this.tr("test one");
      textField.requiredInvalidMessage = this.tr("test two");

      this.assertEquals("one!", textField.invalidMessage);
      this.assertEquals("two!", textField.requiredInvalidMessage);

      manager.locale = "de_QX";

      this.assertEquals("Eins!", textField.invalidMessage);
      this.assertEquals("Zwei!", textField.requiredInvalidMessage);
      textField.dispose();
    },


    testMacCtrl : function()
    {
      // check if the translation is working
      this.assertEquals("Links", qx.locale.Key.getKeyName("short", "Left", "de_DE"));
      // is the localized version
      if (qx.core.Environment.get("os.name") == "osx") {
        // there is no strg on macs, onls ctrl
        this.assertEquals("Ctrl", qx.locale.Key.getKeyName("short", "Control", "de_DE"));
        this.assertEquals("Control", qx.locale.Key.getKeyName("full", "Control", "de_DE"));
      } else {
        this.assertEquals("Strg", qx.locale.Key.getKeyName("short", "Control", "de_DE"));
        this.assertEquals("Steuerung", qx.locale.Key.getKeyName("full", "Control", "de_DE"));
      }
    },

    testResetLocale : function()
    {
      var locale = qx.core.Environment.get("locale");
      var variant = qx.core.Environment.get("locale.variant");
      if (variant !== "") {
        locale += "_" + variant;
      }

      var manager = qx.locale.Manager.getInstance();
      var oldLocale = manager.locale;
      manager.addTranslation("en_QX", {
        "test one": "one!",
        "test two": "two!"
      });
      manager.locale = "en_QX";

      // try the reset of the locale
      manager.locale = undefined;
      this.assertEquals(null, manager.locale);

      // make sure we set the locale which was there before the test
      manager.locale = oldLocale;
    }

  }
});
