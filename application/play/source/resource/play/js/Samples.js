Samples = {
  "sample Hello World" : function() {
    var page = new qx.ui.page.NavigationPage();
    page.title = ("Hello World");
    page.on("initialize", function() {
      var button = new qx.ui.Button("First Button");
      page.getContent().append(button);

      button.on("tap", function() {
        alert("Hello World");
      }, this);
    },this);

    (new qx.ui.page.Manager(false)).addDetail(page);

    page.show();
  },

  "sample Button" : function() {
    q.create("<button>")
      .toButton("First Button")
      .appendTo(this.getRoot());
  },


  "sample Pages" : function() {
    // Page 1
    var page1 = new qx.ui.page.NavigationPage();
    page1.title = ("Page 1");
    page1.on("initialize", function() {
      var button = new qx.ui.Button("Next Page");
      page1.getContent().append(button);

      button.on("tap", function() {
        page2.show();
      }, this);
    },this);

    // Page 2
    var page2 = new qx.ui.page.NavigationPage();
    page2.title = "Page 2";
    page2.showBackButton = true;
    page2.backButtonText = "Back";

    page2.on("initialize", function() {
      var label = new qx.ui.basic.Label("Content of Page 2");
      page2.getContent().append(label);
    },this);

    page2.on("back", function() {
      page1.show({reverse:true});
    }, this);

    (new qx.ui.page.Manager(false)).addDetail([page1,page2]);

    page1.show();
  },


  /**
   * @lint ignoreDeprecated(alert)
   */
  "sample List" : function() {
    var group = new qx.ui.form.Group("List").appendTo(this.getRoot());
    var list = new qx.ui.List();
    list.delegate = {group: function(data, row) {
      return {
        title: (row < 5) ? "A" : "B",
        selectable: true
      };
    }};

    var data = [];
    for (var i=0; i < 10; i++) {
      data.push({
        title:"Item" + i,
        subtitle:"Subtitle for Item #" + i,
        selectable : !!(i % 2),
        showArrow : !!(i % 2)
      });
    }

    list.model = new qx.data.Array(data);
    list.on("selected", function(el) {
      var row = el.getData("row");
      var group = el.getData("group");
      alert("Item Selected #" + (row || group));
    }, this);

    list.appendTo(group);
  },


  "sample List (folding)" : function() {
    var group = new qx.ui.form.Group("Tap group header to collapse")
      .appendTo(this.getRoot());

    var list = new qx.ui.List();
    list.delegate = {group: function(data, row) {
      return {
        title: (row < 5) ? "A" : "B",
        selectable: true
      };
    }};

    var data = [];
    for (var i=0; i < 10; i++) {
      data.push({
        title:"Item " + i,
        selectable: false
      });
    }

    list.model = new qx.data.Array(data);
    list.on("selected", function(el) {
      var items = el.getNextUntil(".group-item");
      if (el.getProperty("items")) {
        el.getProperty("items").insertAfter(el);
        el.setProperty("items", null);
      } else {
        el.setProperty("items", items);
        items.remove();
      }
    }, this);

    list.appendTo(group);
  },


  "sample Form" : function() {
    var form = new qx.ui.form.Form().appendTo(this.getRoot());

    var user = new qx.ui.form.TextField();
    user.required = true;
    new qx.ui.form.Row(user, "Username")
      .appendTo(form);

    var pwd = new qx.ui.form.PasswordField();
    pwd.required = true;
    new qx.ui.form.Row(pwd, "Password")
      .appendTo(form);

    // login button
    var button = new qx.ui.Button("Login");
    this.getRoot().append(button);

    button.on("tap", function() {
      if (form.validate()) {
        alert("Loggin in " + user.value);
      }
    }, this);
  },

  "sample Calendar with selection" : function() {
    qx.Class.define("DateSelector", {

      extend: qx.ui.control.Calendar,

      members: {
        _selected: null,

        showDate: function(date) {
          this.super(qx.ui.control.Calendar, "showDate", date);
          if (this._selected) {
            this.find("." + this.defaultCssClass + "-day").forEach(function(el) {
              if (el.getAttribute("value") == this._selected) {
                qxWeb(el).getParents().addClass("selected");
              }
            }.bind(this));
          }
        },

        _selectDay : function(e) {
          this.super(qx.ui.control.Calendar, "_selectDay", e);
          this.find("td").removeClass("selected");
          qxWeb(e.target).getParents().addClass("selected");
          this._selected = e.target.getAttribute("value");
        }
      }
    });

    new DateSelector().appendTo(this.getRoot());
  }
};