describe("module.Placeholder", function() {

  beforeEach(function() {
    if (q.env.get("css.placeholder")) {
      //this.skip("Native placeholder supported.");
      return;
    }
  });


  var __test = function(input) {

    if (q.env.get("css.placeholder")) {
      //this.skip("Native placeholder supported.");
      return;
    }
    input.appendTo(document.body);
    input.updatePlaceholder();
    var placeholderEl = input.getProperty(q.$$qx.module.Placeholder.PLACEHOLDER_NAME);
    assert.equal("Hmm", placeholderEl.getHtml());
    assert.isTrue(placeholderEl.getProperty("offsetWidth") > 0);

    input.setValue("123");
    input.updatePlaceholder();

    assert.isTrue(placeholderEl.getProperty("offsetWidth") === 0);

    input.remove().updatePlaceholder();
  };


  it("TextField", function() {
    __test(q.create("<input type='text' placeholder='Hmm' />"));
  });


  it("PasswordField", function() {
    __test(q.create("<input type='password' placeholder='Hmm' />"));
  });


  it("TextArea", function() {
    __test(q.create("<textarea placeholder='Hmm'></textarea>"));
  });


  it("UpdateStatic", function() {

    if (q.env.get("css.placeholder")) {
      //this.skip("Native placeholder supported.");
      return;
    }
    var all = q.create(
      "<div><input type='text' placeholder='Hmm' />" +
      "<textarea placeholder='Hmm'></textarea>" +
      "<input type='password' placeholder='Hmm' /></div>"
    );
    all.appendTo(document.body);

    q.placeholder.update();
    var self = this;
    all.getChildren("input,textarea").forEach(function(input) {
      input = q(input);

      var placeholderEl = input.getProperty(q.$$qx.module.Placeholder.PLACEHOLDER_NAME);
      assert.equal(self);
      input.remove().updatePlaceholder();
    });

    all.remove();
  });


  it("Absolute", function() {

    if (q.env.get("css.placeholder")) {
      //this.skip("Native placeholder supported.");
      return;
    }
    q.create('<div id="container">').setStyles({
      position: "absolute",
      top: "50px"
    }).appendTo("#sandbox");

    var input = q.create('<input type="text" placeholder="placeholder">').appendTo("#container");
    q.placeholder.update();
    assert.equal(input.getPosition().top, q("#sandbox label").getPosition().top);
  });
});
