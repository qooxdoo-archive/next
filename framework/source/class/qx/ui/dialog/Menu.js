"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * This widget displays a menu. A dialog menu extends a popup and contains a
 * list, which provides the user the possibility to select one value.
 * The selected value is identified through selected index.
 * @require(qx.module.DataBinding)
 */
qx.Class.define("qx.ui.dialog.Menu",
{
  extend : qx.ui.dialog.Popup,


  /**
   * @param itemsModel {qx.data.Array ?}, the model which contains the choosable items of the menu.
   * @param anchor {qx.ui.Widget ?} The anchor widget for this item. If no anchor is available, the menu will be displayed modal and centered on screen.
   * @attach {qxWeb, toMenu}
   * @return {qx.ui.dialog.Menu} The new dialog menu widget.
   */
  construct : function(itemsModel, anchor) {
    this.__list = this._createList();

    this.__menuContainer = new qx.ui.Widget();
    this.__listScroller = this._createListScroller(this.__list);

    this.__menuContainer.append(this.__listScroller);

    this.super(qx.ui.dialog.Popup, "constructor", this.__menuContainer, anchor);

    qxWeb.data.bind(this, "model", this.__list, "model");
    this.model = itemsModel;

    this.modal = !!anchor;
  },


  events :
  {
    /**
     * Fired when the selection is changed.
     */
    selected : "qxWeb"
  },


  properties :
  {
    // overridden
    defaultCssClass : {
      init : "menu"
    },


    /**
     * The model to use to render the list.
     */
    model :
    {
      check : "qx.data.Array",
      event: true,
      nullable : true,
      init : null
    },


    /**
    * This value defines how many list items are visible inside the menu.
    */
    visibleListItems :
    {
      check : "Number",
      apply : "_updatePosition",
      nullable : true
    }
  },


  members :
  {
    __list: null,
    __listScroller : null,
    __menuContainer : null,


    /**
     * Creates the scroll container for the selectionList. Override this to customize the widget.
     * @param selectionList {qx.ui.list.List} The selectionList of this menu.
     * @return {qx.ui.container.Scroll} the scroll container which contains the selectionList of this menu.
     */
    _createListScroller : function(selectionList) {
      var listScroller = new qx.ui.container.Scroll({"snap":".list-item"});
      selectionList.layoutPrefs = {flex: 1};
      listScroller.append(selectionList);
      listScroller.addClass("menu-scroller");
      return listScroller;
    },


    // overridden
    _updatePosition : function() {
      var parentHeight = this._getParentWidget().getHeight();
      var listScrollerHeight = parseInt(parentHeight, 10) * 0.75;
      listScrollerHeight = parseInt(listScrollerHeight,10);

      if (this.visibleListItems !== null) {
        var newListScrollerHeight = this.__list.getListItemHeight() * this.visibleListItems;
        listScrollerHeight = Math.min(newListScrollerHeight, listScrollerHeight);
      }

      this.__listScroller.setStyle("maxHeight", listScrollerHeight + "px");

      this.super(qx.ui.dialog.Popup, "_updatePosition");
    },


    /**
     * Creates the selection list. Override this to customize the widget.
     *
     * @return {qx.ui.list.List} The selectionList of this menu.
     */
    _createList : function() {
      var selectionList = new qx.ui.list.List();
      selectionList.on("selected", this._onSelected, this);
      return selectionList;
    },


    _onSelected : function(data) {
      this.emit("selected", data);
    },


    /**
     * Scrolls the scroll wrapper of the selectionList to the item with given index.
     * @param index {Integer}, the index of the listItem to which the listScroller should scroll to.
     */
    scrollToItem : function(index) {
      if (index !== null && this.__list.model != null) {
        var listItems = qxWeb("#" + this.__listScroller.getAttribute("id") + " .list-item");
        var targetListItemElement = listItems[index];
        this.__listScroller.scrollToElement(targetListItemElement);
      }
    },


    dispose : function() {
      this.super(qx.ui.dialog.Popup, "dispose");
      this.__list.dispose();
      this.__listScroller.dispose();
      this.__menuContainer.dispose();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
