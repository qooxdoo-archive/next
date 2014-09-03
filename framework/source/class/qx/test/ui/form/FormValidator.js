/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Bootstrap.define("qx.test.ui.form.FormValidator",
{
  extend : qx.test.mobile.MobileTestCase,

  construct : function() {
    this.base(qx.test.mobile.MobileTestCase, "constructor");
  },

  members :
  {
    __username : null,
    __password1 : null,
    __password2 : null,
    __manager : null,

    setUp: function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__username = new qx.ui.mobile.form.TextField();
      this.__password1 = new qx.ui.mobile.form.TextField();
      this.__password2 = new qx.ui.mobile.form.TextField();
      this.__manager = new qx.ui.form.validation.Manager();
    },

    tearDown: function() {
      this.base(qx.test.mobile.MobileTestCase, "tearDown");
      this.__username.dispose();
      this.__password1.dispose();
      this.__password2.dispose();
    },


    // validator
    __notEmptyValidator : function(value, formItem)
    {
      var isString = qx.lang.Type.isString(value);
      var valid = isString && value.length > 0;
      valid ? formItem.invalidMessage = "" : formItem.invalidMessage = "fail";
      return valid;
    },

    __notEmptyValidatorError : function(value)
    {
      var isString = qx.lang.Type.isString(value);
      if (!isString || value.length == 0) {
        throw new qx.core.ValidationError("fail");
      }
    },

    __asyncValidator : function(validator, value) {
      window.setTimeout(function() {
        var valid = value != null && value.length > 0;
        validator.setValid(valid, "fail");
      }, 100);
    },


    // context //////////////////////
    testSyncContext : function()
    {
      var self = this;
      this.__manager.add(this.__username, function(value, formItem) {
        self.assertEquals(1, this.a);
      }, {a: 1});

      this.__manager.validate();
    },


    testSync2Context : function()
    {
      var self = this;
      this.__manager.add(this.__username, function(value, formItem) {
        self.assertEquals(1, this.a);
      }, {a: 1});

      this.__manager.add(this.__password1, function(value, formItem) {
        self.assertEquals(2, this.a);
      }, {a: 2});

      this.__manager.validate();
    },


    testAsyncContext : function()
    {
      var self = this;

      var asyncValidator = new qx.ui.form.validation.AsyncValidator(
        function(value, formItem) {
          self.assertEquals(1, this.a);
        }
      );

      this.__manager.add(this.__username, asyncValidator, {a: 1});

      this.__manager.validate();
    },


    testAsync2Context : function()
    {
      var self = this;

      var asyncValidator = new qx.ui.form.validation.AsyncValidator(
        function(value, formItem) {
          self.assertEquals(1, this.a);
        }
      );

      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(
        function(value, formItem) {
          self.assertEquals(2, this.a);
        }
      );

      this.__manager.add(this.__username, asyncValidator, {a: 1});
      this.__manager.add(this.__password1, asyncValidator2, {a: 2});

      this.__manager.validate();
    },


    testSyncFormContext : function()
    {
      var self = this;
      this.__manager.validator = function() {
        self.assertEquals(1, this.a);
      };
      this.__manager.context = {a: 1};

      this.__manager.validate();
    },


    testAsyncFormContext : function()
    {
      var self = this;
      var asyncValidator = new qx.ui.form.validation.AsyncValidator(
      function() {
        self.assertEquals(1, this.a);
      });
      this.__manager.validator = asyncValidator;
      this.__manager.context = {a: 1};

      this.__manager.validate();
    },
    // //////////////////////////////


    //  sync self contained ///////////////
    testSyncSelfContained1NotNull: function() {
      this.__manager.add(this.__username, this.__notEmptyValidator);

      // validate = fail (no text entered)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertFalse(this.__username.valid);

      // check the invalid messages
      this.assertEquals("fail", this.__username.invalidMessage);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);

      // enter text in the usernamen
      this.__username.setValue("affe");

      // validate = true
      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__manager.getValid());
      this.assertTrue(this.__username.valid);

      // remove the username
      this.__username.resetValue();

      // validate = faíl
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertFalse(this.__username.valid);
    },


    testSyncSelfContained1NotNullRadioGroup: function() {
      var rbg = new qx.ui.mobile.form.RadioGroup();
      rbg.required = true;
      rbg.allowEmptySelection = true;
      var rb1 = new qx.ui.mobile.form.RadioButton();
      var rb2 = new qx.ui.mobile.form.RadioButton();
      rbg.add(rb1);
      rbg.add(rb2);
      this.__manager.add(rbg);

      // validate = fail (no text entered)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertFalse(rbg.valid);

      // select something
      rbg.setSelection([rb1]);

      // validate = true
      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__manager.getValid());
      this.assertTrue(rbg.valid);
      rbg.dispose();
    },


    testSyncSelfContained1NotNullEvents: function(attributes) {
      this.__manager.add(this.__username, this.__notEmptyValidator);

      var self = this;
      this.assertEventFired(this.__manager, "changeValid", function() {
        self.__manager.validate();
      }, function(data) {
        self.assertFalse(data.value);
        self.assertNull(data.old);
      });

      // make the form valid
      this.__username.setValue("affe");

      this.assertEventFired(this.__manager, "changeValid", function() {
        self.__manager.validate();
      }, function(data) {
        self.assertTrue(data.value);
        self.assertFalse(data.old);
      });
    },


    __testSyncSelfContained3NotNull: function(validator) {
      this.__manager.add(this.__username, validator);
      this.__manager.add(this.__password1, validator);
      this.__manager.add(this.__password2, validator);

      // validate = fail (no text entered)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__username.valid);
      this.assertFalse(this.__password1.valid);
      this.assertFalse(this.__password2.valid);

      // check the invalid messages
      this.assertEquals("fail", this.__username.invalidMessage);
      this.assertEquals("fail", this.__password1.invalidMessage);
      this.assertEquals("fail", this.__password2.invalidMessage);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[1]);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[2]);
      this.assertEquals(3, this.__manager.getInvalidMessages().length);

      // enter text to the two passwordfields
      this.__password1.setValue("1");
      this.__password2.setValue("2");

      // validate again = fail (username empty)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);

      // check the invalid messages
      this.assertEquals("fail", this.__username.invalidMessage);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);
      this.assertEquals(1, this.__manager.getInvalidMessages().length);


      // enter text in the usernamen
      this.__username.setValue("affe");

      // validate = true
      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);
      this.assertEquals(0, this.__manager.getInvalidMessages().length);

      // remove the username
      this.__username.resetValue();

      // validate last time = false
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);
      this.assertEquals(1, this.__manager.getInvalidMessages().length);
    },


    testSyncSelfContained3NotNull : function() {
      this.__testSyncSelfContained3NotNull(this.__notEmptyValidator);
    },


    testSyncSelfContained3NotNullError : function() {
      this.__testSyncSelfContained3NotNull(this.__notEmptyValidatorError);
    },

    // //////////////////////////////

    // sync related //////////////

    __testSyncRelatedNoIndividual: function(validator) {
      this.__manager.add(this.__username);
      this.__manager.add(this.__password1);
      this.__manager.add(this.__password2);

      this.__password1.value = "affe";

      this.__manager.validator = validator;

      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());

      this.assertEquals("fail", this.__manager.invalidMessage);
      this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);

      this.__password2.value = "affe";

      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__manager.getValid());

      this.assertEquals(0, this.__manager.getInvalidMessages().length);
    },


    testSyncRelatedNoIndividual : function() {
      this.__testSyncRelatedNoIndividual(function(formItems, manager) {
        var valid = formItems[1].getValue() == formItems[2].getValue();
        if (!valid) {
          manager.invalidMessage = "fail";
        }
        return valid;
      });
    },


    testSyncRelatedNoIndividualError : function() {
      this.__testSyncRelatedNoIndividual(function(formItems, manager) {
        if (formItems[1].getValue() != formItems[2].getValue()) {
          throw new qx.core.ValidationError("fail");
        }
      });
    },


    testSyncRelatedWithIndividual: function() {
      this.__manager.add(this.__username, this.__notEmptyValidator);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, this.__notEmptyValidator);

      this.__password1.setValue("affe");

      this.__manager.validator = function(formItems, manager) {
        var valid = formItems[1].getValue() == formItems[2].getValue();
        if (!valid) {
          manager.invalidMessage = "fail";
        }
        return valid;
      };

      // false: username and password2 empty && password 1 != password2
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertFalse(this.__username.valid);
      this.assertFalse(this.__password2.valid);

      var messages = this.__manager.getInvalidMessages();
      this.assertEquals("fail", this.__manager.invalidMessage);
      this.assertEquals("fail", messages[0]);
      this.assertEquals("fail", messages[1]);
      this.assertEquals("fail", messages[2]);
      this.assertEquals(3, messages.length);


      this.__password2.setValue("affe");

      // fail: username empty
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);
      this.assertEquals(1, this.__manager.getInvalidMessages().length);

      this.__username.setValue("user");

      // ok
      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__manager.getValid());
      this.assertEquals(0, this.__manager.getInvalidMessages().length);
      this.assertTrue(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);

      // change back to not valid
      this.__password1.setValue("user");

      // not ok
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__manager.getValid());
      this.assertEquals(1, this.__manager.getInvalidMessages().length);
      this.assertTrue(this.__username.valid);
    },

    // //////////////////////////////


    // required /////////////////////
    testRequired: function() {
      // set all 3 fields to required
      this.__username.required = true;
      this.__password1.required = true;
      this.__password2.required = true;

      // add the fields to the form manager
      this.__manager.add(this.__username);
      this.__manager.add(this.__password1);
      this.__manager.add(this.__password2);

      // validate = fail (no text entered)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__username.valid);
      this.assertFalse(this.__password1.valid);
      this.assertFalse(this.__password2.valid);

      // enter text to the two passwordfields
      this.__password1.setValue("1");
      this.__password2.setValue("2");

      // validate again = fail (username empty)
      this.assertFalse(this.__manager.validate());
      this.assertFalse(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);

      // enter text in the usernamen
      this.__username.setValue("affe");

      // validate last time = true
      this.assertTrue(this.__manager.validate());
      this.assertTrue(this.__username.valid);
      this.assertTrue(this.__password1.valid);
      this.assertTrue(this.__password2.valid);
    },


    testRequiredFieldMessage : function() {
      // set a global and an individual requred field message
      this.__manager.requiredFieldMessage = "affe";
      this.__password1.requiredInvalidMessage = "AFFEN";

      // set fields to required
      this.__username.required = true;
      this.__password1.required = true;

      // add the fields to the form manager
      this.__manager.add(this.__username);
      this.__manager.add(this.__password1);

      // validate = fail (no text entered)
      this.assertFalse(this.__manager.validate());

      // check the messages
      this.assertEquals("affe", this.__username.invalidMessage);
      this.assertEquals("AFFEN", this.__password1.invalidMessage);
    },


    // //////////////////////////////



    // Async self contained //////////

    testAsyncSelfContained1NotNullFail: function(){
      var asyncValidator = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertFalse(this.__username.valid);
          this.assertEquals("fail", this.__username.invalidMessage);
        }, this);
      }, this);

      this.__manager.validate();

      this.wait();
    },


    testAsyncSelfContained1NotNull: function(){
      var asyncValidator = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator);
      this.__username.setValue("affe");

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertTrue(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
        }, this);
      }, this);

      this.__manager.validate();

      this.wait();
    },


    testAsyncSelfContained3NotNullFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertFalse(this.__username.valid);

          this.assertEquals("fail", this.__username.invalidMessage);
          this.assertEquals("fail", this.__password1.invalidMessage);
          this.assertEquals("fail", this.__password2.invalidMessage);

          this.assertEquals(3, this.__manager.getInvalidMessages().length);
          this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);
          this.assertEquals("fail", this.__manager.getInvalidMessages()[1]);
          this.assertEquals("fail", this.__manager.getInvalidMessages()[2]);
        }, this);
      }, this);

      this.__manager.validate();

      this.wait();
    },


    testAsyncSelfContained3NotNull: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertTrue(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
        }, this);
      }, this);

      // add values to all three input fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");

      this.__manager.validate();

      this.wait();
    },


    testAsyncSelfContained2NotNullFailMixed: function() {
      // BUG #3735
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(
        function(validator, value) {
          window.setTimeout(function() {
            validator.setValid(false, "fail");
          }, 300);
        }
      );
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(
        function(validator, value) {
          window.setTimeout(function() {
            validator.setValid(true, "WIN");
          }, 500);
        }
      );

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__username.valid = false;
      this.__password1.valid = false;
      this.__password2.valid = false;

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertFalse(this.__password1.valid);
          this.assertTrue(this.__password2.valid);
        }, this);
      }, this);

      this.__username.setValue("a");
      this.__manager.validate();

      this.wait();
    },


    testAsyncSelfContained3NotNullHalfFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertFalse(this.__username.valid);
          this.assertEquals("fail", this.__username.invalidMessage);

          this.assertEquals("fail", this.__manager.getInvalidMessages()[0]);
          this.assertEquals(1, this.__manager.getInvalidMessages().length);
        }, this);
      }, this);

      // add values to all three input fields
      this.__password1.setValue("b");
      this.__password2.setValue("c");

      this.__manager.validate();

      this.wait();
    },

    // //////////////////////////////



    // Async related //////////

    testAsyncRelated3NotNullFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);
        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__username.setValue("u");
      this.__password1.setValue("a");
      this.__password2.setValue("b");

      this.__manager.validate();

      this.wait();
    },


    testAsyncRelated3NotNull: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator2 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, asyncValidator2);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertTrue(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);

        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__username.setValue("u");
      this.__password1.setValue("a");
      this.__password2.setValue("a");

      this.__manager.validate();

      this.wait();
    },

    // //////////////////////////////



    // Mixed self contaned //////////
    testMixedSelfContained3NotNullAsyncFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, this.__notEmptyValidator);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertFalse(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);
        }, this);
      }, this);

      this.__password1.setValue("a");
      this.__password2.setValue("b");

      this.__manager.validate();

      this.wait();
    },


    testMixedSelfContained3NotNullSyncFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, this.__notEmptyValidator);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertFalse(this.__password1.valid);
          this.assertTrue(this.__password2.valid);
        }, this);
      }, this);

      this.__username.setValue("a");
      this.__password2.setValue("b");

      this.__manager.validate();

      this.wait();
    },


    testMixedSelfContained3NotNullSync: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, this.__notEmptyValidator);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertTrue(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);
        }, this);
      }, this);

      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");

      this.__manager.validate();

      this.wait();
    },


    testMixedSelfContained2SyncRequired : function(attribute) {
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__password1.required = true;
      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertFalse(this.__password1.valid);
        }, this);
      }, this);

      this.__username.setValue("a");

      this.__manager.validate();

      this.wait();
    },
    // //////////////////////////////



    // Mixed related //////////
    testMixedRelated3NotNull: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertTrue(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);

        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__username.setValue("u");
      this.__password1.setValue("a");
      this.__password2.setValue("a");

      this.__manager.validate();

      this.wait();
    },


    testMixedRelated3NotNullSyncFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertFalse(this.__password1.valid);
          this.assertTrue(this.__password2.valid);

        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__username.setValue("u");
      this.__password2.setValue("a");

      this.__manager.validate();

      this.wait();
    },

    testMixedRelated3NotNullAsyncFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertFalse(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);

        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__password1.setValue("a");
      this.__password2.setValue("a");

      this.__manager.validate();

      this.wait();
    },

    testMixedRelated3NotNullAsyncFormFail: function(){
      var asyncValidator1 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);
      var asyncValidator3 = new qx.ui.form.validation.AsyncValidator(this.__asyncValidator);

      this.__manager.add(this.__username, asyncValidator1);
      this.__manager.add(this.__password1, this.__notEmptyValidator);
      this.__manager.add(this.__password2, asyncValidator3);

      this.__manager.on("complete", function() {
        this.resume(function() {
          // check the status after the complete
          this.assertFalse(this.__manager.isValid());
          this.assertTrue(this.__username.valid);
          this.assertTrue(this.__password1.valid);
          this.assertTrue(this.__password2.valid);

        }, this);
      }, this);

      this.__manager.validator = new qx.ui.form.validation.AsyncValidator(
        function(formItems, validator) {
          window.setTimeout(function() {
            validator.setValid(formItems[1].getValue() == formItems[2].getValue());
          }, 100);
        }
      );

      this.__username.setValue("u");
      this.__password1.setValue("a");
      this.__password2.setValue("b");

      this.__manager.validate();

      this.wait();
    },

    // //////////////////////////////

    // add error ////////////////////
    testAddWrong : function() {
      this.assertException(function() {
        this.__manager.add(new Object());
      });
      this.assertException(function() {
        this.__manager.add(123);
      });
      this.assertException(function() {
        this.__manager.add({});
      });

    },

    testAddSelectBoxWithValidator : function() {
      var box = new qx.ui.mobile.form.SelectBox();
      this.assertException(function() {
        this.__manager.add(box, function() {});
      });
      box.dispose();
    },
    // //////////////////////////////

    // remove ///////////////////////
    testRemove : function() {
      this.__manager.add(this.__username, function(value, formItem) {
        this.assertFalse(true, "validation method called!");
      }, this);

      this.assertEquals(this.__username, this.__manager.remove(this.__username));
      this.__manager.validate();
    },
    // //////////////////////////////


    // get items ////////////////////
    testGetItems : function() {
      this.__manager.add(this.__username);
      this.__manager.add(this.__password1);

      var items = this.__manager.getItems();
      this.assertInArray(this.__username, items);
      this.assertInArray(this.__password1, items);
    }
    // //////////////////////////////
  }
});