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

/*
 * If you have added resources to your app remove the leading '*' in the
 * following line to make use of them.


************************************************************************ */

/**
 * Mobile page responsible for switching between provided themes.
 *
 * @asset(qx/css/*)
 * @require(qx.module.util.String)
 * @require(qx.module.Blocker)
 * @require(qx.module.Io)
 */
qx.Class.define("mobileshowcase.page.Theming",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "construct");
    this.title = "Theming";

    this.__preloadThemes();
  },


  statics :
  {
    THEMES: [{
      "name": "Indigo",
      "css": "resource/mobileshowcase/css/indigo.css"
    }, {
      "name": "Flat",
      "css": "resource/mobileshowcase/css/flat.css"
    }]
  },


  members :
  {
    __slider : null,
    __demoImageLabel : null,
    __appScale : null,
    __fontScale : null,


    /**
     * Preloads all css files for preventing flickering on theme switches.
     */
    __preloadThemes : function() {
      for(var i = 0; i < mobileshowcase.page.Theming.THEMES.length; i++) {
        var cssResource = mobileshowcase.page.Theming.THEMES[i].css;
        var cssURI = qx.util.ResourceManager.getInstance().toUri(cssResource);
        qxWeb.io.xhr(cssURI).send();
      }
    },


    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");

      this.getContent().append(qxWeb.create('<h2 class="form-title">Select a Theme</h2>'));

      this.__createThemeChooser();
      this.__createThemeScaleControl();
      this.__createImageResolutionHandlingDemo();

      // react on possible font size changes (triggering a different device pixel ratio)
      q(window).on("resize", this._onResize);

      qx.core.Init.getApplication().getRoot().on("changeAppScale", this._updateDemoImageLabel, this);
    },


    /** Check on possible scale changes. */
    _onResize : qx.module.util.Function.debounce(function(e)
    {
      var appScaling = qx.application.Scaling.getInstance();

      var appScale = qx.ui.Image.getAppScale();
      var fontScale = appScaling.get();

      if(appScale != this.__appScale || fontScale != this.__fontScale)
      {
        this.__appScale = appScale;
        this.__fontScale = fontScale;

        appScaling.emit("changeAppScale");
      }
    }.bind(this), 200),


    /** Creates the form which controls the chosen qx.Mobile theme. */
    __createThemeChooser: function() {
      var themeForm = new qx.ui.form.Form();
      var themeGroup = new qx.ui.form.Group()
        .appendTo(themeForm);

      var themeRadioGroup = new qx.ui.form.Group();
      for (var i = 0; i < mobileshowcase.page.Theming.THEMES.length; i++) {
        var radioButton = new qx.ui.form.RadioButton();
        themeRadioGroup.add(radioButton);
        new qx.ui.form.Row(radioButton, mobileshowcase.page.Theming.THEMES[i].name)
          .appendTo(themeGroup);
        radioButton.on("tap", this.__switchTheme.bind(this, i));
      }

      this.getContent().append(themeForm);
    },


    /** Creates and adds the image resolution demonstration. */
    __createImageResolutionHandlingDemo : function() {
      this.getContent().append(qxWeb.create('<h2 class="form-title">Resolution-specific Images</h2>'));

      var demoImage = new qx.ui.Image("mobileshowcase/icon/image.png")
        .addClass("resolution-demo-image");

      this.__demoImageLabel = new qx.ui.basic.Label()
        .addClass("resolution-demo-label");
      this._updateDemoImageLabel();

      new qx.ui.form.Row()
        .set({layout: new qx.ui.layout.VBox("left")})
        .append(demoImage)
        .append(this.__demoImageLabel)
        .appendTo(this.getContent());
    },


   /**
    * Refreshes the label which displays the pixel ratio, scale factor etc.
    */
    _updateDemoImageLabel : function()
    {
      var pixelRatio = parseFloat(q.env.get("device.pixelRatio").toFixed(2));
      var fontScale = qx.application.Scaling.getInstance().get();
      var appScale = qx.ui.Image.getAppScale();

      var demoLabelTemplate = "<div>Best available image for total app scale<span>%1</span></div> <div><br/></div> <div>Device pixel ratio:<span>%2</span></div>  <div>Computed font scale:<span>%3</span></div> ";
      var labelContent = qxWeb.string.format(demoLabelTemplate, [this.__format(appScale), this.__format(pixelRatio), this.__format(fontScale)]);

      this.__demoImageLabel.value = labelContent;
    },


   /**
    * Formats a number to one or two decimals as needed.
    * @param x {Number}
    * @return {String} the formatted number
    */
    __format : function(x)
    {
      if (x === null) {
        return "(unknown)";
      }

      x = x.toFixed(2);
      x = x.replace(/(\d)0/, "$1");
      return x;
    },


    /**
     * Creates the a control widget for the theme's scale factor.
     */
    __createThemeScaleControl : function()
    {
      this.getContent().append(qxWeb.create('<h2 class="form-title">Adjust font scale</h2>'));

      var form = new qx.ui.form.Form()
        .appendTo(this.getContent());
      var scaleGroup = new qx.ui.form.Group()
        .appendTo(form);

      var slider = this.__slider = new qx.ui.form.Slider();
      slider.displayValue = "value";
      slider.minimum = 50;
      slider.maximum = 200;
      slider.value = 100;
      slider.step = 10;
      new qx.ui.form.Row(slider, "Custom Font Scale in %")
        .set({layout: new qx.ui.layout.VBox()})
        .appendTo(scaleGroup);

      var useScaleButton = new qx.ui.Button("Apply")
        .setStyle("width", "100%");
      useScaleButton.on("tap", this._onApplyScaleButtonTap, this);
      form.append(useScaleButton);
    },


    /**
    * Handler for "tap" event on applyScaleButton. Applies the app's root font size in relation to slider value.
    */
    _onApplyScaleButtonTap : function() {
      qx.application.Scaling.getInstance().set(this.__slider.getValue()/100);

      this._updateDemoImageLabel();

      var lastValue = this.__slider.getValue();
      this.__slider.value = 0;
      this.__slider.value = lastValue;

      qx.core.Init.getApplication().getRouting().executeGet("/theming", {reverse:false});
    },


    /**
     * Changes the used CSS of the application.
     * @param cssFile {String} The css file url.
     */
    __changeCSS : function(cssFile) {
      var blocker = qxWeb(document).block().getBlocker();
      blocker
        .setStyle("transition", "all 500ms")
        .setStyle("zIndex", 1e10)
        .setStyle("backgroundColor", "rgb(255,255,255)")
        .setStyle("opacity", 0)
        .on("transitionend", this._onAppFadedOut.bind(this, cssFile));

      setTimeout(function() {
        blocker.setStyle("backgroundColor", "rgb(255,255,255)")
        .setStyle("opacity", 1);
      }, 0);
    },

    /**
     * Event handler when Application has faded out.
     */
    _onAppFadedOut: function(cssFile) {
      var blocker = qxWeb(document).getBlocker();
      blocker.off("transitionend", this._onAppFadedOut, this);

      var root = qxWeb(".root");
      root.setStyle("color","white");

      qxWeb("link[rel^='stylesheet']").remove();

      var newCssLink = document.createElement("link");
      newCssLink.setAttribute("rel", "stylesheet");
      newCssLink.setAttribute("type", "text/css");
      newCssLink.setAttribute("href", cssFile);

      qxWeb("head").append(newCssLink);

      root.setStyle("color",null);

      window.setTimeout(function() {
        blocker.on("transitionend", this._onAppFadedIn, this)
          .setStyle("backgroundColor", "rgb(255,255,255)")
          .setStyle("opacity", 0);
      }.bind(this), 100);
    },


    /**
     * Event handler when Application has faded in again.
     */
    _onAppFadedIn: function() {
      var blocker = qxWeb(document).getBlocker();
      blocker.off("transitionend", this._onAppFadedIn, this)
        .setStyle("transition", null)
        .setStyle("backgroundColor", null)
        .hide();
    },


    /**
     * Switches the theme of the application to the target theme.
     * @param src {qx.ui.Widget} Source widget of this event.
     */
    __switchTheme : function(index) {
      var cssResource = mobileshowcase.page.Theming.THEMES[index].css;
      var cssURI = qx.util.ResourceManager.getInstance().toUri(cssResource);
      this.__changeCSS(cssURI);
    },


    /**
     * Adds a new theme data object to the theme switcher.
     * @param cssFile {String} The css file url.
     */
    appendTheme : function(themeData) {
      mobileshowcase.page.Theming.THEMES.push(themeData);
    },


    dispose : function() {
     q(window).off("resize", this._onResize);
     qx.core.Init.getApplication().getRoot().off("changeAppScale", this._updateDemoImageLabel, this);
    }
  }
});
