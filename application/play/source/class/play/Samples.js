/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */


/**
 * @ignoreDeprecated(alert)
 */
qx.Bootstrap.define("play.Samples",
{
  extend : qx.data.Array,

  construct : function() {
    this.base(qx.data.Array, "constructor");

    for (var name in this) {
      if (name.indexOf("sample") === 0) {
        name = name.replace("sample ", "");
        this.push(name);
      }
    }
  },

  members : {

    getCode : function(name) {
      var fn = this["sample " + name];
      var code = fn.toString();
      code = code.split("\n");
      code.shift(); // remove first line
      code.pop(); // remove last line
      var startingWhitespace = code[0].match(/^\s{0,20}/)[0].length;
      for (var i = 0; i < code.length; i++) {
        code[i] = code[i].substring(startingWhitespace, code[i].length);
      }
      return code.join("\n");
    },


    /**
     * @lint ignoreDeprecated(alert)
     */
    "sample Hello World" : function() {
      var page = new qx.ui.mobile.page.NavigationPage();
      page.title = ("Hello World");
      page.on("initialize", function() {
        var button = new qx.ui.mobile.form.Button("First Button");
        page.getContent().append(button);

        button.on("tap", function() {
          alert("Hello World");
        }, this);
      },this);

      this.getManager().addDetail(page);

      page.show();
    },


    "sample Pages" : function() {
      // Page 1
      var page1 = new qx.ui.mobile.page.NavigationPage();
      page1.title = ("Page 1");
      page1.on("initialize", function() {
        var button = new qx.ui.mobile.form.Button("Next Page");
        page1.getContent().append(button);

        button.on("tap", function() {
          page2.show();
        }, this);
      },this);

      // Page 2
      var page2 = new qx.ui.mobile.page.NavigationPage();
      page2.title = "Page 2";
      page2.showBackButton = true;
      page2.backButtonText = "Back";

      page2.on("initialize", function() {
        var label = new qx.ui.mobile.basic.Label("Content of Page 2");
        page2.getContent().append(label);
      },this);

      page2.on("back", function() {
        page1.show({reverse:true});
      }, this);

      this.getManager().addDetail([page1,page2]);

      page1.show();
    },


    /**
     * @lint ignoreDeprecated(alert)
     */
    "sample List" : function() {
      var page = new qx.ui.mobile.page.NavigationPage();
      page.title = "List";
      page.on("initialize", function() {
        // List creation
        var list = new qx.ui.mobile.list.List({
          configureItem : function(item, data, row) {
            item.setTitle(row<4 ? ("Selectable " + data.title) : data.title);
            item.setSubtitle(data.subTitle);
            item.selectable = row < 4;
            item.showArrow = row < 4;
          }
        });

        // Create the data
        var data = [];
        for (var i=0; i < 50; i++) {
          data.push({title:"Item" + i, subTitle:"Subtitle for Item #" + i});
        }

        list.model = new qx.data.Array(data);
        list.on("changeSelection", function(index) {
          alert("Item Selected #" + index);
        }, this);

        page.getContent().append(list);
      },this);

      this.getManager().addDetail(page);

      page.show();
    },


    /**
     * @lint ignoreDeprecated(alert)
     */
    "sample Form" : function() {
      var form = new qx.ui.mobile.form.Form();

      // User name
      var user = new qx.ui.mobile.form.TextField();
      user.required = true;
      form.add(user, "Username");

      // Password
      var pwd = new qx.ui.mobile.form.PasswordField();
      pwd.required = true;
      form.add(pwd, "Password");

      // Use form renderer
      this.getRoot().append(new qx.ui.mobile.form.renderer.Single(form));

      // login button
      var button = new qx.ui.mobile.form.Button("Login");
      this.getRoot().append(button);

      button.on("tap", function() {
        if (form.validate()) {  // use form validation
          alert("Loggin in " + user.getValue());
        }
      }, this);
    }
  }
});