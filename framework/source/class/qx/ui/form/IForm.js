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
 * Form interface for all form widgets. It includes the API for the enabled
 * and required states as well as validity.
 */
qx.Interface.define("qx.ui.form.IForm",
{
  events :
  {
    /** Fired when the item's validity changes */
    changeValid : null
  },

  properties : {
    /**
     * Is a value required for this item to be valid?
     */
    required: {},

    /**
     * The item's validity
     */
    valid: {},

    /**
     * The widget's invalid message.
     */
    validationMessage: {}
  }
});
