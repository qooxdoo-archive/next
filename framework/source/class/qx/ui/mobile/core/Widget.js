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
 * This is the base class for all widgets.
 *
 * @require(qx.module.Core)
 * @require(qx.module.event.GestureHandler)
 * @require(qx.module.event.AppearHandler)
 * @require(qx.module.Dataset)
 */
qx.Bootstrap.define("qx.ui.mobile.core.Widget", {
  extend : qxWeb,


  statics : {

    attachWidget : function(clazz) {
      var name = clazz.classname.split(".");
      name = qx.lang.String.firstLow(name[name.length - 1]);
      var data = {};
      var index = qx.Bootstrap.getConstructorArgumentsCount(clazz);
      data[name] = function() {
        var args = qx.lang.Array.fromArguments(arguments);
        // Add the DOM element as last argument
        args[index] = this[0];
        var Temp = qx.Bootstrap.curryConstructor(clazz, args);
        return new Temp();
      };
      qxWeb.$attach(data);
    },

    /** @type {String} Prefix for the auto id */
    ID_PREFIX : "qx_id_",

    /** @type {Integer} Incremental counter of the current id */
    __idCounter : 0,


    /**
     * Returns the widget with the given id.
     *
     * @param id {String} The id of the widget
     * @return {Widget} The widget with the given id
     */
    getWidgetById : function(id) {
      var el = document.getElementById(id);
      return el ? el.$$widget : undefined;
    },


    /**
     * Fetches elements with a data attribute named <code>data-qx-widget</code>
     * containing the class name of the desired widget and initializes them as
     * widgets.
     *
     * @param selector {String?} Optional selector expression or filter function to
     * restrict the list of elements
     * @attachStatic {qxWeb}
     */
    initWidgets : function(selector) {
      var elements = document.querySelectorAll("*[data-qx-widget]");
      if (selector) {
        var filterFunc = selector;
        if (qx.Bootstrap.getClass(selector) == "String") {
          filterFunc = function(el) {
            var matches = el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
            return matches.call(el, selector);
          };
        }
        elements = Array.prototype.filter.call(elements, filterFunc);
      }
      for (var i=0, l=elements.length; i<l; i++) {
        qxWeb(elements[i]);
      }
    }
  },


  construct : function(element) {
    this.base(qxWeb, "constructor");

    if (element) {
      this.push(element);
    } else {
      this.push(this._createContainerElement());
    }

    // Init member variables

    var clazz = qx.ui.mobile.core.Widget;
    if (this.getAttribute("id")) {
      this.setAttribute("id", clazz.ID_PREFIX + clazz.__idCounter++);
    }
    this.defaultCssClass = undefined;
    this.name = undefined;
    this.anonymous = undefined;
    this.activatable = undefined;
    this[0].$$widget = this;
    this._initDomConfig();
    // avoid infinite recursion if an extending constructor creates a
    // collection containing the content element
    window.setTimeout(function() {
      this.setData("qx-widget", this.classname);
    }.bind(this), 0);
  },


  events : {
    /**
     * Fired after the widget appears on the screen.
     */
    appear : "Event",

    /**
     * Fired after the widget disappears from the screen.
     */
    disappear : "Event"
  },


  properties : {
    /**
     * The default CSS class used for this widget. The default CSS class
     * should contain the common appearance of the widget.
     * It is applied to the container element of the widget. Use {@link #addCssClass}
     * to enhance the default appearance of the widget.
     */
    defaultCssClass : {
      check : "String",
      init : null,
      nullable : true,
      apply  : "_applyDefaultCssClass"
    },


    /**
     * Whether this widget is enabled or not
     */
    enabled : {
      init: true,
      check : "Boolean",
      nullable: false,
      event : true,
      apply: "_applyEnabled"
    },


    /**
     * Whether the widget should be the target of an event. Set this property
     * to <code>false</code> when the widget is a child of another widget and
     * shouldn't react on events.
     */
    anonymous : {
      check : "Boolean",
      init : null,
      nullable : true,
      apply : "_applyAnonymous"
    },


    /**
     * Controls the visibility. Valid values are:
     *
     * <ul>
     *   <li><b>visible</b>: Render the widget</li>
     *   <li><b>hidden</b>: Hide the widget. The space will be still available.</li>
     *   <li><b>excluded</b>: Hide the widget. The space will be released.</li>
     * </ul>
     */
    visibility : {
      check : ["visible", "hidden", "excluded"],
      init : "visible",
      apply : "_applyVisibility",
      event : true
    },


    /**
     * Whether the widget can be activated or not. When the widget is activated
     * a css class <code>active</code> is automatically added to the widget, which
     * can indicate the acitvation status.
     */
    activatable : {
      check : "Boolean",
      init : false,
      apply : "_applyActivatable"
    },


    layoutPrefs : {
      check : "Object",
      apply: "_applyLayoutPrefs",
      init : null,
      nullable: true
    }
  },


  members : {
    __layoutManager : null,


    _initDomConfig : function() {
      var data = this.getAllData();
      for (var prop in data) {
        if (prop.indexOf("qxConfig") === 0) {
          var propName = qx.lang.String.firstLow(prop.substr(8));
          if (qx.Bootstrap.hasProperty(this.constructor, propName)) {
            var value = data[prop];
            try {
              value = JSON.parse(value);
            } catch(ex) {}
            this[propName] = value;
          }
        }
      }
    },


    /*
    ---------------------------------------------------------------------------
      Basic Template
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the tag name of the container element of this widget.
     * Override this method if you want to create a custom widget.
     * @return {String} The container element's tag name
     */
    _getTagName : function() {
      return "div";
    },


   /**
    * Creates the container DOM element of the widget.
    * Override this method if you want to create a custom widget.
    *
    * @return {Element} the container element.
    */
    _createContainerElement : function() {
      return qxWeb.create("<" + this._getTagName() + ">")[0];
    },


    /**
     * Sets the enable property to the new value
     * @param value {Boolean}, the new value of the widget
     * @param old {Boolean?}, the old value of the widget
     *
     */
    _applyEnabled : function(value, old) {
      if (value) {
        this.removeClass("disabled");
        if (!this.anonymous) {
          this.setStyle("pointerEvents", "auto");
        }
      }
      else {
        this.addClass("disabled");
        this.setStyle("pointerEvents", "none");
      }
    },



    /*
    ---------------------------------------------------------------------------
      Child Handling
    ---------------------------------------------------------------------------
    */

    _getParentWidget : function() {
      var parent = this.getParents();
      if (parent[0]) {
        return parent[0].$$widget;
      }
    },


    _append : function(child) {
      this.base(qx.ui.mobile.core.Widget, "append", child);
    },


    // overridden
    append : function(child) {
      this.base(qxWeb, "append", child);

      this.updateLayoutProperties(child);

      var layout = this.getLayout();
      if (layout) {
        layout.connectToChildWidget(child);
      }

      return this;
    },


    /**
     * Add a child widget at the specified index
     *
     * @param child {Widget} widget to add
     * @param index {Integer} Index, at which the widget will be inserted
     * @param options {Map?null} Optional layout data for widget.
     */
    appendAt : function(child, index, options)
    {
      var ref = this.getChildren()[index];

      if (ref) {
        child.insertBefore(ref);
      } else {
        this.append(child);
      }
    },


    // overridden
    remove : function() {
      var parent = this._getParentWidget();
      if (parent) {
        parent.disconnectChild(this);
        var layout = parent.getLayout ? parent.getLayout() : null;
        if (layout) {
          layout.disconnectFromChildWidget(this);
        }
      }
      return this.base(qxWeb, "remove");
    },


    /**
     * Called on a parent widget when a child is removed.
     * @param child {qx.ui.mobile.core.Widget} Removed child widget
     */
    disconnectChild : function(child) {},


    /**
     * Set a layout manager for the widget. A layout manager can only be connected
     * with one widget. Reset the connection with a previous widget first, if you
     * like to use it in another widget instead.
     *
     * @param layout {qx.ui.mobile.layout.Abstract} The new layout or
     *     <code>null</code> to reset the layout.
     */
    setLayout : function(layout) {
      if (qx.core.Environment.get("qx.debug")) {
        if (layout) {
          qx.core.Assert.assertInstance(layout, qx.ui.mobile.layout.Abstract);
        }
      }

      if (layout) {
        layout.connectToWidget(this);
      } else {
        var oldLayout = this.getLayout();
        if (oldLayout) {
          oldLayout.disconnectFromWidget(this);
        }
      }

      this.__layoutManager = layout;
    },



    /**
     * Initializes the layout of the given child widget.
     *
     * @param child {Widget} The child widget
     * @param layoutProperties {Map?null} Optional layout data for widget
     */
    _initializeChildLayout : function(child, layoutProperties) {
      child.setLayoutProperties(layoutProperties);
      var layout = this.getLayout();
      if (layout) {
        layout.connectToChildWidget(child);
      }
    },


    /**
     * Returns the set layout manager for the widget.
     *
     * @return  {qx.ui.mobile.layout.Abstract} the layout manager of the widget.
     */
    getLayout : function() {
      return this.__layoutManager;
    },


    /**
     * Stores the given layout properties.
     *
     * @param properties {Map} Incoming layout property data
     */
    _applyLayoutPrefs : function(value, old) {
      // Check values through parent
      var parent = this._getParentWidget();
      if (parent) {
        parent.updateLayoutProperties(this);
      }
    },


    /**
     * Updates the layout properties of a given widget.
     *
     * @param widget {qx.ui.mobile.core.Widget} The widget that should be updated
     * @param properties {Map} Incoming layout property data
     *
     * @internal
     */
    updateLayoutProperties : function(widget) {
      var layout = this.getLayout();
      if (layout) {
        layout.setLayoutProperties(widget);
      }
    },


    /**
     * Updates the layout with the given arguments.
     *
     * @param widget {qx.ui.mobile.core.Widget} The target widget
     * @param action {String} The causing action that triggered the layout update.
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     * @internal
     */
    updateLayout : function(widget, action, properties) {
      var layout = this.getLayout();
      if (layout) {
        layout.updateLayout(widget, action, properties);
      }
    },


    _applyActivatable : function(value, old) {
      this.setData("activatable", value ? "true" : null);

      if (old) {
        this.off("pointerdown", this._addActiveState, this);
      }

      if (value) {
        this.on("pointerdown", this._addActiveState, this);
      }

      //TODO: remove active state on viewport scroll (see mobile.core.EventHandler.__onPointerMove)
    },


    _addActiveState : function() {
      if (this.getData("selectable") != "false") {
        this.addClass("active");
        qxWeb(document.documentElement).once("pointerup", this._removeActiveState, this);
      }
    },


    _removeActiveState : function() {
      this.removeClass("active");
    },


    /**
     * Shortcut for each property that should change a certain attribute of the
     * container element.
     * Use the {@link #addAttributeMapping} method to add a property to attribute
     * mapping when the attribute name or value differs from the property name or
     * value.
     *
     * @param value {var} The set value
     * @param old {var} The old value
     * @param attribute {String} The property name
     */
    _applyAttribute : function(value, old, attribute) {
      this.setAttribute(attribute, value);
    },


    _applySelectable : function(value, old) {
      this.setData("selectable", value ? null : "false");
    },


    /**
     * Ignore pointer events on this widget
     */
    _applyAnonymous : function(value, old, style) {
      this.setStyle("pointerEvents", value ? "none" : null);
    },


    // property apply
    _applyDefaultCssClass : function(value, old) {
      if (old) {
        this.removeClass(old);
      }
      if (value) {
        this.addClass(value);
      }
    },


    // property apply
    _applyVisibility : function(value, old) {
      if (value == "excluded") {
        this.addClass("exclude");
      }
      else if (value == "visible")
      {
        this.removeClass("exclude");
        this.setStyle("visibility", "visible");
      }
      else if (value == "hidden") {
        this.setStyle("visibility", "hidden");
      }
    },


    /**
     * Sets the visibility of the widget.
     *
     * @param action {String} The causing action that triggered the layout update.
     * @param properties {Map} The animation properties to set. Key / value pairs.
     */
    __setVisibility : function(action, properties) {
      this.visibility = action;

      var parent = this._getParentWidget();
      if (parent) {
        parent.updateLayout(this, action, properties);
      }
    },


    /**
     * Make this widget visible.
     *
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     */
    show : function(properties) {
      this.__setVisibility("visible", properties);
      return this;
    },


    /**
     * Hide this widget.
     *
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     */
    hide : function(properties) {
      this.__setVisibility("hidden", properties);
      return this;
    },


    /**
     * Hide this widget and exclude it from the underlying layout.
     *
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     */
    exclude : function(properties) {
      this.__setVisibility("excluded", properties);
      return this;
    },


    dispose : function() {
      // Cleanup event listeners
      // Needed as we rely on the containerElement in the qx.ui.mobile.core.EventHandler
      // qx.event.Registration.removeAllListeners(this); TODO

      this.remove();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachStatic({
      initWidgets : statics.initWidgets,
      $attachWidget : statics.attachWidget
    });
  }
});
