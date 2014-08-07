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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The mixin contains all functionality to provide methods
 * for form elements to manipulate their state. [usually "valid" and "invalid"]
 *
 */
qx.Mixin.define("qx.ui.mobile.form.MState",
{

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
  /**
   * The states of the element
   */
  __states: null,

  /**
   * Adds a state to the element
   * @param state {String} the state to be added
   *
   */
    addState : function(state) {
      if(this.__states === null) {
        this.__states = {};
      }
      this.__states[state] = true;
      this.addClass(state);
    },

    /**
     * Checkes whether the element has the state passed as argument
     * @param state {String} the state to be checked
     * @return {Boolean} true if the element has the state, false if it doesn't.
     *
     */
    hasState : function(state) {
      return this.__states!==null && this.__states[state] ;
    },

    /**
     * Removes a state from the element
     * @param state {String} the state to be removed
     *
     */
    removeState : function(state) {
      if(this.hasState(state)) {
        delete this.__states[state];
        this.removeClass(state);
      }
    },

    /**
     * Replaces a state of the element with a new state.
     * If the element doesn't have the state to be removed, then th new state will
     * just be added.
     * @param oldState {String} the state to be replaced
     * @param newState {String} the state to get injected in the oldState's place
     *
     */
    replaceState : function(oldState, newState) {
      if(this.hasState(oldState))
      {
        delete this.__states[oldState];
        this.__states[newState] = true;
        this.removeClass(oldState);
        this.addClass(newState);
      }
      else
      {
        this.addState(newState);
      }
    }

  }
});
