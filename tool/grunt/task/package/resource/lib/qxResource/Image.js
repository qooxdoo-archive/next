/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

***************************************************************************** */

// qooxdoo code isn't strict-compliant yet
// 'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// native
var fs = require("fs");
var path = require("path");

// qx
var q = require('qooxdoo');

// third party
var imgsize = require('image-size');

//------------------------------------------------------------------------------
// Class
//------------------------------------------------------------------------------

q.Class.define("qxResource.Image",
{
  extend: qx.core.Object,

  /**
   * Represents a physical image file.
   *
   * @constructs qxResource.Image
-   * @param {string} relImgPath - rel path to image
   * @param {string} namespace - namespace the image is associated with
   */
  construct: function(relImgPath, namespace)
  {
    this.base(arguments);
    this.__relpath = relImgPath;
    this.__namespace = namespace;
  },

  /** @lends qxResource.Image.prototype */
  members:
  {
    /** @type {string} */
    __relpath: null,
    /**
     * @type {Object}
     * @property {number} width
     * @property {number} height
     */
    __dimensions: null,
    /** @type {string} */
    __namespace: null,
    /** @type {string} */
    __format: null,

    /**
     * Collects info (e.g. dimensions and format) and populates the image with it.
     *
     * @param {string} imgBasePath
     */
    collectInfoAndPopulate: function(imgBasePath) {
      var absImgPath = path.join(imgBasePath, this.__relpath);
      if (!fs.existsSync(absImgPath)) {
        throw new Error("ENOENT: " + absImgPath);
      }

      imgData = imgsize(absImgPath);
      this.__format = imgData.type;
      delete imgData.type;
      this.__dimensions = imgData;
    },

    /**
     * Stringifies the image.
     *
     * @returns {Object} imageMap - <code>{myRelPathToImg: [32, 32, 'png', 'myNamespace']}</code>
     */
    stringify: function() {
      imgEntry = {};
      imgEntry[this.__relpath] = [
        (this.__dimensions !== null ? this.__dimensions.width : null),
        (this.__dimensions !== null ? this.__dimensions.height : null),
        this.__format,
        this.__namespace,
      ];
      return imgEntry;
    }
  }
});

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = qxResource.Image;
