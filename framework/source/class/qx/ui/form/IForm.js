"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Form interface for all form widgets. It includes the API for enabled,
 * required and valid states.
 */
qx.Interface.define("qx.ui.form.IForm",
{
  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the enabled state was modified */
    "changeEnabled" : "qx.event.type.Data",

    /** Fired when the valid state was modified */
    "changeValid" : "qx.event.type.Data",

    /** Fired when the invalidMessage was modified */
    "changeInvalidMessage" : "qx.event.type.Data",

    /** Fired when the required was modified */
    "changeRequired" : "qx.event.type.Data"
  },

  properties : {
    /**
     * The widget's enabled state.
     */
    enabled : {},

    /**
     * The widget's required state.
     */
    required : {},

    /**
     * The widget's valid state.
     */
    valid : {},

    /**
     * The widget's invalid message.
     */
    invalidMessage : {},

    /**
     * The invalid message if required of the widget.
     */
    requiredInvalidMessage : {}
  }
});
