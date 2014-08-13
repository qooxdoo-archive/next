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
 * This widget displays a tab bar.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var tabBar = new qx.ui.mobile.tabbar.TabBar();
 *   var tabButton1 = new qx.ui.mobile.tabbar.TabButton("Tab 1");
 *   tabButton1.view = view1;
 *   tabBar.add(tabButton1);
 *   var tabButton2 = new qx.ui.mobile.tabbar.TabButton("Tab 2");
 *   tabButton2.view = view2;
 *   tabBar.add(tabButton2);
 *
 *   this.getRoot.add(tabBar);
 * </pre>
 *
 * This example creates a tab bar and adds two tab buttons to it.
 */
qx.Bootstrap.define("qx.ui.mobile.tabbar.TabBar",
{
  extend : qx.ui.mobile.core.Widget,


 /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(qx.ui.mobile.core.Widget, "constructor");
    this._setLayout(new qx.ui.mobile.layout.HBox());
    this.on("tap", this._onTap, this);
  },




 /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "tabBar"
    },


    /**
     * Sets the selected tab.
     */
    selection :
    {
      check : "qx.ui.mobile.tabbar.TabButton",
      nullable : true,
      init : null,
      apply : "_applySelection",
      event : "changeSelection"
    }
  },




 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Event handler. Called when a tab event occurs.
     *
     * @param evt {qx.event.type.Tap} The event object
     */
    _onTap: function(evt) {
      var target = qx.ui.mobile.core.Widget.getWidgetById(evt.target.id);

      while (!(target instanceof qx.ui.mobile.tabbar.TabButton)) {
        if (target._getParentWidget) {
          var layoutParent = target._getParentWidget();
          if (!layoutParent || layoutParent instanceof qx.ui.mobile.tabbar.TabBar) {
            target = null;
            break;
          }
          target = layoutParent;
        } else {
          target = null;
          break;
        }
      }
      if (target !== null) {
        this.selection = target;
      }
    },


    // property apply
    _applySelection : function(value, old)
    {
      if (old) {
        old.removeClass("selected");
        if (old.view) {
          old.view.exclude();
        }
      }
      if (value) {
        value.addClass("selected");
        if (value.view) {
          value.view.show();
        }
      }
    },


    /**
     * Adds a tab button to the tab bar.
     *
     * @param button {qx.ui.mobile.tabbar.TabButton} The button to add
     */
    add : function(button)
    {
      button.layoutPrefs = {flex:1};
      this._add(button);
      if (!this.selection) {
        this.selection = button;
      }
      button.on("changeView", this._onChangeView, this);
    },


    /**
     * Event handler. Called when the view was changed.
     *
     * @param evt {qx.event.type.Data} The event
     */
    _onChangeView : function(data)
    {
      if (this.selection == data.target) {
        data.value.show();
      }
    },


    /**
     * Removes a tab button from the tab bar.
     *
     * @param button {qx.ui.mobile.tabbar.TabButton} The button to remove
     */
    remove : function(button)
    {
      this._remove(button);
      if (this.selection == button) {
        this.selection = null;
      }
      button.off("changeView", this._onChangeView, this);
    },


    dispose : function() {
      this.base(qx.ui.mobile.core.Widget, "dispose");
      this.off("tap", this._onTap, this);
    }
  }
});
