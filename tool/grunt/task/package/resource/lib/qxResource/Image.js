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
   * @param {string} absImgPath
   * @param {string} namespace - namespace the image is associated with
   */
  construct: function(absImgPath, namespace)
  {
    if (!fs.existsSync(absImgPath)) {
      throw new Error("ENOENT: " + absImgPath);
    }

    this.base(arguments);
    this.__abspath = absImgPath;
    this.__namespace = namespace;
  },

  /** @lends qxResource.Image.prototype */
  members:
  {
    /** @type {string} */
    __abspath: null,
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
     * Gets the format/extname of the given img path.
     *
     * @returns {string} extension
     */
    __getFormat: function() {
      if (!this.__format) {
        this.__format = imgsize(this.__abspath).type;
      }
      return this.__format;
    },

    /**
     * Gets the image size of the given image.
     *
     * @param {string} absImgPath
     * @returns {Object} result
     * @returns {number} result.width
     * @returns {number} result.height
     */
    __getImageSize: function() {
      if (this.__dimensions) {
        return this.__dimensions;
      }

      imgData = imgsize(this.__abspath);
      delete imgData.type;
      this.__dimensions = imgData;
      return imgData;
    },

    /**
     * Collects info (e.g. dimensions and format) and populates the image with it.
     */
    collectInfoAndPopulate: function() {
      imgData = imgsize(this.__abspath);

      this.__format = imgData.type;
      delete imgData.type;
      this.__dimensions = imgData;
    },

    /**
     * Stringifies the image.
     *
     * @returns {Object} imageMap - <code>{myabspathToImg: [32, 32, 'png', 'myNamespace']}</code>
     */
    stringify: function() {
      imgEntry = {};
      imgEntry[this.__abspath] = [
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
