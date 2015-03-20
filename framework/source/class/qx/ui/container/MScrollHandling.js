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
 * The mixin contains all functionality to provide methods
 * for scroll container handling: determine the parent scroll container.
 *
 */
qx.Mixin.define("qx.ui.container.MScrollHandling",
{
  members :
  {
    /**
     * Returns the parent scroll container of this widget.
     * @return {qx.ui.container.Scroll} the parent scroll container or <code>null</code>
     */
    _getParentScrollContainer: function() {
      var scroll = this;
      while (!(scroll instanceof qx.ui.container.Scroll)) {
        if (scroll._getParentWidget()) {
          var layoutParent = scroll._getParentWidget();
          if (!layoutParent || layoutParent instanceof qx.ui.core.Root) {
            return null;
          }
          scroll = layoutParent;
        } else {
          return null;
        }
      }
      return scroll;
    }
  }
});
