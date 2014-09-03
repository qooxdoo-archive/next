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
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The image widget displays an image file.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var image = new qx.ui.mobile.basic.Image("path/to/icon.png");
 *
 *   this.getRoot().append(image);
 * </pre>
 *
 * This example create a widget to display the image
 * <code>path/to/icon.png</code>.
 *
 * @ignore(qx.application.Scaling.*)
 */
qx.Bootstrap.define("qx.ui.mobile.basic.Image",
{
  extend : qx.ui.mobile.core.Widget,


  /**
   * @param source {String?null} The URL of the image to display.
   */
  construct : function(source)
  {
    this.base(qx.ui.mobile.core.Widget, "constructor");

    this.source = source ? source : null;

    if (qx.application.Scaling) {
      qx.application.Scaling.getInstance().on("changeAppScale", this._onChangeAppScale, this);
    }
  },


  events :
  {
    /** Fired if the image source can not be loaded. */
    loadingFailed : null,

    /** Fired if the image has been loaded. */
    loaded : null
  },


  statics :
  {
    /** @type {Array} Possible pixel ratios of the current device operating system */
    PIXEL_RATIOS : ["3", "2", "1.5"],

    /** @type {String} a 1px*1px sized transparent image. */
    PLACEHOLDER_IMAGE : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",

    /**
     * Returns the application's total scale factor. It takes into account both
     * the application's font scale (determined by {@link qx.application.Scaling.get}) and
     * the device pixel ratio. The latter could be modified at runtime by the
     * browsers font scaling/zooming feature.
     *
     * @return {Number|null} the app scale factor. If a valid app scale could
     * be determined, it is rounded to a two decimal number. If it could not be
     * determined, <code>null</code> is returned.
     */
    getAppScale: function()
    {
      var pixelRatio = parseFloat(qx.core.Environment.get("device.pixelRatio").toFixed(2));
      var fontScale = qx.application.Scaling.getInstance().get();

      if (!isNaN(pixelRatio*fontScale)) {
        return parseFloat((pixelRatio*fontScale).toFixed(2));
      } else {
        return null;
      }
    }
  },


  properties :
  {
    /**
     * The URL of the image to display.
     */
    source :
    {
      check : "String",
      nullable : true,
      init : null,
      apply : "_applySource"
    }
  },


  members :
  {
    // overridden
    _getTagName : function() {
      return "img";
    },


    // property apply
    _applySource: function(value, old) {
      var resourceManager = qx.util.ResourceManager.getInstance();
      var source = value;

      if (source && source.indexOf('data:') != 0) {
        var uri = resourceManager.toUri(source);

        if (resourceManager.has(source)) {
          var highResSource = this._findHighResolutionSource(source);
          if (highResSource) {
            source = qx.ui.mobile.basic.Image.PLACEHOLDER_IMAGE;
            uri = resourceManager.toUri(highResSource);
          } else {
            source = uri;
          }
        }

        if (!qx.io.ImageLoader.isFailed(uri) && !qx.io.ImageLoader.isLoaded(uri)) {
          qx.io.ImageLoader.load(uri, this.__loaderCallback, this);
        }
      }

      this._setSource(source);
    },


    /**
    * Event handler for "changeAppScale" on application root.
    * Reloads the image source.
    */
    _onChangeAppScale : function() {
      this._applySource(this.source);
    },


    /**
    * Detects whether there is a high-resolution image available.
    * A high-resolution image is assumed to have the same file name as
    * the parameter source, but with a pixelRatio identifier before the file
    * extension, like "@2x".
    * Medium Resolution: "example.png", high-resolution: "example@2x.png"
    * If an image with a higher resolution is available, the method
    * {@link #_createHighResolutionOverlay} is called.
    *
    * @param lowResImgSrc {String} source of the low resolution image.
    * @return {String|null} The source of an high-resolution image source or <code>null</code>.
    */
    _findHighResolutionSource: function(lowResImgSrc) {
      if (!qx.application.Scaling) {
        return null;
      }
      var pixelRatioCandidates = qx.ui.mobile.basic.Image.PIXEL_RATIOS;

      // Calculate the optimal ratio, based on the rem scale factor of the application and the device pixel ratio.
      var factor = qx.ui.mobile.basic.Image.getAppScale();
      if (factor <= 1) {
        return false;
      }

      var i = pixelRatioCandidates.length;
      while (i > 0 && factor > pixelRatioCandidates[--i]) {}

      var hiResImgSrc;

      // Search for best img with a higher resolution.
      for (var k = i; k >= 0; k--) {
        hiResImgSrc = this._getHighResolutionSource(lowResImgSrc, pixelRatioCandidates[k]);
        if (hiResImgSrc) {
          this._createHighResolutionOverlay(hiResImgSrc,lowResImgSrc);
          return hiResImgSrc;
        }
      }

      // Search for best img with a lower resolution.
      for (var k = i + 1; k < pixelRatioCandidates.length; k++) {
        hiResImgSrc = this._getHighResolutionSource(lowResImgSrc, pixelRatioCandidates[k]);
        if (hiResImgSrc) {
          this._createHighResolutionOverlay(hiResImgSrc,lowResImgSrc);
          return hiResImgSrc;
        }
      }

      return null;
    },

    /**
    * Returns the source name for the high-resolution image based on the passed
    * parameters.
    * @param source {String} the source of the medium resolution image.
    * @param pixelRatio {Number} the pixel ratio of the high-resolution image.
    * @return {String} the high-resolution source name or null if no source could be found.
    */
    _getHighResolutionSource : function(source, pixelRatio) {
      var fileExtIndex = source.lastIndexOf('.');
      if (fileExtIndex > -1) {
        var pixelRatioIdentifier = "@" + pixelRatio + "x";
        var candidate = source.slice(0, fileExtIndex) + pixelRatioIdentifier + source.slice(fileExtIndex);

        if(qx.util.ResourceManager.getInstance().has(candidate)) {
          return candidate;
        }
      }
      return null;
    },


    /**
    * Creates an overlay for this image which shows the image defined by the parameter 'highResSource',
    * but has the same size and position as the source image.
    * The original image widget is hidden by this method.
    *
    * @param highResSource {String} Image source of the high-resolution image.
    * @param lowResSource {String} Image source of the low-resolution image.
    */
    _createHighResolutionOverlay : function(highResSource, lowResSource) {
      // Replace the source through transparent pixel for making the high-resolution background image visible.
      var resourceManager = qx.util.ResourceManager.getInstance();
      this.setStyle("backgroundImage","url("+resourceManager.toUri(highResSource)+")");
      this.setStyle("backgroundSize","100%");
      this.setStyle("backgroundRepeat","no-repeat");
      this.setStyle("backgroundPosition","50% 50%");
      this.setStyle("width", resourceManager.getImageWidth(lowResSource) / 16 + "rem");
      this.setStyle("height", resourceManager.getImageHeight(lowResSource) / 16 + "rem");
    },


    /**
     * Event handler fired after the preloader has finished loading the icon
     *
     * @param source {String} Image source which was loaded
     * @param imageInfo {Map} Dimensions of the loaded image
     */
    __loaderCallback : function(source, imageInfo)
    {
      // Ignore the callback on already disposed images
      if (this.$$disposed === true) {
        return;
      }

      // Output a warning if the image could not loaded and quit
      if (imageInfo.failed)
      {
        qx.log.Logger.warn("Image could not be loaded: " + source);
        this.emit("loadingFailed");
      }
      else if (imageInfo.aborted)
      {
        // ignore the rest because it is aborted
        return;
      }
      else
      {
        this.emit("loaded");
      }
    },


    /**
     * Sets the source attribute of the image tag.
     *
     * @param source {String} Image source which was loaded
     */
    _setSource : function(source)
    {
      this.setAttribute("src", source);
    },


    /**
     * Sets the attribute draggable to the given value "isDraggable".
     * @param isDraggable {Boolean} target value.
     */
    setDraggable : function(isDraggable) {
      if (isDraggable){
        this.setAttribute("draggable", "true");
      } else {
        this.setAttribute("draggable", "false");
      }
    },


    dispose : function() {
      this.base(qx.ui.mobile.core.Widget, "dispose");

      if (qx.application.Scaling) {
        qx.application.Scaling.getInstance().on("changeAppScale", this._onChangeAppScale, this);
      }
    }
  }
});
