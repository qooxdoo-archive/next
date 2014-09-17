/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

qx.Class.define("qx.test.data.singlevalue.TextFieldDummy",
{
  extend : Object,
  include : [qx.event.MEmitter],
  construct : function(value) {
    if (value != null) {
      this.value = value;
    }
  },

  properties : {
    appearance : {
      check : "String",
      event : true,
      init : "asd"
    },
    enabled : {
      check : "Boolean",
      event : true,
      init : true
    },
    zIndex : {
      check : "Number",
      event : true,
      nullable : true
    },
    floatt : {
      event : true
    },
    value : {
      check : "String",
      event : true,
      nullable: true
    },
    backgroundColor : {
      check : "String",
      event : true,
      init : ""
    }
  }
});