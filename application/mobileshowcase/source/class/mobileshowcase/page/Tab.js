"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Mobile page responsible for showing the "tab" showcase.
 */
qx.Class.define("mobileshowcase.page.Tab",
{
  extend : mobileshowcase.page.Abstract,


  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "constructor");
    this.title = "Tabs";
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");

      this.getContent()
        .append(this.__createTabBar())
        .append(this.__createAlignmentSwitch())
        .append(this.__createResponsiveToggle());
    },


    __createTabBar: function() {
      var group = new qx.ui.form.Group();

      var tabBar = this.__tabBar = new qx.ui.tabbar.TabBar()
        .set({mediaQuery: "(min-width: 750px) and (orientation: landscape)"});

      new qx.ui.Button("Desktop")
        .setData("qxConfigPage", "#page_v1")
        .addClass("selected")
        .appendTo(tabBar);
      new qx.ui.basic.Label("<b>qx.Desktop</b><br/><br/>Create desktop oriented applications. Features a rich and extendable set of widgets. No HTML/CSS knowledge required.")
        .setAttribute("id", "page_v1")
        .addClass("view1")
        .appendTo(tabBar);

      new qx.ui.Button("Mobile")
        .setData("qxConfigPage", "#page_v2")
        .appendTo(tabBar);
      new qx.ui.basic.Label("<b>qx.Mobile</b><br/><br/>Create mobile apps that run on all major mobile operating systems, without writing any HTML.")
        .setAttribute("id", "page_v2")
        .addClass("view2")
        .appendTo(tabBar);

      new qx.ui.Button("Server")
        .setData("qxConfigPage", "#page_v3")
        .appendTo(tabBar);
      new qx.ui.basic.Label("<b>qx.Server</b><br/><br/>Use the same OOP pattern known from the client side, reuse code and generate files you can deploy in your server environment.")
        .setAttribute("id", "page_v3")
        .addClass("view3")
        .appendTo(tabBar);

      new qx.ui.Button("Website")
        .setData("qxConfigPage", "#page_v4")
        .appendTo(tabBar);
      new qx.ui.basic.Label("<b>qx.Website</b><br/><br/>A cross-browser DOM manipulation library to enhance websites with a rich user experience.")
        .setAttribute("id", "page_v4")
        .addClass("view4")
        .appendTo(tabBar);

      return group.append(tabBar);
    },

    __createAlignmentSwitch: function() {
      var group = new qx.ui.form.Group("Tab Button alignment (Horizontal mode only)");

      var rbGroup = new qx.ui.form.Group()
        .set({allowEmptySelection: true});

      ["Left", "Justify", "Right"].forEach(function(alignment) {
        var rb = new qx.ui.form.RadioButton()
          .setAttribute("name", alignment.toLowerCase());
        if (alignment.toLowerCase() === this.__tabBar.align) {
          rb.value = true;
        }
        rbGroup.add(rb);

        new qx.ui.form.Row(rb, alignment)
          .appendTo(group);
      }.bind(this));

      rbGroup.on("changeSelection", function(e) {
        this.__tabBar.align = e.value[0].getAttribute("name");
      }.bind(this));

      return group;
    },

    __createResponsiveToggle: function() {
      var group = new qx.ui.form.Group("Responsive Mode");

      var infoText = new qx.ui.Widget()
        .setHtml("In responsive mode, the TabBar dynamically switches between horizontal and vertical orientation based on the change events from a configurable CSS media query listener.<br>Resize your browser or change your device's orientation to test this feature.");
      var infoRow = new qx.ui.form.Row(infoText)
        .appendTo(group);

      var toggle = new qx.ui.form.ToggleButton(true, "ON", "OFF")
        .on("changeValue", function(e) {
          if (e.value) {
            this.__tabBar.mediaQuery = this.__query.value;
          } else {
            this.__tabBar.mediaQuery = null;
          }
        }, this);
      var toggleRow = new qx.ui.form.Row(toggle, "Active")
        .appendTo(group);

      var query = this.__query = new qx.ui.form.TextField()
        .set({value: this.__tabBar.mediaQuery});
      qx.data.SingleValueBinding.bind(query, "value", this.__tabBar, "mediaQuery");

      var queryRow = new qx.ui.form.Row(query, "Media Query")
        .appendTo(group);

      return group;
    }
  }
});
