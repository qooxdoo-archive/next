"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The list widget displays the data of a model in a list.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *
 *    // Data for the list
 *    var data = [
 *       {title : "Row1", subtitle : "Sub1"},
 *       {title : "Row2", subtitle : "Sub2"},
 *       {title : "Row3", subtitle : "Sub3"}
 *   ];
 *
 *   // Create the list with a delegate that
 *   var list = new qx.ui.mobile.list.List({
 *     configureItem: function(item, data, row)
 *     {
 *       item.setImage("path/to/image.png");
 *       item.setTitle(data.title);
 *       item.setSubtitle(data.subtitle);
 *     },
 *
 *     configureGroupItem: function(item, data) {
 *       item.setTitle(data.title);
 *     },
 *
 *     group: function(data, row) {
 *      return {
 *       title: row < 2 ? "Selectable" : "Unselectable"
 *     };
 *    }
 *   });
 *
 *   // Set the model of the list
 *   list.model = new qx.data.Array(data);
 *
 *   // Add an changeSelection event
 *   list.on("changeSelection", function(evt) {
 *     alert("Index: " + evt)
 *   }, this);
 *
 *   this.getRoot().append(list);
 * </pre>
 *
 * This example creates a list with a delegate that configures the list item with
 * the given data. A listener for the event {@link #changeSelection} is added.
 *
 * @require(qx.module.AnimationFrame)
 */
qx.Bootstrap.define("qx.ui.mobile.list.List",
{
  extend : qx.ui.mobile.core.Widget,

  statics : {
    list : function(delegate) {
      return new qx.ui.mobile.list.List(this[0], delegate);
    }
  },


  /**
   * @param delegate {qx.ui.mobile.list.IListDelegate?null} The {@link #delegate} to use
   */
  construct : function()
  {
    var element = this.fixArguments(arguments);
    this.base(qx.ui.mobile.core.Widget, "constructor", element);
    this.__provider = new qx.ui.mobile.list.provider.Provider(this);

    this.on("tap", this._onTap, this);
    this.on("trackstart", this._onTrackStart, this);
    this.on("track", this._onTrack, this);
    this.on("trackend", this._onTrackEnd, this);

    if (arguments[0]) {
      this.delegate = arguments[0];
    } else {
      this.delegate = this;
    }

    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().on("changeLocale", this._onChangeLocale, this);
    }
  },


  events :
  {
    /**
     * Fired when the selection is changed.
     */
    changeSelection : "qx.event.type.Data",


    /**
     * Fired when the group selection is changed.
     */
    changeGroupSelection : "qx.event.type.Data",


    /**
     * Fired when an item should be removed from list.
     */
    removeItem : "qx.event.type.Data"
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "list"
    },


    /**
     * Delegation object which can have one or more functions defined by the
     * {@link qx.ui.mobile.list.IListDelegate} interface.
     */
    delegate :
    {
      apply: "_applyDelegate",
      event: "changeDelegate",
      init: null,
      nullable: true
    },


    /**
     * The model to use to render the list.
     */
    model :
    {
      check : "qx.data.Array",
      apply : "_applyModel",
      event: "changeModel",
      nullable : true,
      init : null
    },


    /**
     * Number of items to display. Auto set by model.
     * Reset to limit the amount of data that should be displayed.
     */
    itemCount : {
      check : "Number",
      init : 0
    },


    /**
    * The height of a list item.
    */
    itemHeight : {
      check : "Number",
      init : null,
      nullable : true
    }
  },


 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __provider : null,
    __minDeleteDistance : null,
    __isScrollingBlocked : null,
    __trackElement : null,


    // overridden
    _getTagName : function() {
      return "ul";
    },


    /**
     * Default list delegate. Expects a map which contains an image, a subtitle, and a title:
     * <code>{title : "Row1", subtitle : "Sub1", image : "path/to/image.png"}</code>
     *
     * @param item {qx.ui.mobile.list.renderer.Abstract} Instance of list item renderer to modify
     * @param data {var} The data of the row. Can be used to configure the given item.
     * @param row {Integer} The row index.
     */
    configureItem: function(item, data, row) {
      if(typeof data.image != "undefined") {
        item.setImage(data.image);
      }
      if(typeof data.subtitle != "undefined") {
        item.setSubtitle(data.subtitle);
      }
      if(typeof data.title != "undefined") {
        item.setTitle(data.title);
      }
      if(typeof data.enabled != "undefined") {
        item.setEnabled(data.enabled);
      }
      if(typeof data.removable != "undefined") {
        item.setRemovable(data.removable);
      }
      if(typeof data.selectable != "undefined") {
        item.setSelectable(data.selectable);
      }
      if(typeof data.activatable != "undefined") {
        item.setActivatable(data.activatable);
      }
      if(typeof data.arrow != "undefined") {
        item.setShowArrow(data.arrow);
      }
      if(typeof data.selected != "undefined") {
        item.setSelected(data.selected);
      }
    },


    /**
     * Event handler for the "tap" event.
     *
     * @param evt {qx.event.type.Tap} The tap event
     */
    _onTap : function(evt)
    {
      var element = this._getElement(evt);
      if(!element) {
        return;
      }

      element = qxWeb(element);

      var row = -1;
      if (element.hasClass("list-item")) {
        if (element.getAttribute("data-selectable") != "false" &&
            this.getChildren().indexOf(element) !== -1) {
          row = parseInt(element.getAttribute("data-row"), 10);
        }
        if (row != -1) {
          this.emit("changeSelection", row);
        }
      } else {
        var group = parseInt(element.getAttribute("data-group"), 10);
        if (element.getAttribute("data-selectable") != "false") {
          this.emit("changeGroupSelection", group);
        }
      }
    },


    /**
    * Event handler for <code>trackstart</code> event.
    * @param evt {qx.event.type.Track} the <code>trackstart</code> event
    */
    _onTrackStart : function(evt) {
      this.__isScrollingBlocked = null;
      this.__trackElement = null;

      var element = qxWeb(this._getElement(evt));
      if (element[0] &&
          element.hasClass("list-item") &&
          element.hasClass("removable")) {
        this.__trackElement = element;

        this.__minDeleteDistance = element.getWidth() / 2;
        element.addClass("track");
      }
    },


    /**
    * Event handler for <code>track</code> event.
    * @param evt {qx.event.type.Track} the <code>track</code> event
    */
    _onTrack : function(evt) {
      if (!this.__trackElement) {
        return;
      }

      var delta = evt.delta;

      var deltaX = Math.round(delta.x * 0.1) / 0.1;

      if(this.__isScrollingBlocked === null) {
        this.__isScrollingBlocked = (delta.axis == "x");
      }

      if (!this.__isScrollingBlocked) {
        return;
      }

      var opacity = 1 - (Math.abs(deltaX) / this.__minDeleteDistance);
      opacity = Math.round(opacity * 100) / 100;

      this.__trackElement.setStyle("transform", "translate3d(" + deltaX + "px,0,0)")
        .setStyle("opacity", opacity);

      evt.preventDefault();
    },


    /**
    * Event handler for <code>trackend</code> event.
    * @param evt {qx.event.type.Track} the <code>trackend</code> event
    */
    _onTrackEnd : function(evt) {
      if (!this.__trackElement) {
        return;
      }
      var element = this.__trackElement;

      if (Math.abs(evt.delta.x) > this.__minDeleteDistance) {
        var row = parseInt(element.getAttribute("data-row"), 10);
        this.emit("removeItem", row);
      } else {
        qxWeb.requestAnimationFrame(function() {
          element.setStyle("transform", "translate3d(0,0,0)")
            .setStyle("opacity", "1")
            .removeClass("track");
        }.bind(this));
      }
    },


    /**
    * Returns the target list item.
    * @param evt {Event} the input event
    * @return {Element} the target list item.
    */
    _getElement : function(evt) {
      var element = evt._original.target;

      // Click on border: do nothing.
      if(element.tagName == "UL") {
        return null;
      }

      while (element.tagName != "LI") {
        element = element.parentNode;
      }

      return element;
    },


    // property apply
    _applyModel : function(value, old)
    {
      if (old != null) {
        old.off("changeBubble", this.__onModelChangeBubble, this);
      }
      if (value != null) {
        value.on("changeBubble", this.__onModelChangeBubble, this);
      }

      if (old != null) {
        old.off("change", this.__onModelChange, this);
      }
      if (value != null) {
        value.on("change", this.__onModelChange, this);
      }

      if (old != null) {
        old.off("changeLength", this.__onModelChangeLength, this);
      }
      if (value != null) {
        value.on("changeLength", this.__onModelChangeLength, this);
      }

      this.__render();
    },


    // property apply
    _applyDelegate : function(value, old) {
      this.__provider.delegate = value;
    },


    /**
     * Listen on model 'changeLength' event.
     * @param evt {qx.event.type.Data} data event which contains model change data.
     */
    __onModelChangeLength : function(evt) {
      this.__render();
    },


    /**
     * Locale change event handler
     *
     * @signature function(e)
     * @param e {Event} the change event
     */
    _onChangeLocale : qx.core.Environment.select("qx.dynlocale",
    {
      "true" : function(e)
      {
        this.__render();
      },

      "false" : null
    }),


    /**
     * Reacts on model 'change' event.
     * @param evt {qx.event.type.Data} data event which contains model change data.
     */
    __onModelChange : function(data) {
      if (data.type == "order") {
        this.__render();
      }
    },


    /**
     * Reacts on model 'changeBubble' event.
     * @param evt {qx.event.type.Data} data event which contains model changeBubble data.
     */
    __onModelChangeBubble : function(data) {
      var isArray = (qx.lang.Type.isArray(data.old) && qx.lang.Type.isArray(data.value));
      if (!isArray || (isArray && data.old.length == data.value.length)) {
        var rows = this._extractRowsToRender(data.name);
        for (var i = 0; i < rows.length; i++) {
          this.__renderRow(rows[i]);
        }
      }
    },


    /**
     * Extracts all rows, which should be rendered from "changeBubble" event's
     * data.name.
     * @param name {String} The 'data.name' String of the "changeBubble" event,
     *    which contains the rows that should be rendered.
     * @return {Integer[]} An array with integer values, representing the rows which should
     *  be rendered.
     */
    _extractRowsToRender : function(name) {
      var rows = [];

      if(!name) {
        return rows;
      }

      // "[0-2].propertyName" | "[0].propertyName" | "0"
      var containsPoint = (name.indexOf(".")!=-1);
      if(containsPoint) {
        // "[0-2].propertyName" | "[0].propertyName"
        var candidate = name.split(".")[0];

        // Normalize
        candidate = candidate.replace("[","");
        candidate = candidate.replace("]","");
        // "[0-2]" | "[0]"
        var isRange = (candidate.indexOf("-") != -1);

        if(isRange) {
          var rangeMembers = candidate.split("-");
          // 0
          var startRange = parseInt(rangeMembers[0],10);
          // 2
          var endRange = parseInt(rangeMembers[1],10);

          for(var i = startRange; i <= endRange; i++) {
            rows.push(i);
          }
        } else {
          // "[0]"
          rows.push(parseInt(candidate.match(/\d+/)[0], 10));
        }
      } else {
        // "0"
        var match = name.match(/\d+/);
        if(match.length == 1) {
          rows.push(parseInt(match[0], 10));
        }
      }

      return rows;
    },


    /**
     * Renders a specific row identified by its index.
     * @param index {Integer} index of the row which should be rendered.
     */
    __renderRow : function(index) {
      var renderedItems = this.find(".list-item");
      var oldNode = renderedItems[index];
      var newItem = this.__provider.getItemElement(this.model.getItem(index), index);

      this[0].replaceChild(newItem[0], oldNode);
    },


    /**
    * @internal
    * Returns the height of one single list item.
    * @return {Integer} the height of a list item in px.
    */
    getListItemHeight : function() {
      var listItemHeight = 0;
      if (this.model != null && this.model.length > 0) {
        var listHeight = this.getStyle("height");
        listItemHeight = parseInt(listHeight) / this.model.length;
      }
      return listItemHeight;
    },


    /**
     * Renders the list.
     */
    __render : function()
    {
      this.setHtml("");

      var model = this.model;
      this.itemCount = model ? model.getLength() : 0;

      var groupIndex = 0;

      for (var index = 0; index < this.itemCount; index++) {
        if (this.__hasGroup()) {
          var groupElement = this._renderGroup(index, groupIndex);
          if (groupElement) {
            groupIndex++;
            this.append(groupElement);
          }
        }
        var item = model.getItem(index);
        var itemElement = this.__provider.getItemElement(item, index);

        var itemHeight = null;
        if (this.itemHeight !== null) {
          itemHeight = this.itemHeight + "px";
        }
        // Fixed height
		qxWeb(itemElement).setStyle("minHeight", itemHeight)
          .setStyle("maxHeight", itemHeight);

        this.append(itemElement);
      }
    },


    /**
     * Triggers a re-rendering of this list.
     */
    render : function() {
      this.__render();
    },


    /**
    * Renders a group header.
    *
    * @param itemIndex {Integer} the current list item index.
    * @param groupIndex {Integer} the group index.
    * @return {Element} the group element or <code>null</code> if no group was needed.
    */
    _renderGroup: function(itemIndex, groupIndex) {
      var group = this.__getGroup(itemIndex);

      if (itemIndex === 0) {
        return this.__provider.getGroupElement(group, groupIndex);
      } else {
        var previousGroup = this.__getGroup(itemIndex - 1);

        if (!qx.lang.Object.equals(group, previousGroup)) {
          return this.__provider.getGroupElement(group, groupIndex);
        }
      }
    },


    /**
    * Checks whether the delegate support group rendering.
    * @return {Boolean} true if the delegate object supports grouping function.
    */
    __hasGroup : function() {
      return qx.util.Delegate.getMethod(this.delegate, "group") !== null;
    },


    /**
     * Returns the group for this item, identified by its index
     * @param index {Integer} the item index.
     * @return {Object} the group object, to which the item belongs to.
     */
    __getGroup : function(index)
    {
      var item = this.model.getItem(index);
      var group = qx.util.Delegate.getMethod(this.delegate, "group");
      return group(item, index);
    },


    dispose : function() {
      this.base(qx.ui.mobile.core.Widget, "dispose");
      this.__trackElement = null;
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().off("changeLocale", this._onChangeLocale, this);
      }
    }
  },

  defer : function(statics) {
    qxWeb.$attach({list : statics.list});
  }
});
