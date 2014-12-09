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
 * Mobile page showing an OpenStreetMap map.
 *
 * @ignore(OpenLayers.*)
 * @asset(qx/css/*)
 */
qx.Class.define("mobileshowcase.page.Maps",
{
  extend : mobileshowcase.page.Abstract,

  construct : function() {
    this.super(mobileshowcase.page.Abstract, "construct", false);
    this.title = "Maps";
  },


  members :
  {
    _mapUri : "http://www.openlayers.org/api/OpenLayers.js",
    _map : null,
    _markers : null,
    _myPositionMarker : null,
    _mapnikLayer : null,
    _showMyPositionButton : null,


    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");
      this._loadMapLibrary();

      // Listens on window orientation change and resize, and triggers redraw of map.
      // Needed for triggering OpenLayers to use a bigger area, and draw more tiles.
      q(window).on("orientationchange", this._redrawMap, this)
        .on("resize", this._redrawMap, this);
    },


    /**
     * Calls a redraw on Mapnik Layer. Needed after orientationChange event
     * and drawing markers.
     */
    _redrawMap : function () {
      if(this._mapnikLayer !== null) {
        this._map.updateSize();
        this._mapnikLayer.redraw();
      }
    },


    // overridden
    _createScrollContainer : function()
    {
      // MapContainer
      var layout = new qx.ui.layout.VBox();
      layout.alignX = "center";
      layout.alignY = "middle";

      var mapContainer = new qx.ui.Widget();
      mapContainer.layout = layout;
      mapContainer.setAttribute("id", "osmMap");

      return mapContainer;
    },


    // overridden
    _createContent : function() {
      // Disable menu for Windows Phone 8.
      if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        return null;
      }

      var menuContainer = new qx.ui.Widget();
      menuContainer.setAttribute("id", "mapMenu");

      // LABEL
      var descriptionLabel = new qx.ui.Label("Page Title");
      descriptionLabel.addClass("osmMapLabel");

      // TOGGLE BUTTON
      var toggleNavigationButton = new qx.ui.form.ToggleButton(true,"ON","OFF",12);

      // SHOW MY POSITION BUTTON
      this._showMyPositionButton = new qx.ui.Button("Find me!");
      this._showMyPositionButton.on("tap", this._getGeoPosition, this);
      toggleNavigationButton.on("changeValue", function() {
        var newNavBarState = !this.navigationBarHidden;
        this.navigationBarHidden = newNavBarState;
        this.show();
      },this);

      var groupPosition = new qx.ui.form.Group();
      groupPosition.append(this._showMyPositionButton);
      var groupFullScreen = new qx.ui.form.Group();
      groupFullScreen.append(descriptionLabel);
      groupFullScreen.append(toggleNavigationButton);

      this._showMyPositionButton.addClass("map-shadow");
      groupFullScreen.addClass("map-shadow");

      menuContainer.append(groupFullScreen);
      menuContainer.append(groupPosition);

      return menuContainer;
    },


    /**
     * Loads JavaScript library which is needed for the map.
     */
    _loadMapLibrary : function() {
      qxWeb.io.script()
      .on("load", function() {
        this._map = new OpenLayers.Map("osmMap");
        this._mapnikLayer = new OpenLayers.Layer.OSM("mapnik", null, {});

        this._map.addLayer(this._mapnikLayer);

        this._zoomToDefaultPosition();
      }, this)
      .open("GET", this._mapUri)
      .send();
    },


    /**
     * Zooms the map to a default position.
     * In this case: Berlin, Germany.
     */
    _zoomToDefaultPosition : function() {
      if (this.visibility === "visible") {
        this._zoomToPosition(13.41, 52.52, 15);
      }
    },


    /**
     * Zooms the map to a  position.
     * @param longitude {Number} the longitude of the position.
     * @param latitude {Number} the latitude of the position.
     * @param zoom {Integer} zoom level.
     * @param showMarker {Boolean} if a marker should be drawn at the defined position.
     */
    _zoomToPosition : function(longitude, latitude, zoom, showMarker) {
      var fromProjection = new OpenLayers.Projection("EPSG:4326");
      var toProjection = new OpenLayers.Projection("EPSG:900913");
      var mapPosition = new OpenLayers.LonLat(longitude,latitude).transform(fromProjection, toProjection);

      this._map.setCenter(mapPosition, zoom);

      if(showMarker === true) {
        this._setMarkerOnMap(this._map, mapPosition);
      }
    },


    /**
     * Draws a marker on the OSM map.
     * @param map {Object} the map object.
     * @param mapPosition {Map} the map position.
     */
    _setMarkerOnMap : function(map, mapPosition) {
      if (this._markers === null) {
        this._markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(this._markers);
      }

      if (this._myPositionMarker !== null) {
        this._markers.removeMarker(this._myPositionMarker);
      }

      this._myPositionMarker = new OpenLayers.Marker(mapPosition, icon);

      var size = new OpenLayers.Size(21, 25);
      var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
      var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);

      this._markers.addMarker(this._myPositionMarker);
    },


    /**
     * Callback function when Geolocation did work.
     */
    _onGeolocationSuccess : function(position) {
      this._zoomToPosition(position.coords.longitude, position.coords.latitude, 15, true);

      this._redrawMap();
    },


    /**
     * Callback function when Geolocation returned an error.
     */
    _onGeolocationError : function() {
      this._showMyPositionButton.setEnabled(false);

      var buttons = [];
      buttons.push("OK");
      var title = "Problem with Geolocation";
      var text = "Please activate location services on your browser and device.";
      qx.ui.dialog.Manager.getInstance().confirm(title, text, function() {
      }, this, buttons);
    },


    /**
     * Retreives GeoPosition and zooms to this point on map.
     */
    _getGeoPosition : function() {
      var successHandler = this._onGeolocationSuccess.bind(this);
      var errorHandler = this._onGeolocationError.bind(this);
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
        enableHighAccuracy: false,
        timeout: 1000,
        maximumAge: 1000
      });
    },


    destruct : function()
    {
      this._disposeObjects("_mapUri","_map","_myPositionMarker","_markers","_showMyPositionButton","_mapnikLayer");
    }
  }
});
