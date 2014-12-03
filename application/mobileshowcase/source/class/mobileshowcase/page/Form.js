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
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Mobile page responsible for showing the "form" showcase.\
 */
qx.Class.define("mobileshowcase.page.Form",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "construct");
    this.title = "Form";
    this.__items = [];
  },


  members :
  {
    __items: null,
    __result : null,
    __resultPopup : null,
    __closeResultPopup : null,
    __form : null,
    __submitButton : null,


    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");
      this.__form = this.__createForm();

      this.getContent().append(this.__form);

      this.__result = new qx.ui.Label();
      this.__result.addClass("registration-result");

      var popupContent = new qx.ui.Widget();
      this.__closeResultPopup = new qx.ui.Button("OK");
      this.__closeResultPopup.on("tap", function() {
        this.__resultPopup.hide();
      },this);

      popupContent.append(this.__result);
      popupContent.append(this.__closeResultPopup);

      this.__resultPopup = new qx.ui.dialog.Popup(popupContent);
      this.__resultPopup.title = "Registration Result";
    },


    /**
    * Factory for the Submit Button.
    * @return {qx.ui.Button} reset button
    */
    _createSubmitButton : function() {
      return new qx.ui.Button("Submit")
        .setAttribute("formnovalidate", "formnovalidate")
        .set({enabled : false});
    },


    /**
    * Factory for the Reset Button.
    * @return {qx.ui.Button} reset button
    */
    _createResetButton : function() {
      return new qx.ui.Button("Reset")
        .setAttribute("formnovalidate", "formnovalidate")
        .on("tap", this._onResetButtonTap, this);
    },


    /**
     * Creates the form for this showcase.
     *
     * @return {qx.ui.form.Form} the created form.
     */
    __createForm : function() {
      var form = new qx.ui.form.Form()
        .addClass("single");

      form.on("submit", this._onSubmit, this);

      var contactGroup = new qx.ui.form.Group("Contact")
        .appendTo(form);

      var name = new qx.ui.form.TextField()
        .set({
          placeholder : "Username",
          required : true,
          pattern : ".{3,}",
          validationMessage: "Username should have more than 3 characters!",
          liveUpdate : true
        });
      this.__items.push(name);

      new qx.ui.form.Row(name, "Username")
        .appendTo(contactGroup);

      var password = new qx.ui.form.PasswordField()
        .set({
          placeholder : "Password",
          required : true,
          pattern : ".{3,}",
          validationMessage: "Password should have more than 3 characters!",
          liveUpdate : true
        });
      this.__items.push(password);

      new qx.ui.form.Row(password, "Password")
        .appendTo(contactGroup);

      var rememberPass = new qx.ui.form.CheckBox()
        .set({
          model: "password_reminder"
        });
      this.__items.push(rememberPass);

      qx.data.SingleValueBinding.bind(rememberPass, "model", password, "value");
      qx.data.SingleValueBinding.bind(password, "value", rememberPass, "model");

      new qx.ui.form.Row(rememberPass, "Remember password?")
        .appendTo(contactGroup);

      var age = new qx.ui.form.NumberField()
        .set({
          maximum: 150,
          minimum: 1,
          required: true,
          validationMessage: "Please enter a number between 1 and 150!",
          liveUpdate: true
        });
      this.__items.push(age);

      new qx.ui.form.Row(age, "Age")
        .appendTo(contactGroup);

      var birthDatePicker = new qx.ui.form.DatePicker();
      birthDatePicker.set({
        required: true,
        validationMessage: "Please enter a valid date of birth!",
        liveUpdate: true,
        readOnly: true
      });
      this.__items.push(birthDatePicker);

      birthDatePicker.getCalendar().on('selected', function (element) {
        var currentTimestamp = new Date().getTime();
        var selectedTimestamp = new Date(element.getValue()).getTime();
        birthDatePicker.valid = (selectedTimestamp < currentTimestamp);
      });
      var birthDateQuestion = "What is your date of birth?";
      new qx.ui.form.Row(birthDatePicker, birthDateQuestion)
        .appendTo(contactGroup);


      var genderGroup = new qx.ui.form.Group("Gender")
        .appendTo(form);

      var male = new qx.ui.form.RadioButton();
      male.name = "gender";
      this.__items.push(male);
      var female = new qx.ui.form.RadioButton();
      female.name = "gender";
      this.__items.push(female);

      new qx.ui.form.Row(male, "Male")
        .appendTo(genderGroup);

      new qx.ui.form.Row(female, "Female")
        .appendTo(genderGroup);

      var feedbackGroup = new qx.ui.form.Group("Feedback")
        .appendTo(form);

      var dd = new qx.data.Array(["Web search", "From a friend", "Offline ad", "Magazine", "Twitter", "Other"]);
      var selQuestion = "How did you hear about us?";
      var select = new qx.ui.form.SelectBox()
        .set({
          required : true,
          validationMessage: "Please select a value!",
          model: dd
        });
      select.setHtml("Unknown");
      this.__items.push(select);
      select.setDialogTitle(selQuestion);

      new qx.ui.form.Row(select, selQuestion)
        .appendTo(feedbackGroup);


      var licenseGroup = new qx.ui.form.Group("License")
        .appendTo(form);

      var info = new qx.ui.form.TextArea()
        .set({
          placeholder : "Terms of Service",
          readOnly : true
        });

      info.setValue("qooxdoo Licensing Information\n=============================\n\nqooxdoo is dual-licensed under the GNU Lesser General Public License (LGPL) and the Eclipse Public License (EPL).\nThe above holds for any newer qooxdoo release. Only legacy versions 0.6.4 and below were licensed solely under the GNU Lesser General Public License (LGPL). For a full understanding of your rights and obligations under these licenses, please see the full text of the LGPL and/or EPL.\n\nOne important aspect of both licenses (so called \"weak copyleft\" licenses) is that if you make any modification or addition to the qooxdoo code itself, you MUST put your modification under the same license, the LGPL or EPL.\n\nNote that it is explicitly NOT NEEDED to put any application under the LGPL or EPL, if that application is just using qooxdoo as intended by the framework (this is where the \"weak\" part comes into play - contrast this with the GPL, which would only allow using qooxdoo to create an application that is itself governed by the GPL).");

      new qx.ui.form.Row(info, "Terms of Service")
        .set({layout: new qx.ui.layout.VBox()})
        .appendTo(licenseGroup);

      var slider = new qx.ui.form.Slider()
        .set({
          displayValue : "percent"
        });

      new qx.ui.form.Row(slider, "Are you human? Drag the slider to prove it.")
        .set({layout: new qx.ui.layout.VBox()})
        .appendTo(licenseGroup);
      this.__items.push(slider);

      var agree = new qx.ui.form.ToggleButton(false,"Agree","Reject",13);
      this.__items.push(agree);
      agree.on("changeValue", this._enableFormSubmitting, this);
      new qx.ui.form.Row(agree, "Agree?")
        .appendTo(licenseGroup);

      var buttonContainer = new qx.ui.Widget()
        .set({layout : (new qx.ui.layout.VBox())})
        .appendTo(form);
      this.__submitButton = this._createSubmitButton()
        .appendTo(buttonContainer);

      var resetButton = this._createResetButton()
        .appendTo(buttonContainer);

      return form;
    },


    _enableFormSubmitting : function(data) {
      this.__submitButton.enabled = data.value;
    },


    /**  Event handler */
    _onResetButtonTap : function() {
      this.__form.reset();
    },


    /** Event handler. */
    _onSubmit : function(e) {
      // don't trigger page reload
      e.preventDefault();

      var result = [];
      var invalid = false;
      this.__items.forEach(function(item) {
        item = qxWeb(item);
        item.validate();
        if (!item.valid && !invalid) {
          this.getChildren(".scroll").scrollToWidget(item, 300);
          invalid = true;
        }
        if (!(item instanceof qx.ui.form.TextArea)) {
          result.push(item.getPrev()[0].textContent + " : " + item.value);
        }
      }.bind(this));

      if (!invalid) {
        this.__result.value = result.join("<br>");
        this.__resultPopup.show();
      }
    },


    // overridden
    _stop : function() {
      if(this.__resultPopup) {
        this.__resultPopup.hide();
      }
      this.super(mobileshowcase.page.Abstract, "_stop");
    }
  }
});
