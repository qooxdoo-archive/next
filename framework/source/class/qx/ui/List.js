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
 * @require(qx.module.AnimationFrame)
 * @require(qx.module.Template)
 * @require(qx.ui.Image)
 * @require(qx.module.event.TrackHandler)
 * @group(Widget)
 */
qx.Class.define("qx.ui.List",
{
  extend : qx.ui.Widget,



  statics : {
    itemTemplate : '<li class="list-item qx-hbox qx-flex-align-center {{#removable}}removable{{/removable}} {{#showArrow}}arrow{{/showArrow}}" {{#selectable}}data-selectable="true" data-activatable="true"{{/selectable}} data-row="{{row}}">' +
                     '{{#image}}<img class="list-item-image" data-qx-widget="qx.ui.Image" data-qx-config-source="{{image}}" style="pointer-events: none;">{{/image}}' +
                     '<div class="qx-vbox qx-flex1">' +
                       '{{#title}}<div class="label no-wrap list-item-title" style="pointer-events: none;">{{title}}</div>{{/title}}' +
                       '{{#subtitle}}<div class="label no-wrap list-item-subtitle" style="pointer-events: none;">{{subtitle}}</div>{{/subtitle}}' +
                     '</div>' +
                   '</li>',
    groupHeaderTemplate: '<li class="group-item qx-hbox qx-flex-align-center" {{#selectable}}data-selectable="true" data-activatable="true"{{/selectable}}>' +
                           '{{#image}}<img class="group-item-image" style="pointer-events: none;" src="{{image}}">{{/image}}' +
                           '{{#title}}<div class="qx-vbox qx-flex1">' +
                             '<div class="label no-wrap group-item-title" style="pointer-events: none;">{{title}}</div>' +
                           '</div>{{/title}}' +
                         '</li>'
  },


  /**
   * @param delegate {Object?null}
   *    <ul>
   *      <li>configureItem: Gives the user the opportunity to set individual styles and properties on the item widget cells created by the controller.</li>
   *      <li>group: Gives the user the opportunity to group the model.</li>
   *    </ul>
   * @param element {Element?null} The new list widget.
   *
   * @attach {qxWeb, toList}
   * @return {qx.ui.List} The new list widget.
   */
  construct : function(delegate, element)
  {
    this.super(qx.ui.Widget, "construct", element);

    // fetch the item template from the elements content
    if (element && element.innerHTML.trim() !== "") {
      qxWeb(element).find(".cloak").removeClass("cloak");
      this.__itemTemplate = element.innerHTML.trim();
    }
    element.innerHTML = "";

    this.on("tap", this._onTap, this);

    this.on("trackstart", this._onTrackStart, this);
    this.on("track", this._onTrack, this);
    this.on("trackend", this._onTrackEnd, this);

    this.on("pointerdown", this._onPointerDown, this);

    if (delegate) {
      this.delegate = delegate;
    } else {
      this.delegate = this;
    }
  },


  events :
  {
    /**
     * Fired when the selection is changed.
     */
    selected : "Element",


    /**
     * Fired when an item should be removed from list.
     */
    removeItem : "Number"
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "list"
    },


    /**
     * Delegation object which can have group or/and configureData functions.
     */
    delegate :
    {
      apply: "render",
      event: true,
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
      event: true,
      nullable : true,
      init : null
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


  members :
  {
    __minDeleteDistance: null,
    __isScrollingBlocked: null,
    __trackElement: null,

    __itemTemplate: null,


    // overridden
    _getTagName : function() {
      return "ul";
    },


    /**
     * Event handler for the "tap" event.
     *
     * @param evt {qx.event.type.Tap} The tap event
     */
    _onTap : function(evt) {
      var element = this._getElement(evt);
      if(!element) {
        return;
      }
      element = qxWeb(element);
      if (element.getData("selectable")) {
        this.emit("selected", element);
      }
    },


    _onPointerDown : function(evt) {
      var element = this._getElement(evt);
      if(!element) {
        return;
      }
      element = qxWeb(element);
      if (element.getData("selectable")) {
        element.addClass("active");
        qxWeb(document.documentElement).once("pointerup", function() {
          this.removeClass("active");
        }, element);
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
        var row = parseInt(element.getData("row"), 10);
        this.emit("removeItem", row);
      } else {
        qxWeb.requestAnimationFrame(function() {
          element.setStyle("transform", "translate3d(0,0,0)")
            .setStyle("opacity", "1")
            .removeClass("track");
        });
      }
    },


    /**
    * Returns the target list item.
    * @param evt {Event} the input event
    * @return {Element} the target list item.
    */
    _getElement : function(evt) {
      var element = evt.target;

      // Click on border: do nothing.
      if(element === this[0]) {
        return null;
      }

      while (element && this.getChildren().indexOf(element) == -1) {
        element = element.parentNode;
      }

      return element;
    },


    // property apply
    _applyModel : function(value, old)
    {
      if (old != null) {
        old.off("changeBubble", this.__onModelChangeBubble, this);
        old.off("change", this.__onModelChange, this);
        old.off("changeLength", this.render, this);
      }
      if (value != null) {
        value.on("changeBubble", this.__onModelChangeBubble, this);
        value.on("change", this.__onModelChange, this);
        value.on("changeLength", this.render, this);
      }

      this.render();
    },


    /**
     * Reacts on model 'change' event.
     * @param evt {qx.event.type.Data} data event which contains model change data.
     */
    __onModelChange : function(data) {
      if (data.type == "order") {
        this.render();
      }
    },


    /**
     * Reacts on model 'changeBubble' event.
     * @param evt {qx.event.type.Data} data event which contains model changeBubble data.
     */
    __onModelChangeBubble : function(data) {
      if (this.__itemTemplate) {
        return; // don't rerender if we use the data binding API
      }
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
        candidate = candidate.replace("[", "");
        candidate = candidate.replace("]", "");
        // "[0-2]" | "[0]"
        var isRange = (candidate.indexOf("-") != -1);

        if(isRange) {
          var rangeMembers = candidate.split("-");
          // 0
          var startRange = parseInt(rangeMembers[0], 10);
          // 2
          var endRange = parseInt(rangeMembers[1], 10);

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
      var renderedItems = this.getChildren();
      var oldNode = renderedItems[index];
      var newItem = this.__getRowTemplate(index);

      this[0].replaceChild(newItem[0], oldNode); // TODO not necessary
    },


    __getRowTemplate : function(index) {
      var template = this.__itemTemplate || qx.ui.List.itemTemplate;
      var data = this.model.getItem(index);
      if (qx.Class.getClass(data) === "String") {
        data = {title: data};
      }
      data.row = index;
      data = this.__configureData(data);

      if (this.__itemTemplate) {
        // replace the special values
        template = template.replace(/\$index/g, index);

        template = qxWeb.create(template);

        // get controller
        var ctrl;
        var parent = this;
        while (!ctrl && parent.length > 0) {
          if (parent[0].$$controller) {
            ctrl = parent[0].$$controller;
          }
          parent = parent.getParents();
        }

        ctrl._setUp(template); // TODO no protected
      } else {
        template = qxWeb.template.renderToNode(template, data);
        template.find("[data-qx-widget]").forEach(function(el) {
          // qxWeb.forEach initializes any widgets in the collection
          // automatically
        });
      }

      template.setProperty("model", this.model.getItem(index));
      return template;
    },


    __getGroupHeaderTemplate : function(group, groupIndex) {
      var template = qx.ui.List.groupHeaderTemplate;
      var fragment = qxWeb.template.renderToNode(template, group); // TODO move to binding as well
      qxWeb(fragment[0]).setData("group", groupIndex);
      return fragment;
    },


    /**
     * Renders the list.
     */
    render : function() {
      if (this.__itemTemplate) { // Data Binding mode
        var childLength = this.getChildren().length;
        var modelLength = this.model && this.model.length || 0;

        if (childLength > modelLength) {
          for (var i = modelLength; i < childLength; i++) {
            this.getChildren().getLast().remove();
          }
        } else if (childLength < modelLength) {
          for (var i = childLength; i < modelLength; i++) {
            this.__createaAndAppendItem(i);
          }
        }
      } else { // template mode
        this.empty();

        var model = this.model;
        var itemCount = model ? model.getLength() : 0;

        var groupIndex = 0;

        for (var index = 0; index < itemCount; index++) {
          if (this.__hasGroup()) {
            var groupElement = this._renderGroup(index, groupIndex);
            if (groupElement) {
              groupIndex++;
              this.append(groupElement);
            }
          }
          this.__createaAndAppendItem(index);
        }
      }
    },


    /**
     * Helper to create and append a list item.
     * @param index {Number} The index of the item.
     */
    __createaAndAppendItem: function(index) {
      var itemElement = this.__getRowTemplate(index);

      var itemHeight = null;
      if (this.itemHeight !== null) {
        itemHeight = this.itemHeight + "px";
      }
      // Fixed height
      qxWeb(itemElement[0]).setStyle("minHeight", itemHeight)
        .setStyle("maxHeight", itemHeight);

      this.append(itemElement);
    },


    /**
     * @internal
     * Returns the height of one single list item.
     * @return {Number} the height of a list item in px.
     */
    getListItemHeight : function() {
      var listItemHeight = 0;
      if (this.model && this.model.length > 0) {
        var listHeight = this.getHeight();
        listItemHeight = parseInt(listHeight) / this.model.length;
      }
      return listItemHeight;
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
        return this.__getGroupHeaderTemplate(group, groupIndex);
      } else {
        var previousGroup = this.__getGroup(itemIndex - 1);

        if (!qx.lang.Object.equals(group, previousGroup)) {
          return this.__getGroupHeaderTemplate(group, groupIndex);
        }
      }
    },


    __configureData : function(data) {
      var configureDataMethod = qx.util.Delegate.getMethod(this.delegate, "configureData");
      if (data.selectable !== false) {
        data.selectable = true;
      }
      if (configureDataMethod) {
        return configureDataMethod(data);
      }
      return data;
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
    __getGroup : function(index) {
      var data = this.model.getItem(index);
      if (qx.Class.getClass(data) === "String") {
        data = {title: data};
      }
      data = this.__configureData(data);
      var group = qx.util.Delegate.getMethod(this.delegate, "group");
      return group(data, index);
    },


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.__trackElement = null;
    }
  },

  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
