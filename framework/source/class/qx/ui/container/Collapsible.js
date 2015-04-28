"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Creates a Collapsible widget.
 * It contains a {@link qx.ui.Label Label} for the header and a {@link qx.ui.Widget}
 * for the content.
 *
 * The visiblity of the content composite toggles when user taps on header.
 *
 * *Example*
 *
 * Here is an example of how to use the widget.
 *
 * <pre class='javascript'>
 *  var collapsible = new qx.ui.container.Collapsible("Collapsible Header");
 *  collapsible.combined = false;
 *  collapsible.collapsed = false;
 *
 *  var label = new qx.ui.Label("This is the content of the Collapsible.");
 *  collapsible.append(label);
 *
 * </pre>
 * @group(Widget)
 */
qx.Class.define("qx.ui.container.Collapsible",
{
  extend : qx.ui.Widget,


  /**
   * @param title {String?} the text which should be displayed in the Collapsible's header label.
   * @param element {Element?} The element used to create the widget.
   * @attach {qxWeb, toCollapsible}
   */
  construct : function(title, element)
  {
    this.super("construct", element);

    // Get exiting content and clear it afterwards
    var content = this.getHtml();
    this.setHtml('');

    this._header = this._createHeader();
    this._header.addClass("collapsible-header");
    this._header.on("tap", this._toggleCollapsed, this);
    this.setTitle(title);

    this._content = this._createContent();
    this._content.addClass("collapsible-content");
    this.setContent(content);

    // use the append of the superclass to prevent recursive append calls
    this.super("append", this._header);
    this.super("append", this._content);

    this.collapsed = undefined;
    this.combined = undefined;

    this.addClass("gap");
  },


  properties : {
    // overridden
    defaultCssClass : {
      init : "collapsible"
    },


    /** The collapsed state of this widget. */
    collapsed : {
      check : "Boolean",
      init : true,
      nullable : false,
      apply : "_applyCollapsed",
      event : true
    },


    /** Controls whether the Collapsible's content
        should be visually associated with its headers. */
    combined : {
      check : "Boolean",
      init : true,
      apply : "_applyCombined"
    }

  },


  members :
  {
    _header : null,
    _content : null,


    /**
    * Adds a new child widget to the Collapsible's content composite.
    * @param child {qx.ui.Widget} the widget to add.
    */
    append : function(child) {
      if(child && this._content instanceof qx.ui.Widget) {
        this._content.append(child);
      }
    },


    /**
    * Setter for the Collapsible's header title.
    * @param title {String} the Collapsible's title.
    */
    setTitle : function(title) {
      if(title && this._header instanceof qx.ui.Label) {
        this._header.value = title;
      }
    },

    /**
     * Setter for the Collapsible's content element
     * @param content {String} the content string
     */
    setContent: function (content) {
      if (content && this._content instanceof qx.ui.Widget) {
        this._content.setHtml(content);
      }
    },


    /**
    * Getter for the Collapsible's header label.
    * @return {qx.ui.Label} the header.
    */
    getHeader : function() {
      return this._header;
    },


    /**
    * Getter for the Collapsible's content composite.
    * @return {qx.ui.Widget} the content composite.
    */
    getContent : function() {
      return this._content;
    },


    /**
    * Factory method for the Collapsible's header.
    * @return {qx.ui.Label} the label which represents the header.
    */
    _createHeader : function() {
      var header = new qx.ui.Label();
      header.anonymous = false;
      header.activatable = true;
      return header;
    },


    /**
    * Factory method for the Collapsible's content.
    * @return {v} the content composite.
    */
    _createContent : function() {
      return new qx.ui.Widget();
    },


    // property apply
    _applyCollapsed : function(value) {
      if(value === true) {
        this._content.exclude();
        this.addClass("collapsed");
      } else {
        this._content.show();
        this.removeClass("collapsed");
      }
    },


    // property apply
    _applyCombined : function(value) {
      if(value === true) {
        this.addClass("combined");
      }
      else {
        this.removeClass("combined");
      }
    },


    /**
     * Toggle the collapsed state
     */
    _toggleCollapsed : function() {
      this.collapsed = !this.collapsed;
    },


    dispose : function() {
      this.super("dispose");
      this._header.off("tap", this._toggleCollapsed, this);
      this._header.dispose();
      this._content.dispose();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
