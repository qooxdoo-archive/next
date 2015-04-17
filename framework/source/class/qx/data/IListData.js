define(['qx/Interface'], function(Dep0) {
var qx = {
  "Interface": Dep0,
  "data": {
    "IListData": null
  }
};

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
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * This interface defines a data structure compatible with the data binding
 * controllers.
 * It defines a minimum of functionality which the controller need to work.
 * @require(qx.data.IListData#getItem)
 * @require(qx.data.IListData#setItem)
 * @require(qx.data.IListData#splice)
 * @require(qx.data.IListData#contains)
 * @require(qx.data.IListData#getLength)
 * @require(qx.data.IListData#toArray)
 */
var clazz = qx.Interface.define("qx.data.IListData",
{
  events :
  {
    /**
     * The change event which will be fired if there is a change in the data structure.
     * The data contains a map with three key value pairs:
     *
     * <li>start: The start index of the change.</li>
     * <li>end: The end index of the change.</li>
     * <li>type: The type of the change as a String. This can be 'add',
     * 'remove', 'order' or 'add/remove'</li>
     * <li>added: The items which has been added (as a JavaScript array)</li>
     * <li>removed: The items which has been removed (as a JavaScript array)</li>
     */
    "change" : "qx.event.type.Data",

    /**
     * The changeLength event will be fired every time the length of the
     * data structure changes.
     */
    "changeLength": "qx.event.type.Event"
  },


  members :
  {
    /**
     * Returns the item at the given index
     *
     * @param index {Number} The index requested of the data element.
     *
     * @return {var} The element at the given index.
     */
    /* eslint no-unused-vars:0 */
    getItem : function(index) {},


    /**
     * Sets the given item at the given position in the data structure. A
     * change event has to be fired.
     *
     * @param index {Number} The index of the data element.
     * @param item {var} The new item to set.
     */
    /* eslint no-unused-vars:0 */
    setItem : function(index, item) {},


    /**
     * Method to remove and add new element to the data. For every remove or
     * add a change event should be fired.
     *
     * @param startIndex {Integer} The index where the splice should start
     * @param amount {Integer} Defines number of element which will be removed
     *   at the given position.
     * @param varargs {var} All following parameters will be added at the given
     *   position to the array.
     * @return {qx.data.Array} An array containing the removed elements.
     */
    /* eslint no-unused-vars:0 */
    splice : function(startIndex, amount, varargs) {},


    /**
     * Check if the given item is in the current data structure.
     *
     * @param item {var} The item which is possibly in the data structure.
     * @return {Boolean} true, if the array contains the given item.
     */
    /* eslint no-unused-vars:0 */
    contains : function(item) {},


    /**
     * Returns the current length of the data structure.
     *
     * @return {Number} The current length of the data structure.
     */
    /* eslint no-unused-vars:0 */
    getLength : function() {},


    /**
     * Returns the list data as native array.
     *
     * @return {Array} The native array.
     */
    /* eslint no-unused-vars:0 */
    toArray: function() {}
  }
});

 qx.data.IListData = clazz;
return clazz;
});
