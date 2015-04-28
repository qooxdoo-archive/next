"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * @require(qx.module.Template)
 * @group(Widget)
 */
qx.Class.define("qx.ui.Tree",
{
  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toTree}
   * @param element {Element?} The element used to create the widget.
   */
  construct : function(element)
  {
    this.super("construct", element);

    this._init();
  },


  statics :
  {
    __itemTemplate : "<li id='{{folderId}}'>" +
                       "<span class='{{mainCssClass}} {{statusCssClass}}'>{{folderDisplayname}}</span>" +
                     "</li>"
  },


  events : {

    /** Fires whenever a folder is selected */
    "selected" : "Element"
  },


  properties :
  {
    // overridden
    activatable : {
      init : true
    },


    // overridden
    defaultCssClass : {
      init : "tree"
    }
  },


  members :
  {
    __newFolderId : null,
    __lookupModel : null,
    __dataModel : null,


    // overridden
    _getTagName : function() {
      return "ul";
    },


    /**
     * Initializes the tree by adding listeners and creating new folder id's.
     */
    _init : function ()
    {
      this.__newFolderId = parseInt(Math.random() * 10000, 10);
      this.__lookupModel = {};
      this.__addListeners();
    },


    // Model-relevant

    /**
     * Set the model for the tree
     *
     * @param data {Object} data model to use.
     * @return {qx.ui.Tree} The collection for chaining.
     */
    setModel : function (data)
    {
      if(!data.id) {
        data.id = this.__getNextId();
      }

      this.__sortModel(data.children);

      this.__dataModel = data;

      this.__addRootFolderToLookupModel(data.id);

      // create the lookup model
      this.__initLookupModel(data.children, 1, data.id);

      this.__renderFirstLevel();

      return this;
    },


    /**
     * Returns the model item of the first tree in the collection
     *
     * @param modelId {String} the ID of the item to get
     * @return {Object}
     */
    getModelItemById : function (modelId) {
      return this.__lookupModel[modelId];
    },


    /**
     * Check if the given folder has subfolders
     *
     * @param folderId {Object} model item to check
     * @return {Boolean}
     */
    hasSubfolder : function (folderId) {
      var lookupModel = this.__lookupModel;
      for (var folder in lookupModel) {
        if (lookupModel[folder].parent === folderId) {
          return true;
        }
      }
      return false;
    },


    /**
     * Sort the model - the tree relies internally on a sorted
     * data structure so we have to make sure the data structure
     * and the DOM are in sync on startup.
     *
     * @param model {Array} children folders of the root
     */
    __sortModel : function (model) {

      // sort the current level
      model = this.__sortFolders(model);

      // then recurse over the sorted folders
      model.forEach(function (treeNode) {

        if(!treeNode.id){
          treeNode.id = this.__getNextId();
        }

        if (treeNode.children && treeNode.children.length > 0) {
          // use a closure to shield the variables
          (function (context, root) {
            context.__sortModel(root);
          })(this, treeNode.children);
        }

      }, this);

    },

    /**
     * Sorts the given folders
     *
     * @param folders {Array} List of folders to sort
     * @return {Array} sorted folders
     */
    __sortFolders : function (folders) {
      var sorted = folders.sort(function (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      return sorted;
    },


    /**
     * Adds the root folder to the lookup model
     *
     * @param rootId {String} data model Id of the root folder
     */
    __addRootFolderToLookupModel : function (rootId) {

      var lookupModel = {};

      lookupModel[rootId] = {
        "name": "/"
      };

      // enhance the internal data model
      lookupModel[rootId].level = 0;
      lookupModel[rootId].children = true;
      lookupModel[rootId].firstChild = this.__dataModel.children[0].id;
      lookupModel[rootId].parent = null;
      lookupModel[rootId].previousSibling = null;
      lookupModel[rootId].nextSibling = null;

      this.__lookupModel = lookupModel;

    },


    /**
    * Returns the next uniq id
    * @return {Integer} The next id
    */
    __getNextId : function () {
      this.__newFolderId = this.__newFolderId + 1;
      return this.__newFolderId.toString();
    },


    /**
     * Creates the internal lookup model. This methods is called recursively, so
     * it does operate on a part of the model.
     *
     * @param model {Array} The model to work on
     * @param level {Number} Hierarchy level - this info is added to the lookup model
     * @param parentId {String} the current parent - this info is added to the lookup model
     */
    __initLookupModel : function (model, level, parentId) {

      var previousSibling = null;
      var nextSibling = null;
      var previousModelItem = null,
        id = null;
      var lookupModel = this.__lookupModel;

      // build up the whole model at startup
      // unless there is a huge amount of folders it should work
      // without any issues

      // use forEach to avoid issues with IE <= 8
      model.forEach(function (treeNode) {
        // populate the lookupModel
        id = treeNode.id || (this.__getNextId()).toString();
        treeNode.id = id;

        lookupModel[id] = {
          "name": treeNode.name
        };

        // enhance the internal data model
        lookupModel[id].level = level;
        lookupModel[id].parent = parentId;
        lookupModel[id].previousSibling = previousSibling;
        lookupModel[id].nextSibling = nextSibling;

        if (previousModelItem !== null) {
          lookupModel[previousModelItem].nextSibling = id;
          lookupModel[id].previousSibling = previousModelItem;
        }

        previousModelItem = id;

        // recurse
        if (treeNode.children && treeNode.children.length > 0) {

          // use a closure to shield the variables
          (function (context, root, treeLevel) {
            context.__initLookupModel(root, ++treeLevel, parentId);
          })(this, treeNode.children, level, id);

          // only create hint that children are available
          lookupModel[id].children = true;
          if (!treeNode.children[0].id) {
            treeNode.children[0].id = (this.__getNextId()).toString();
          }

          lookupModel[id].firstChild = treeNode.children[0].id;
        } else {
          lookupModel[id].children = false;
          lookupModel[id].firstChild = null;
        }
      }, this);
    },


    // Rendering

    /**
     * Initial rendering of the first level of the tree
     */
    __renderFirstLevel : function () {

      var treeCollection = qxWeb();
      var folderCollection = qxWeb();
      var rootFolderToRender = {};
      var foldersToRender = {};
      var lookupModel = this.__lookupModel;

      for (var folder in lookupModel) {

        if (lookupModel[folder].parent === null) {
          rootFolderToRender[folder] = lookupModel[folder];
        }

        if (lookupModel[folder].parent === this.__dataModel.id) {
          foldersToRender[folder] = lookupModel[folder];
        }

      }

      // build the DOM nodes in memory
      folderCollection = this.__renderFolders(rootFolderToRender);

      // update the default state of the tree folder for the root node
      folderCollection.find("span").removeAttribute("class").addClass("open");

      treeCollection = treeCollection.concat(folderCollection);

      folderCollection.append(this.__getSubfolderMarkup());

      // build the DOM nodes in memory
      folderCollection.find("ul").append(this.__renderFolders(foldersToRender));

      // then append them in one step to the DOM
      this.append(treeCollection);

    },


    /**
     * Recursive method to render folders
     *
     * @param folders {Object} folders to render
     * @return {qxWeb} a collection of the folders
     */
    __renderFolders : function (folders) {
      var treeCollection = qxWeb();
      var folderCollection = null;

      for (var id in folders) {
        folderCollection = this.__renderNewFolder(id, folders[id]);
        folderCollection.setProperty("model", folders[id]);
        treeCollection = treeCollection.concat(folderCollection);
      }

      return treeCollection;
    },


    /**
    * Generates data to apply to the folder template.
    * @param id {String} The id of the folder.
    * @param meta {Map} Map containing the meta data for the folder.
    * @return {Map} The generated data
    */
    __getTemplateData : function(id, meta) {
      return {
        folderId : id,
        folderDisplayname : meta.name,
        mainCssClass : meta.children ? "" : "empty"
      };
    },


    /**
     * Renders a new folder based on the mustache template
     *
     * @param id {String} ID of the new folder
     * @param meta {Object} meta data of each folder
     * @return {qxWeb} rendered collection
     */
    __renderNewFolder : function (id, meta) {

      var template = qx.ui.Tree.__itemTemplate;
      var collection = qxWeb.template.renderToNode(template, this.__getTemplateData(id, meta));

      collection.getChildren("span:first-child").addClass("level-" + meta.level);

      return collection;
    },


    /**
     * Returns the markup for a subfolder structure
     *
     * @return {String} markup ready to use
     */
    __getSubfolderMarkup : function () {
      return "<ul class='subfolder'>";
    },


    /**
     * Get all the parents of the given model item recursively
     *
     * @param modelItem {Object} modelItem to start from
     * @return {Array} all parents of the item
     */
    __recursiveCollectParents : function (modelItem) {

      var lookupModel = this.__lookupModel;
      var parents = [];
      while (modelItem.parent !== null) {
        parents.push(modelItem);
        modelItem = lookupModel[modelItem.parent];
      }

      return parents;
    },


    // Events

    /**
     * Add the necessary listeners to the tree
     */
    __addListeners : function () {
      // all listeners should be attached at the tree container and make use of
      // event bubbling instead of adding the events to each folder.
      this.on("tap", this.__treeFolderTapped, this);
    },


    /**
     * Listener if a folder is clicked
     *
     * @param e {Event} native click event
     */
    __treeFolderTapped : function (e) {
      var target = e.target;
      var folder = qxWeb(target).getClosest("li");
      var folderId = folder.getAttribute("id");

      // do nothing when the user clicks at any white space within the tree container
      // -> no folderId could be determined
      if (folderId === null) {
        return;
      }

      this.emit("selected", folder);

      var lookupModel = this.__lookupModel;

      // root-level -> don't open / close the sub folders
      if (lookupModel[folderId].level === 0) {
        return;
      }

      // lookup the folder and open/close it
      var modelItem = this.getModelItemById(folderId);

      if (this.hasSubfolder(folderId)) {
        var firstChild = lookupModel[folderId].firstChild;
        var firstChildCollection = qxWeb("#" + firstChild);

        if (firstChildCollection.length > 0 && firstChildCollection.getStyle("display") !== "none") {
          this.__closeFolder(modelItem, folderId);
        } else {
          this.__openFolder(modelItem, folderId);
        }
      }

    },


    /**
     * Close the given folder
     *
     * @param  modelItem {Object} the model item in the internal lookup model
     * @param folderId {String} Id of the DOM node of the folder
     */
    __closeFolder: function (modelItem, folderId) {

      // update the state
      this.__toggleState(folderId);

      var lookupModel = this.__lookupModel;

      var firstChild = lookupModel[folderId].firstChild;

      var children = qxWeb("#" + firstChild);
      var nextSibling = firstChild;

      do {
        if (nextSibling !== null) {
          if (lookupModel[nextSibling].children) {
            this.__closeFolder(lookupModel[nextSibling], nextSibling);
          }

          children = children.concat(qxWeb("#" + nextSibling));
          nextSibling = lookupModel[nextSibling].nextSibling;
        }
      } while (nextSibling !== null);

      children.hide();
    },


    /**
     * Open the given folder
     *
     * @param modelItem {Object} the model item in the internal lookup model
     * @param folderId {String} Id of the DOM node of the folder
     */
    __openFolder: function (modelItem, folderId) {

      // update the state
      this.__toggleState(folderId);

      var start = null;
      var lookupModel = this.__lookupModel;

      if (lookupModel[folderId].children) {
        var firstChild = lookupModel[folderId].firstChild;

        // rendered or not
        var children = qxWeb("#" + firstChild);

        if (children.length > 0) {
          start = lookupModel[firstChild];
          var nextSibling = start.nextSibling;
          while (nextSibling !== null) {
            children = children.concat(qxWeb("#" + nextSibling));
            nextSibling = lookupModel[nextSibling].nextSibling;
          }
          children.show();
        } else {
          start = lookupModel[firstChild];
          var folders = {};
          folders[firstChild] = lookupModel[firstChild];

          while (start.nextSibling !== null) {
            folders[start.nextSibling] = lookupModel[start.nextSibling];
            start = lookupModel[start.nextSibling];
          }

          children = this.__renderFolders(folders);

          var subFolder = qxWeb.create(this.__getSubfolderMarkup());
          subFolder.append(children);

          qxWeb("#" + folderId).append(subFolder);
        }
      }
    },


    /**
     * Toggles the open / close state of the folder
     *
     * @param folderId {String} Id of the DOM node of the folder
     */
    __toggleState : function (folderId)
    {
      var label = qxWeb("#" + folderId).getChildren("span:first-child");
      label.toggleClass("open");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
