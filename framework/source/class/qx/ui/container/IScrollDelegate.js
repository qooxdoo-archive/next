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

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Objects which are used as delegates for the {@link qx.ui.container.Scroll#delegate} may
 * implement any of the methods described in this interface. The delegate does
 * not need to implement all the methods of this interface.
 *
 * Note: This interface is meant to document the delegate but should not be
 * listed in the <code>implement</code> key of a class unless all methods are
 * actually implemented.
 */
qx.Interface.define("qx.ui.container.IScrollDelegate",
{
  members :
  {
    /**
     * Calculates the scroll offset if container scrolls to a widget/element through <code>scrollToElement()|scrollToWidget()</code>.
     *
     * @return {Array} an array with x,y offset.
     */
    getScrollOffset: function() {}
  }
});
