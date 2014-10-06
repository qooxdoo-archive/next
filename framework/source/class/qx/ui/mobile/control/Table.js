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
 * This is a widget that enhances an HTML table with some basic features like
 * Sorting and Filtering.
 *
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 *
 * <h2>CSS Classes</h2>
 * <table>
 *   <thead>
 *     <tr>
 *       <td>Class Name</td>
 *       <td>Applied to</td>
 *       <td>Description</td>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><code>qx-table</code></td>
 *       <td>Table element</td>
 *       <td>Identifies the Table widget</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-cell</code></td>
 *       <td>Table cell (<code>td</code>)</td>
 *       <td>Identifies and styles a cell of the widget</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-header</code></td>
 *       <td>Table header (<code>th</code>)</td>
 *       <td>Identifies and styles a header of the table widget</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-row-selection</code></td>
 *       <td>Table cell (<code>td</code>)</td>
 *       <td>Identifies and styles the cells containing the inputs for the row selection</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-selection-input</code></td>
 *       <td><code>input</code></td>
 *       <td>Identifies and styles input element to select a table row</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-input-label</code></td>
 *       <td>Label element (<code>label</code>)</td>
 *       <td>Identifies and styles label contained in the selection cell. This label can be used to create custom inputs</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-row-selected</code></td>
 *       <td>Selected row (<code>tr</code>)</td>
 *       <td>Identifies and styles the selected table rows</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-sort-asc</code></td>
 *       <td>Table header (<code>th</code>)</td>
 *       <td>Identifies and styles the header of the current ascendant sorted column</td>
 *     </tr>
 *     <tr>
 *       <td><code>qx-table-sort-desc</code></td>
 *       <td>Table header (<code>th</code>)</td>
 *       <td>Identifies and styles the header of the current descendant sorted column</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @group (Widget)
 * @require(qx.module.Template)
 * @require(qx.module.util.String)
 *
 */
qx.Class.define("qx.ui.mobile.control.Table", {

  extend : qx.ui.mobile.Widget,

  construct : function(model, element) {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    this.model =  model;

    if (qxWeb.getNodeName(this).toUpperCase() !== "TABLE") {
      throw new Error("The collection may contain only a table element!");
    }

    if(!this[0].tHead){
      throw new Error("A Table header element is required for this widget.");
    }

    this.find("tbody td").addClass("qx-table-cell");

    this.__inputName =  "input" + qx.ui.mobile.control.Table.__getUID();
    this.__getColumnMetaData(model);
    this.setSortingFunction(this.__defaultColumnSort);

    this.__registerEvents();

    this.render();
  },

  events : {
    /** Fires at each model change */
    "modelChange" : "Array",
    /** Fires at each selection change */
    "selectionChange" : "qxWeb",
    /** Fires each time a cell of the widget is clicked */
    "cellClicked" : "Object",
    /** Fires after the model has been applied to the widget */
    "modelApplied" : "Array",
    /** Fires each time the value of a cell is rendered into the cell */
    "cellRender" : "Object",
    /** Fires after the table rows have been sorted */
    "sort" : "Object",
    /** Fires after the table rows have been filtered */
    "filter" : "Object"
  },

  properties: {

    model: {
      check: "Array",
      event: true
    },

    /**
     * Defines the row selection type.
     */
    rowSelection: {
      init: "none",
      check: function(value) {
        return ['none', 'single', 'multiple'].indexOf(value) !== -1;
      }
    },

    /**
     * Determines if the string sorting/filtering should be case sensitive or not.
     */
    caseSensitive: {
      check: "Boolean",
      init: false
    }
  },


  statics : {

    /**
     * The Default cell template for all the table columns. Default value :
     *
     * <pre>
     *   <td class='qx-table-cell' data-qx-table-cell-key='{{ cellKey }}'>
     *     <div class='qx-table-cell-wrapper'>
     *       <label>{{& value }}</label>
     *     </div>
     *   <td>"
     * </pre>
     *
     * To define a custom template for a specific name use <code>setTemplate('colname', template)</code> or use <br>
     * <code>setTemplate('columnDefault', template)</code> to set one template for all your table columns.
     *
     */
    _templates : {
      columnDefault : "<td class='qx-table-cell' data-qx-table-cell-key='{{ cellKey }}'>"+
                          "<div class='qx-table-cell-wrapper'>"+
                            "<label>{{& value }}</label>"+
                          "</div>"+
                        "<td>"
    },


    /**
     * Checks if a given string is a number
     * @param n {String} The String to check the type for
     * @return {Boolean} The result of the check
     */
    __isNumber : function(n) {
      return (Object.prototype.toString.call(n) === '[object Number]' ||
        Object.prototype.toString.call(n) === '[object String]') && !isNaN(parseFloat(n)) && isFinite(n.toString().replace(/^-/, ''));
    },

    /**
     * Checks if a given string is a Date
     * @param val {String} The String to check the type for
     * @return {Boolean} The result of the check
     */
    __isDate : function(val) {
      var d = new Date(val);
      return !isNaN(d.valueOf());
    },

    /**
     * Gets the index of an HTMLElement inside of an HTMLCollection
     * @param htmlCollection {HTMLCollection} The HTMLCollection
     * @param htmlElement {HTMLElement} The HTMLElement
     * @return {Integer} The position of the htmlElement or -1
     */
    __getIndex : function(htmlCollection, htmlElement) {
      var index = -1;
      for (var i = 0, l = htmlCollection.length; i < l; i++) {
        if (htmlCollection.item(i) == htmlElement) {
          index = i;
          break;
        }
      }
      return index;
    },

    /**
    * Generates an unique id
    * @return {String} The generated id
    */
    __getUID : function() {
      return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
    },

    __internalCellClass : "qx-table-cell",
    __internalHeaderClass : "qx-table-header",
    __internalSelectionClass : "qx-table-row-selection",
    __internalInputClass : "qx-table-selection-input",
    __allColumnSelector : "qx-table-all-columns",
    __dataColName : "data-qx-table-col-name",
    __dataColType : "data-qx-table-col-type",
    __dataSortingKey : "data-qx-table-cell-key",
    __modelSortingKey : "cellKey",
    __inputLabelClass : "qx-table-input-label",
    __selectedRowClass : "qx-table-row-selected",
    __ascSortingClass : "qx-table-sort-asc",
    __descSortingClass :  "qx-table-sort-desc"

  },



  members : {

    __columnMeta: null,
    __filters: null,
    __filterFunc: null,
    __sortingData: null,
    __rowSelection: null,
    __inputName: null,
    __sortingFunction: null,


    getTemplate: function(name) {
      return qx.ui.mobile.control.Table._templates[name];
    },


    /**
     * Set the column types for the table widgets in the collection
     * @param columnName {String} The column name
     * @param type {String} The type of the column
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    setColumnType : function(columnName, type) {
      this.__checkColumnExistance(columnName);
      this.__columnMeta[columnName].type = type;
      return this;
    },




    /**
     * Returns the type of the specified column
     * @param columnName {String} The column name
     * @return {String} The type of the specified column
     */
    getColumnType : function(columnName) {
      this.__checkColumnExistance(columnName);
      return this.__columnMeta[columnName].type;
    },


    /**
     * Returns the cell at the given position for the first widget in the collection
     * @param row {Integer} The row number
     * @param col {Integer} The column number
     * @return {qxWeb} The cell found at the given position
     */
    getCell : function(row, col) {
      return qxWeb(this.__getRoot().rows.item(row).cells.item(col));
    },


    /**
    * Returns a collection containing the rows of the first table in the collection.
    * @return {qxWeb} The collection containing the table rows
    */
    getRows : function() {
      return qxWeb(this.__getRoot().rows);
    },


    /**
     * Defines the comparison function to use to sort columns of the given type
     * @param type {String} The type to define the function for
     * @param compareFunc {Function} The comparison function
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    setCompareFunction : function(type, compareFunc) {
      type = qxWeb.string.firstUp(type);
      this["_compare" + type] = compareFunc;
      return this;
    },


    /**
     * Unset the compare function for the given type
     *
     * @param type {String} The type to unset the function for
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    unsetCompareFunction : function(type) {
      type = qxWeb.string.firstUp(type);
      var compareFunc = this["_compare" + type] || this._compareString;
      this["_compare" + type] = compareFunc;
      return this;
    },


    /**
     * Returns the comparison function for the given type
     * @param type {String} The type to get the comparison function for
     * @return {Function} The comparison function
     */
    getCompareFunction : function(type) {
      type = qxWeb.string.firstUp(type);
      return this["_compare" + type];
    },


    /**
     * Set the function that control the sorting process
     * @param func {Function} The sorting function
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    setSortingFunction : function(func) {
      this.__sortingFunction = func;
      return this;
    },


    /**
     * Unset the function that control the sorting process
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    unsetSortingFunction : function() {
      this.__sortingFunction = this.__defaultColumnSort;
      return this;
    },


    /**
    * Set the filter function to use to filter a specific column
    * @param columnName {String} The name of the column
    * @param func {Function} The filter
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    *
    */
    setColumnFilter : function(columnName, func) {
      this.__checkColumnExistance(columnName);
      if (!this.__filterFunc) {
        this.__filterFunc = {};
      }
      this.__filterFunc[columnName] = func;

      return this;
    },


    /**
    * Returns the filter function set on a specific column
    *
    * @param columnName {String} The name of the column
    * @return {Function} The filter function
    *
    */
    getColumnFilter : function(columnName) {
      if (this.__filterFunc) {
        return this.__filterFunc[columnName];
      }
      return null;
    },


    /**
    * Set the filter function to use to filter the table rows
    * @param func {Function} The filter
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    setRowFilter : function(func) {
      if (!this.__filterFunc) {
        this.__filterFunc = {};
      }
      this.__filterFunc.row = func;

      return this;
    },


    /**
    * Returns the filter function set on a specific column
    * @return {Function} The filter function
    *
    */
    getRowFilter : function() {
      if (this.__filterFunc) {
        return this.__filterFunc.row;
      }
      return null;
    },


    /**
     * Sort the column with the given name according to the specified direction
     * @param columnName {String} The name of the column to sort
     * @param dir {String} The sorting direction (asc or desc)
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    sort : function(columnName, dir) {
      this.__checkColumnExistance(columnName);
      this.setSortingClass(columnName, dir);
      this.__sortDOM(this.__sort(columnName, dir));

      this.emit("sort", {columName : columnName, direction : dir});

      return this;
    },


    /**
    * Filters rows or columns according to the given parameters
    * @param keyword {String} The keyword to use to filter
    * @param columnName {String ?} The column name
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    filter : function(keyword, columnName) {
      if (columnName) {
        this.__checkColumnExistance(columnName);
        if (keyword === "") {
          this.resetFilter(columnName);
        }
      } else {
        columnName = qx.ui.mobile.control.Table.__allColumnSelector;
      }

      if (!this.__filters) {
        this.__filters = {};
      }

      if (this.__filters[columnName]) {
        this.__filters[columnName].keyword = keyword;
        this.__getRoot().appendChild(this.__filters[columnName].rows);
      } else {
        this.__filters[columnName] = { keyword : keyword, rows : document.createDocumentFragment() };
      }

      this.__filterDom(keyword, columnName);

      this.emit("filter", {columName : columnName, keyword : keyword});

      return this;
    },


    /**
    * Resets the filter apllied on a specific column
    * @param columnName {String ?} The column name
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    resetFilter : function(columnName) {
      var filters = null;
      filters = this.__filters;
      if (filters) {
        if (columnName) {
          this.__getRoot().appendChild(filters[columnName].rows);
        } else {
          for (var col in filters) {
            this.__getRoot().appendChild(filters[col].rows);
          }
        }
      }

      return this;
    },


    // overridden
    _getTagName : function() {
      return "table";
    },


    /**
    * Filters the rendered table cells
    * @param keyword {String} The keyword to use to filter
    * @param columnName {String ?} The column name
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    __filterDom : function(keyword, columnName) {
      var colIndex = this.__getColumnIndex(columnName);
      var filterFunc = columnName == qx.ui.mobile.control.Table.__allColumnSelector ? this.getRowFilter() : this.getColumnFilter(columnName);
      filterFunc = filterFunc || this.__defaultColumnFilter;

      var rows = this.__getDataRows(), data = {};

      for (var i = 0; i < rows.length; i++) {
        data = {
          columnName : columnName,
          columnIndex : colIndex,
          cell : colIndex ? qxWeb(rows[i].cells.item(colIndex)) : null,
          row : qxWeb(rows[i]),
          keyword : keyword
        };

        if (!filterFunc.bind(this)(data)) {
          this.__filters[columnName].rows.appendChild(rows[i]);
        }
      }

      return this;
    },


    /**
     * Get the current column sorting information for the first widget in the collection
     * @return {Map} The map containing the current sorting information
     */
    getSortingData : function() {
      return this.__sortingData;
    },


    //overriden
    render : function() {
      var sortingData = this.getSortingData();
      var rowSelection = this.rowSelection;

      this.__applyTemplate(this.model);
      this.__processSelectionInputs(rowSelection);

      if (sortingData) {
        this.__sortDOM(this.__sort(sortingData.columnName, sortingData.direction));
      }

      return this;
    },


    //Private API

    /**
    * Renders or removes the selection inputs according to the specified widget selection mode
    * @param rowSelection {String} The selection mode
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    __processSelectionInputs : function(rowSelection) {

      var currentSelection = this.__rowSelection || "none";
      var cssPrefix = "qx-table";

      switch (rowSelection) {

        case "none":
          if (currentSelection != "none") {
            qxWeb("." + qx.ui.mobile.control.Table.__internalSelectionClass).remove();
          }
          break;

        case "multiple":
          if (currentSelection == "none") {
            this.__createInputs("checkbox");
          } else if (currentSelection == "single") {
            qxWeb("." + qx.ui.mobile.control.Table.__internalSelectionClass + " input").setAttribute("type", "checkbox");
            qxWeb("."+cssPrefix+"-radio").removeClass(cssPrefix+"-radio").addClass(cssPrefix+"-checkbox");
          }
          break;

        case "single":
          if (currentSelection == "none") {
            this.__createInputs("radio");
          } else if (currentSelection == "multiple") {
            qxWeb("." + qx.ui.mobile.control.Table.__internalSelectionClass + " input").setAttribute("type", "radio");
            qxWeb("."+cssPrefix+"-checkbox").removeClass(cssPrefix+"-checkbox").addClass(cssPrefix+"-radio");
          }
          break;
      }

      this.__rowSelection = rowSelection;

      return this;
    },


    /**
     * Creates input nodes for the row selection
     * @param type {String} The type of the inputs to creates
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __createInputs : function(type) {
      var rows = this[0].rows;
      for (var i = 0; i < rows.length; i++) {
        this.__createInput(rows.item(i), type);
      }
      return this;
    },


    /**
    * Creates an input an input node for a specific row
    * @param row {HTMLTableRowElement} The row to create the input for
    * @param type {String} The type of the input tom create (radio or checkbox)
    * @param nodeName {String} The nodename of the table cell that will contain the input
    */
    __createInput : function(row, type, nodeName) {

      var cssPrefix = "qx-table";

      if (typeof nodeName == "undefined") {
        nodeName = qxWeb.getNodeName(qxWeb(row.cells.item(0)));
      }

      var clazz = qx.ui.mobile.control.Table, inputName = this.__inputName;
      var className = (nodeName == "th") ? clazz.__internalSelectionClass + " " + clazz.__internalHeaderClass : clazz.__internalSelectionClass;
      var id = qx.ui.mobile.control.Table.__getUID();
      var inputNode = qxWeb.create("<" + nodeName + " class='" + className + "'><input id='"+id+"' name='" + inputName + "' class='"+cssPrefix+"-"+type+" "+ clazz.__internalInputClass + "' type='" + type + "' /><label class='"+clazz.__inputLabelClass+"' for='"+id+"'></label></" + nodeName + ">");
      if (row.cells.item(0)) {
        inputNode.insertBefore(qxWeb(row.cells.item(0)));
      } else {
        inputNode.appendTo(qxWeb(row));
      }
    },


    /**
    * Checks if a column with the specified name exists
    * @param columnName {String} The name of the column to check
    */
    __checkColumnExistance : function(columnName) {
      var data = this.__columnMeta;
      if (data && !data[columnName]) {
        throw new Error("Column " + columnName + " does not exist!");
      }
    },


    /**
    * Returns the row containing the cells with the column names
    * @return {HTMLTableRowElement} The row with meta information
    */
    __getHeaderRow : function(){
      var tHeadOrFoot = this[0].tHead;
      if (!tHeadOrFoot) {
        throw new Error("A Table header element is required for this widget.");
      }
      return tHeadOrFoot.rows.item(0);
    },


    /**
     * Initializes columns metadata
     * @param model {Array} The widget's model
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __getColumnMetaData : function(model) {

      this.__addClassToHeaderAndFooter(this[0].tHead);
      this.__addClassToHeaderAndFooter(this[0].tFoot);

      var data = {}, cells = null, colName = null, cell = null;

      cells = this[0].tHead.rows.item(0).cells;

      for (var i = 0, l = cells.length; i < l; i++) {

        cell = qxWeb(cells.item(i));
        colName = this.__getColumName(cell[0]) || qx.ui.mobile.control.Table.__getUID();
        if(!cell[0].getAttribute(qx.ui.mobile.control.Table.__dataColName)){
          cell.setAttribute(qx.ui.mobile.control.Table.__dataColName, colName);
        }

        data[colName] = {
          type: cell[0].getAttribute(qx.ui.mobile.control.Table.__dataColType) || "String",
          name: colName
        };

      }

      this.__columnMeta = data;

      return this;
    },


    /**
     * Adds the internal css class to the header and footer cells
     * @param footOrHead {HTMLElement} Html element representing the header or footer of the table
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __addClassToHeaderAndFooter : function(footOrHead) {
      if (footOrHead && footOrHead.rows.length > 0) {
        if (footOrHead.rows.item(0).cells.length > 0) {
          if (!qxWeb(footOrHead.rows.item(0).cells.item(0)).hasClass(qx.ui.mobile.control.Table.__internalHeaderClass)) {
            qxWeb(footOrHead.rows.item(0).cells).addClass(qx.ui.mobile.control.Table.__internalHeaderClass);
          }
        }
      }
      return this;
    },


    /**
     * Sorts the rows of the table widget
     * @param dataRows {Array} Array containing the sorted rows
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __sortDOM : function(dataRows) {
      for (var i = 0, l = dataRows.length; i < l; i++) {
        if (i) {
          qxWeb(dataRows[i]).insertAfter(dataRows[i - 1]);
        } else {
          qxWeb(dataRows[i]).insertBefore(qxWeb(this.__getRoot().rows.item(0)));
        }
      }
      //this.__dataRows = dataRows;
      return this;
    },


    /**
     * registers global events
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __registerEvents : function() {
      this.on("tap", this.__detectClickedCell);
      this.on("cellClicked", function(data) {
        if(data.cell && data.cell.hasClass(qx.ui.mobile.control.Table.__internalHeaderClass)){
          this.__sortingFunction.bind(this)(data);
        }
      }, this);
      return this;
    },


    /**
    * Checks if the selection inputs are already rendered
    * @return {Boolean} True if the inputs are rendered and false otherwise
    */
    __selectionRendered : function() {
      return qxWeb("." + qx.ui.mobile.control.Table.__internalSelectionClass).length > 0;
    },


    /**
    * Handles clicks that happen on the selection inputs
    * @param cell {qxWeb} The table cell containing the clicked input
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    __processSelection : function(cell) {

      var clazz = qx.ui.mobile.control.Table;
      var inputs = qxWeb("." + clazz.__internalInputClass);
      var clickedInput = cell.find("input");
      var selectionMode = this.rowSelection;
      var headerInput = qxWeb("." + clazz.__internalHeaderClass + " input");
      var selection = [];

      if (selectionMode == "multiple") {

        if (cell.hasClass(clazz.__internalHeaderClass)) {
          inputs.setAttribute("checked", clickedInput[0].checked);
        }

        var checked = true;
        for (var i = 0; i < inputs.length; i++) {
          if ((inputs[i] != headerInput[0]) && (!inputs[i].checked)) {
            checked = false;
            break;
          }
        }

        headerInput.setAttribute("checked", checked);
        inputs = inputs.toArray();

        if (checked) {
          qxWeb.array.remove(inputs, headerInput[0]);
          selection = inputs;
        } else {
          selection = inputs.filter(function(input) {
            return input.checked;
          });
        }
      } else {
        if (clickedInput[0] != headerInput[0]) {
          selection.push(clickedInput[0]);
        }
      }

      var selectedRows = selection.map(function(elem) {
        return elem.parentNode.parentNode;
      });

      selectedRows = qxWeb(selectedRows);
      qxWeb("."+clazz.__selectedRowClass).removeClass(clazz.__selectedRowClass);
      selectedRows.addClass(clazz.__selectedRowClass);

      this.emit("selectionChange", {rows : qxWeb(selectedRows)});

      return this;
    },


    /**
     * Click callbak
     *
     * @param e {Event} The native click event.
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __detectClickedCell : function(e) {

      var target = e.target;

      var cell = qxWeb(target);
      var clazz = qx.ui.mobile.control.Table;

      while (!(cell.hasClass(clazz.__internalCellClass) || cell.hasClass(clazz.__internalHeaderClass) || cell.hasClass(clazz.__internalSelectionClass))) {
        if (cell.hasClass(this.classname)) {
          cell = null;
          break;
        }
        cell = cell.getParents().eq(0);
      }

      if (cell.hasClass(clazz.__internalSelectionClass)) {
        window.setTimeout(function(){
          this.__processSelection(cell);
        }.bind(this), 5);
      }else{
        if (cell && cell.length > 0) {
          var row = cell[0].parentNode, cells = row.cells;
          var colNumber = qx.ui.mobile.control.Table.__getIndex(cells, cell[0]);
          var tHead = this.__getHeaderRow();
          var headCell = tHead.cells.item(colNumber);
          var colName = this.__getColumName(headCell);
          var columnIndex = this.rowSelection != "none" ? this.__getColumnIndex(colName) -1 : this.__getColumnIndex(colName);

          this.emit("cellClicked", {
            columnIndex : columnIndex,
            columnName: colName,
            cell: qxWeb(cell)
          });
        }
      }

      return this;
    },


    /**
     * Applies the given model to the table cells depending on
     * the mustache template specified before
     * @param model {Array} The model to apply
     * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
     */
    __applyTemplate : function(model) {

      var cell, row;
      var tHead = this.__getHeaderRow();
      var createdRow = null, colMeta = null;
      var renderedRow = null;

      var inputType = (this.rowSelection == "single") ? "radio" : "checkbox";

      if (this.__getRoot().rows.length > model.length) {
        this.__deleteRows(model.length);
      }

      var renderedColIndex = 0, templateApplied = false;
      var coltemplate = this.getTemplate("columnDefault");
      var colName = null;

      for (var i = 0, rowCount = model.length; i < rowCount; i++) {

        row = model[i];

        if (!this.__isRowRendered(i)) {
          createdRow = this.__getRoot().insertRow(i);
          if (this.__selectionRendered()) {
            this.__createInput(createdRow, inputType, "td");
          }
        }

        for (var j = 0, colCount = row.length; j < colCount; j++) {

          renderedColIndex = this.__selectionRendered() ? j + 1 : j;
          colName = this.__getColumName(tHead.cells.item(renderedColIndex));
          colMeta = this.__getDataForColumn(colName);
          coltemplate = this.getTemplate(colName) || coltemplate;
          renderedRow = this.__getRoot().rows.item(i);
          cell = qxWeb.create(qxWeb.template.render(coltemplate, model[i][j]))[0];

          if(cell.nodeName.toUpperCase() != "TD") {
            break;
          }

          if (!this.__isCellRendered(i, renderedColIndex)) {
            renderedRow.appendChild(cell);
          }else {
            renderedRow.replaceChild(cell, this.getCell(i, renderedColIndex)[0]);
          }
          this.emit("cellRender", {cell : cell, row : i, col : j, value : model[i][j]});
        }

        if(i == rowCount-1) {
          templateApplied = true;
        }

      }

      if (templateApplied) {
        this.emit("modelApplied", model);
      }

      return this;
    },


    /**
    * Removes row from the DOM starting from the specified index
    * @param  rowCount {Integer} The number of rows the kept
    * @return {qx.ui.mobile.control.Table} <code>this</code> reference for chaining.
    */
    __deleteRows : function(rowCount) {
      var renderedRows = this.__getRoot().rows;
      while(renderedRows.length > rowCount){
        this[0].deleteRow(renderedRows.length);
      }
      return this;
    },


    /**
    * Gets the metadata of the column width the specified name
    * @param columName {String} The name of the column to get the metadata for
    * @return {Map} Map containing the metadata
    */
    __getDataForColumn : function(columName) {
      return this.__columnMeta[columName];
    },


    /**
     * Gets the Root element contening the data rows
     * @return {HTMLElement} The element containing the data rows
     */
    __getRoot : function() {
      return this[0].tBodies.item(0) || this[0];
    },


    /**
     * Checks if the row with the given index is rendered
     * @param index {Integer} The index of the row to check
     * @return {Boolean} The result of the check
     */
    __isRowRendered : function(index) {
      if (this.__getRoot().rows.item(index)) {
        return true;
      }
      return false;
    },


    /**
     * Checks if the cell with the given row and column indexes is rendered
     * @param rowIndex {Integer} The index of the row to check
     * @param colIndex {Integer} The index of the column
     * @return {Boolean} The result of the check
     */
    __isCellRendered : function(rowIndex, colIndex) {
      if (!this.__isRowRendered(rowIndex)) {
        return false;
      }
      if (this.__getRoot().rows.item(rowIndex).cells.item(colIndex)) {
        return true;
      }
      return false;
    },


    /**
     * Adds a class to the head and footer of the current sorted column
     * @param columnName {String} The name of the sorted column
     * @param dir {String} The sorting direction
     */
    setSortingClass : function(columnName, dir) {

      var data = {
        columnName: columnName,
        direction: dir
      };

      this.__sortingData = data;
      this.__addSortingClassToCol(this[0].tHead, columnName, dir);
      this.__addSortingClassToCol(this[0].tFoot, columnName, dir);
    },


    /**
     * Adds a class to the head or footer of the current sorted column
     * @param HeaderOrFooter {Node} The n
     * @param columnName {String} The name of the sorted column
     * @param dir {String} The sorting direction
     */
    __addSortingClassToCol : function(HeaderOrFooter, columnName, dir) {
      if (HeaderOrFooter && HeaderOrFooter.rows.length > 0) {
        qxWeb(HeaderOrFooter.rows.item(0).cells).removeClasses(["qx-table-sort-asc", "qx-table-sort-desc"]);
        var cell = qxWeb("["+qx.ui.mobile.control.Table.__dataColName+"='" + columnName + "'], #" + columnName);
        cell.addClass("qx-table-sort-" + dir);
      }
    },


    /**
     * Sorts the table rows for the given row and direction
     * @param columnName {String} The name of the column to be sorted
     * @param direction {String} The sorting direction
     * @return {Array} Array containinfg the sorted rows
     */
    __sort : function(columnName, direction) {

      var meta = this.__getDataForColumn(columnName);
      var columnType = qxWeb.string.firstUp(meta.type);

      if(!this["_compare" + columnType]) {
        columnType = "String";
      }

      var compareFunc = this.getCompareFunction(columnType).bind(this);
      var model = this.__getDataRows();
      var columnIndex = this.__getColumnIndex(columnName);

      return model.sort(function(a, b) {
        var x = this.__getSortingKey(qxWeb(a.cells.item(columnIndex)));
        var y = this.__getSortingKey(qxWeb(b.cells.item(columnIndex)));
        return compareFunc(x, y, direction);
      }.bind(this));

    },


    /**
     * Compares two number
     * @param x {String} The String value of the first number to compare
     * @param y {String} The String value of the second number to compare
     * @param direction {String} The sorting direction
     * @return {Integer} The result of the comparison
     */
    _compareNumber : function(x, y, direction) {
      x = qx.ui.mobile.control.Table.__isNumber(x) ? Number(x) : 0;
      y = qx.ui.mobile.control.Table.__isNumber(y) ? Number(y) : 0;
      if (direction == "asc") {
        return x - y;
      } else if (direction == "desc") {
        return y - x;
      }
      return 0;
    },


    /**
    * Gets the name of the column containing the given cell
    * @param headerCell {HTMLTableCellElement} The cell to get the column name for
    * @return {String} The column name
    */
    __getColumName : function(headerCell) {
      return headerCell.getAttribute(qx.ui.mobile.control.Table.__dataColName) || headerCell.getAttribute("id");
    },


    /**
     * Compares two Dates
     * @param x {String} The String value of the first date to compare
     * @param y {String} The String value of the second date to compare
     * @param direction {String} The sorting direction
     * @return {Integer} The result of the comparison
     */
    _compareDate : function(x, y, direction) {

      x = qx.ui.mobile.control.Table.__isDate(x) ? new Date(x) : new Date(0);
      y = qx.ui.mobile.control.Table.__isDate(y) ? new Date(y) : new Date(0);

      if (direction == "asc") {
        return x - y;
      } else if (direction == "desc") {
        return y - x;
      }
      return 0;
    },


    /**
     * Compares two Strings
     * @param x {String} The first string to compare
     * @param y {String} The second string to compare
     * @param direction {String} The sorting direction
     * @return {Integer} The result of the comparison
     */
    _compareString : function(x, y, direction) {
      if (!this.caseSensitive) {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      if (direction == "asc") {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      } else if (direction == "desc") {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      }
      return 0;
    },


    /**
    * Returns the value of the cell to use for sorting
    * @param cell {qxWeb} The cell to get the value of.
    * @return {String} The sorting key
    */
    __getSortingKey : function(cell) {
      return cell.getAttribute(qx.ui.mobile.control.Table.__dataSortingKey) || this.__getCellValue(cell);
    },


    /**
     * Returns the value of the cell that will be used for sorting
     * @param cell {qxWeb} The cell to get the value of
     * @return {String} The text content of the cell
     */
    __getCellValue : function(cell) {
      return cell.getAttribute("text") || "";
    },


    /**
     * Gets the table's data rows from the DOM
     * @return {Array} Array containing the rows of the table
     */
    __getDataRows : function() {

      var tableNode = this[0];
      var rows = tableNode.rows, model = [], cell=null,  cells = [];

      for (var i = 0, l = rows.length; i < l; i++) {
        cells = rows.item(i).cells;
        if ((cells.length > 0) && (cells[0].nodeName.toUpperCase() != "TD")) {
          continue;
        }

        for (var j = 0, len = cells.length; j < len; j++) {
          cell = qxWeb(cells[j]);
          if (!cell.hasClass(qx.ui.mobile.control.Table.__internalCellClass)) {
            cell.addClass(qx.ui.mobile.control.Table.__internalCellClass);
          }
        }

        model.push(rows.item(i));
      }
      return model;
    },


    /**
     * Default sorting processing
     * @param data {Map} Sorting data
     */
    __defaultColumnSort : function(data) {
      var dir = "asc";
      var sortedData = this.getSortingData();

      if (sortedData) {
        if (data.columnName == sortedData.columnName) {
          if (sortedData.direction == dir) {
            dir = "desc";
          }
        }
      }
      if (data.cell[0].nodeName.toUpperCase() == "TH") {
        this.sort(data.columnName, dir);
      }
    },


    /**
    * Default column filter function
    * @param data {Map} Map containing the filter data
    * @return {Boolean} True wenn the row containing the current cell should be kept
    */
    __defaultColumnFilter : function(data) {
      var cell = data.columnName == qx.ui.mobile.control.Table.__allColumnSelector ? data.row : data.cell;
      var cellValue = this.__getCellValue(cell);

      if (this.caseSensitive) {
        return cellValue.indexOf(data.keyword) != -1;
      } else {
        return cellValue.toLowerCase().indexOf(data.keyword.toLowerCase()) != -1;
      }
    },


    /**
     * Gets the index of the column with the specified name
     * @param columnName {String} The colukn name
     * @return {Integer} The index of the column or -1 if the column does'nt exists
     */
    __getColumnIndex : function(columnName) {
      var tHead = this.__getHeaderRow();
      var cells = tHead.cells;
      for (var i = 0; i < cells.length; i++) {
        if (columnName == this.__getColumName(cells.item(i))) {
          return i;
        }
      }
      return -1;
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }

});