"use strict";
/* ************************************************************************

 qooxdoo - the new era of web development

 http://qooxdoo.org

 Copyright:
 2013 1&1 Internet AG, Germany, http://www.1und1.de

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Romeo Kenfack Tsakem (rkenfack)

 ************************************************************************ */

/**
 * Provides convenient access to CSS media queries including change
 * events.
 */
qx.Class.define("qx.bom.MediaQuery", {

  extend: Object,
  include : [qx.event.MEmitter],


  /**
   * @param query {String} the media query to evaluate
   */
  construct: function (query) {
    this.__mql = window.matchMedia(query);
    this.query = query;
    this.matches = this.__mql.matches;
    this.__init();
  },

  events: {
    /**
     * Fires each time the media query state changes. The event data is a map
     * with two keys:
     *
     * **query** The media query string
     *
     * **matches** A boolean that indicates whether the document
     * matches the query
     */
    "change": "Map"
  },


  members: {


    __mql: null,


    __boundChanged: null,

    /**
     * Indicates if the document currently matches the media query list
     */
    matches: false,


    /**
     * The mediaquery list to be evaluated
     */
    query: null,


    /**
     * Returns the query string used to initialize the listener.
     * @return {String} The given query string.
     */
    getQuery: function () {
      return this.query;
    },


    /**
     * Access the matching state of the media query.
     * @return {Boolean} <code>true</code>, if the query matches.
     */
    isMatching: function () {
      return this.matches;
    },


    /**
     * Initialize the mediaquery listener
     */
    __init: function () {
      this.__boundChanged = this.__changed.bind(this);
      this.__mql.addListener(this.__boundChanged);
    },

    /**
     * Callback for mediaqueries changes
     */
    __changed: function () {
      this.matches = this.__mql.matches;
      this.emit("change", {matches: this.matches, query: this.query});
    },

    dispose: function() {
      this.__mql.removeListener(this.__boundChanged);
    }
  }
});
