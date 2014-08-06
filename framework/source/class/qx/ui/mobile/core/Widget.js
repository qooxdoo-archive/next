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
 * This is the base class for all mobile widgets.
 *
 * @require(qx.module.Core)
 * @require(qx.module.event.GestureHandler)
 */
qx.Bootstrap.define("qx.ui.mobile.core.Widget",
{
  extend : qxWeb,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    if (qx.core.Environment.get("qx.debug")) {
      qx.Mixin.add(this.constructor, qx.core.MAssert); //TODO: Assertion module
    }

    if (this.length === 0) {
      this.push(this._createContainerElement());
    }

    // Init member variables

    var clazz = qx.ui.mobile.core.Widget;
    this.id = clazz.ID_PREFIX + clazz.__idCounter++;
    this.defaultCssClass = undefined;
    this.name = undefined;
    this.anonymous = undefined;
    this.activatable = undefined;
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired after a massive DOM manipulation, e.g. when DOM elements were
     * added or styles were changed. Listen to this event, if you need to
     * recalculate a layout or have to update your view.
     */
    domupdated : "qx.event.type.Event",

    /**
     * Fired after the widget appears on the screen.
     */
    appear : "qx.event.type.Event", //TODO?

    /**
     * Fired after the widget disappears from the screen.
     */
    disappear : "qx.event.type.Event" //TODO?
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * The default CSS class used for this widget. The default CSS class
     * should contain the common appearance of the widget.
     * It is applied to the container element of the widget. Use {@link #addCssClass}
     * to enhance the default appearance of the widget.
     */
    defaultCssClass :
    {
      check : "String",
      init : null,
      nullable : true,
      apply  : "_applyDefaultCssClass"
    },


    /**
     * Whether this widget is enabled or not
     */
    enabled :
    {
      init: true,
      check : "Boolean",
      nullable: false,
      event : "changeEnabled",
      apply: "_applyEnabled"
    },


    /**
     * Whether the widget should be the target of an event. Set this property
     * to <code>false</code> when the widget is a child of another widget and
     * shouldn't react on events.
     */
    anonymous :
    {
      check : "Boolean",
      init : null,
      nullable : true,
      apply : "_applyAnonymous"
    },


    /**
     * The ID of the widget. When the ID is set to <code>null</code> an auto
     * id will be generated.
     */
    id :
    {
      check : "String",
      nullable : true,
      apply : "_applyId",
      event : "changeId"
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
    visibility :
    {
      check : ["visible", "hidden", "excluded"],
      init : "visible",
      apply : "_applyVisibility",
      event : "changeVisibility"
    },


    /**
     * Whether the widget can be activated or not. When the widget is activated
     * a css class <code>active</code> is automatically added to the widget, which
     * can indicate the acitvation status.
     */
    activatable :
    {
      check : "Boolean",
      init : false,
      apply : "_applyActivatable"
    },


    layoutPrefs :
    {
      check : "Object",
      apply: "_applyLayoutPrefs",
      init : null,
      nullable: true
    }
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** @type {String} Prefix for the auto id */
    ID_PREFIX : "qx_id_",

    /** @type {Map} Internal data structure to store widgets */
    __registry : {},

    /** @type {Integer} Incremental counter of the current id */
    __idCounter : 0,

    /** @type {Integer} ID of the timeout for the DOM update */
    __domUpdatedScheduleId : null,

    /**
     * Event handler. Called when the application is in shutdown.
     * @internal
     */
    onShutdown : function()
    {
      window.clearTimeout(qx.ui.mobile.core.Widget.__domUpdatedScheduleId);
      delete qx.ui.mobile.core.Widget.__registry;
    },

    /**
     * Returns the current widget id of the registry.

     * @return {Integer} The current id
     * @internal
     */
    getCurrentId : function()
    {
      return qx.ui.mobile.core.Widget.__idCounter;
    },


    /**
     * Registers a widget with its id for internal widget handling.
     *
     * @param widget {Widget} The widget to register
     *
     * @internal
     */
    registerWidget : function(widget)
    {
      var id = widget.id;
      var registry = qx.ui.mobile.core.Widget.__registry;
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertUndefined(registry[id], "Widget with the id '" + id + "' is already registered");
      }
      registry[id] = widget;
    },


    /**
     * Unregisters the widget with the given id.
     *
     * @param id {String} The id of the widget to unregister
     *
     * @internal
     */
    unregisterWidget : function(id)
    {
      delete qx.ui.mobile.core.Widget.__registry[id];
    },


   /**
     * Returns the widget with the given id.
     *
     * @param id {String} The id of the widget
     * @return {Widget} The widget with the given id
     */
    getWidgetById : function(id) {
      return qx.ui.mobile.core.Widget.__registry[id];
    },


    /**
     * Schedules the {@link #domUpdated} method. The method will be called after a timeout
     * to prevent the triggered events to be fired too often, during massive DOM manipulations.
     *
     * @internal
     */
    scheduleDomUpdated : function()
    {
      if (!qx.ui.mobile.core.Widget.__domUpdatedScheduleId) {
        qx.ui.mobile.core.Widget.__domUpdatedScheduleId = window.setTimeout(
          qx.ui.mobile.core.Widget.domUpdated,
          0
        );
      }
    },


    /**
     * Fires the DOM updated event directly. Triggers the {@link qx.event.handler.Appear#refresh} and
     * {@link qx.ui.mobile.core.DomUpdatedHandler#refresh} methods. Do not use this
     * method during massive DOM manipulations. Use {@link #scheduleDomUpdated} instead.
     *
     * @internal
     */
    domUpdated : qx.event.GlobalError.observeMethod(function()
    {
      var clazz = qx.ui.mobile.core.Widget;
      window.clearTimeout(clazz.__domUpdatedScheduleId);
      clazz.__domUpdatedScheduleId = null;
      qx.event.handler.Appear.refresh();
      qx.ui.mobile.core.DomUpdatedHandler.refresh();
    }),


    /**
     * Mapping of attribute properties to their real attribute name.
     *
     * @internal
     */
    ATTRIBUTE_MAPPING :
    {
      "selectable" :
      {
        attribute : "data-selectable",
        values :
        {
          "true" : null,
          "false" : "false"
        }
      },
      "activatable" :
      {
        attribute : "data-activatable",
        values :
        {
          "true" :"true",
          "false" : null
        }
      },
      "readOnly" :
      {
        attribute : "readonly"
      }
    }

  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __layoutManager : null,

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
     * Triggers the {@link #scheduleDomUpdated} method. This method needs to be called
     * when the DOM has changed, e.g. an element was added / removed / styled.
     */
    _domUpdated : function()
    {
      qx.ui.mobile.core.Widget.scheduleDomUpdated();
    },


    /*
    ---------------------------------------------------------------------------
      ID Handling
    ---------------------------------------------------------------------------
    */


    // property apply
    _applyId : function(value, old)
    {
      if (old !== null)
      {
        // Unregister widget with old id
        qx.ui.mobile.core.Widget.unregisterWidget(old);
      }

      // Change the id of the DOM element
      this[0].id = value;
      // Register the widget
      qx.ui.mobile.core.Widget.registerWidget(this);

    },

    /**
     * Sets the enable property to the new value
     * @param value {Boolean}, the new value of the widget
     * @param old {Boolean?}, the old value of the widget
     *
     */
    _applyEnabled : function(value,old)
    {
      if (value)
      {
        this.removeClass("disabled");
        this.setStyle('anonymous', this.anonymous);
      }
      else
      {
        this.addClass("disabled");
        this.setStyle('anonymous', true);
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
        // TODO: store widget instance on DOM element?
        return qx.ui.mobile.core.Widget.getWidgetById(parent[0].id);
      }
    },


    /**
     * Adds a new child widget.
     *
     * @param child {Widget} the widget to add.
     */
    _add : function(child)
    {
      this.append(child[0]);

      this.updateLayoutProperties(child);

      var layout = this._getLayout();
      if (layout) {
        layout.connectToChildWidget(child);
      }

      this._domUpdated();
    },


    /**
     * Add a child widget at the specified index
     *
     * @param child {Widget} widget to add
     * @param index {Integer} Index, at which the widget will be inserted
     * @param options {Map?null} Optional layout data for widget.
     */
    _addAt : function(child, index, options)
    {
      var ref = this.getChildren()[index];

      if (ref) {
        child._addBefore(ref);
      } else {
        this._add(child);
      }
    },


    /**
     * Add a widget before another already inserted widget
     *
     * @param child {Widget} widget to add
     * @param before {Widget} widget before the new widget will be inserted.
     * @param layoutProperties {Map?null} Optional layout data for widget.
     */
    _addBefore : function(widget)
    {
      this.insertBefore(widget);

      this._domUpdated();
    },


    /**
     * Add a widget after another already inserted widget.
     *
     * @param child {Widget} The widget to add.
     * @param widget {Widget} Widget, after which the new widget will be inserted.
     * @param layoutProperties {Map?null} Optional layout data for widget.
     */
    _addAfter : function(widget)
    {
      this.insertAfter(widget);

      this._domUpdated();
    },



    /**
     * Removes a given child from the widget.
     *
     * @param child {Widget} The widget to remove.
     */
    _remove : function(child)
    {
      child.remove();
      this._domUpdated();
    },


    /**
     * Remove the widget at the specified index.
     *
     * @param index {Integer} Index of the widget to remove.
     */
    _removeAt : function(index)
    {
      var child = this.getChildren()[index];
      this._remove(child);
    },


    /**
     * Removes all children from the widget.
     * @return {Array} An Array including the removed children.
     */
    _removeAll : function()
    {
      var children = this.getChildren();
      children.forEach(function(child) {
        qxWeb(child).remove();
      });

      return children;
    },


    /**
     * Returns the index position of the given widget if it is
     * a child widget. Otherwise it returns <code>-1</code>.
     *
     * @param child {Widget} the widget to query for
     * @return {Integer} The index position or <code>-1</code> when
     *   the given widget is no child of this layout.
     */
    _indexOf : function(child)
    {
      return this.getChildren().indexOf(child);
    },


   /*
    ---------------------------------------------------------------------------
      Layout handling
    ---------------------------------------------------------------------------
    */

    /**
     * Set a layout manager for the widget. A layout manager can only be connected
     * with one widget. Reset the connection with a previous widget first, if you
     * like to use it in another widget instead.
     *
     * @param layout {qx.ui.mobile.layout.Abstract} The new layout or
     *     <code>null</code> to reset the layout.
     */
    _setLayout : function(layout)
    {
      if (qx.core.Environment.get("qx.debug")) {
        if (layout) {
          this.assertInstance(layout, qx.ui.mobile.layout.Abstract);
        }
      }

      if (layout) {
        layout.connectToWidget(this);
      }

      this.__layoutManager = layout;
      this._domUpdated();
    },



    /**
     * Initializes the layout of the given child widget.
     *
     * @param child {Widget} The child widget
     * @param layoutProperties {Map?null} Optional layout data for widget
     */
    _initializeChildLayout : function(child, layoutProperties)
    {
      child.setLayoutProperties(layoutProperties);
      var layout = this._getLayout();
      if (layout) {
        layout.connectToChildWidget(child);
      }
    },


    /**
     * Returns the set layout manager for the widget.
     *
     * @return  {qx.ui.mobile.layout.Abstract} the layout manager of the widget.
     */
    _getLayout : function() {
      return this.__layoutManager;
    },


    /**
     * Stores the given layout properties.
     *
     * @param properties {Map} Incoming layout property data
     */
    _applyLayoutPrefs : function(value, old)
    {
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
    updateLayoutProperties : function(widget)
    {
      var layout = this._getLayout();
      if (layout) {
        layout.setLayoutProperties(widget);
      }
      this._domUpdated();
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
      var layout = this._getLayout();
      if (layout) {
        layout.updateLayout(widget, action, properties);
      }
      this._domUpdated();
    },


    /*
    ---------------------------------------------------------------------------
      Content handling
    ---------------------------------------------------------------------------
    */


    /**
    * Sets the innerHTML of the content element and calls the {@link #_domUpdated}
    * method.
    *
    * @param value {String?""} The html to set in the content element.
    */
    setHtml : function(value)
    {
      this.base(arguments, value || "");
      this._domUpdated();
    },


    _applyActivatable : function(value, old) {
      this._setAttribute("activatable", value);

      if (old) {
        this.off("pointerdown", this._addActiveState, this);
        this.off("pointerup", this._removeActiveState, this);
      }

      if (value) {
        this.on("pointerdown", this._addActiveState, this);
        this.on("pointerup", this._removeActiveState, this);
      }

      //TODO: remove active state on viewport scroll (see mobile.core.EventHandler.__onPointerMove)
    },


    _addActiveState : function() {
      if (this.getAttribute("data-selectable") != "false") {
        this.addClass("active");
      }
    },


    _removeActiveState : function() {
      this.removeClass("active");
    },


    /*
    ---------------------------------------------------------------------------
      Attributes handling
    ---------------------------------------------------------------------------
    */

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
    _applyAttribute : function(value, old, attribute)
    {
      this._setAttribute(attribute, value);
    },


    /**
     * Sets an attribute with the given value of the container element. The
     * <code>null</code> value resets the attribute.
     *
     * @param attribute {String} The attribute name.
     * @param value {var} The attribute value. <code>Null</code> will reset the attribute.
     */
    _setAttribute : function(attribute, value)
    {
      var mapping = qx.ui.mobile.core.Widget.ATTRIBUTE_MAPPING[attribute];
      if (mapping)
      {
        attribute = mapping.attribute || attribute;
        var values = mapping.values;
        value = values && typeof values[value] !== "undefined" ? values[value] : value;
      }

      this.setAttribute(attribute, value);

      this._domUpdated();
    },


    /*
    ---------------------------------------------------------------------------
      Styles handling
    ---------------------------------------------------------------------------
    */


    /**
     * Ignore pointer events on this widget
     */
    _applyAnonymous : function(value, old, style)
    {
      this.setStyle("pointerEvents", value ? "none" : null);
    },


    /**
     * Sets the value of a certain style of the container element. The
     * <code>null</code> value resets the attribute.
     *
     * @param style {String} The style of which the value should be set
     * @param value {var} The value of the style. <code>Null</code> will reset the attribute.
     */
    setStyle : function(style, value) {
      this.base(arguments, style, value);
      this._domUpdated();
    },


    /*
    ---------------------------------------------------------------------------
      CSS Handling
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyDefaultCssClass : function(value, old)
    {
      if (old) {
        this.removeClass(old);
      }
      if (value) {
        this.addClass(value);
      }
    },


    /**
     * Adds a CSS class to the container element of the widget. Use this method
     * to enhance the default appearance of the widget.
     *
     * @param cssClass {String} The CSS class to add
     */
    addClass : function(cssClass) {
      this.base(arguments, cssClass);
      this._domUpdated();
    },


    /**
     * Adds an array of CSS classes to the container element of the widget. Use this method
     * to enhance the default appearance of the widget.
     *
     * @param cssClasses {String[]} The CSS classes to add, wrapped by an array.
     */
    addClasses : function(cssClasses) {
      if (cssClasses){
        this.base(arguments, cssClasses);
        this._domUpdated();
      }
    },


    /**
     * Removes a CSS class from the container element of the widget.
     *
     * @param cssClass {String} The CSS class to remove
     */
    removeClass : function(cssClass) {
      if (this.hasClass(cssClass)) {
        this.base(arguments, cssClass);
        this._domUpdated();
      }
    },


    /**
     * Removes an array of CSS classes from the container element of the widget.
     *
     * @param cssClasses {String[]} The CSS classes to remove from widget.
     */
    removeClasses : function(cssClasses) {
       if (cssClasses){
         this.base(arguments, cssClasses);
         this._domUpdated();
       }
    },


    /**
     * Toggles the given CSS. Adds or removes the CSS class from the container element of the widget.
     *
     * @param cssClass {String} The CSS class to toggle
     */
    toggleClass : function(cssClass) {
      if (this.hasClass(cssClass)) {
        this.removeClass(cssClass);
      } else {
        this.addClass(cssClass);
      }
    },


    /*
    ---------------------------------------------------------------------------
      Visibility handling
    ---------------------------------------------------------------------------
    */


    // property apply
    _applyVisibility : function(value, old)
    {
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
      this._domUpdated();
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
    },


    /**
     * Hide this widget.
     *
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     */
    hide : function(properties) {
      this.__setVisibility("hidden", properties);
    },


    /**
     * Hide this widget and exclude it from the underlying layout.
     *
     * @param properties {Map} The animation properties to set. Key / value pairs.
     *
     */
    exclude : function(properties) {
      this.__setVisibility("excluded", properties);
    },


    /**
     * Whether the widget is locally visible.
     *
     * Note: This method does not respect the hierarchy.
     *
     * @return {Boolean} Returns <code>true</code> when the widget is visible
     */
    isVisible : function() {
      return this.visibility === "visible";
    },


    /**
     * Whether the widget is locally hidden.
     *
     * Note: This method does not respect the hierarchy.
     *
     * @return {Boolean} Returns <code>true</code> when the widget is hidden
     */
    isHidden : function() {
      return this.visibility !== "visible";
    },


    /**
     * Whether the widget is locally excluded.
     *
     * Note: This method does not respect the hierarchy.
     *
     * @return {Boolean} Returns <code>true</code> when the widget is excluded
     */
    isExcluded : function() {
      return this.visibility=== "excluded";
    },


    /**
     * Detects if the widget and all its parents are visible.
     *
     * Warning: forces rendering of the browser. Do not use this method during
     * animations or performance critical tasks.
     * @return {Boolean} <code>true</code>if the widget is seeable
     */
    isSeeable : function()
    {
      return this[0].offsetWidth > 0;
    },


    dispose : function() {
      this.base(arguments);

      // Cleanup event listeners
      // Needed as we rely on the containerElement in the qx.ui.mobile.core.EventHandler
      qx.event.Registration.removeAllListeners(this);

      if (this.id)
      {
        qx.ui.mobile.core.Widget.unregisterWidget(this.id);
      }

      this.remove();

      if(this.__layoutManager) {
        this.__layoutManager.dispose();
      }
    }
  },



  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.bom.Lifecycle.onShutdown(statics.onShutdown, statics);
  }
});
