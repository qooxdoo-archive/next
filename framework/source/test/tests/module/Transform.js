describe("module.Transform", function() {

  // smoke tests

  it("Translate", function() {
    sandbox.translate("10px");
  });


  it("Scale", function() {
    sandbox.scale(2);
  });


  it("Skew", function() {
    sandbox.skew("20deg");
  });


  it("Rotate", function() {
    sandbox.rotate("90deg");
  });


  it("Transfrom", function() {
    sandbox.transform({
      scale: [1, 2],
      rotate: "90deg"
    });
  });


  it("TransformOrigin", function() {
    sandbox.setTransformOrigin("30% 10%");
    if (q.env.get("css.transform") !== null) {
      assert.notEqual(sandbox.getTransformOrigin().indexOf("30% 10%"), -1);
    }
  });


  it("TransformStyle", function() {
    sandbox.setTransformStyle("flat");
    if (q.env.get("css.transform") !== null) {
      assert.equal(sandbox.getTransformStyle(), "flat");
    }
  });


  it("TransformPerspective", function() {
    sandbox.setTransformPerspective(1234);
    if (q.env.get("css.transform") !== null) {
      assert.equal(sandbox.getTransformPerspective(), "1234px");
    }
  });


  it("TransformPerspectiveOrigin", function() {
    sandbox.setTransformPerspectiveOrigin("30% 50%");
    if (q.env.get("css.transform") !== null) {
      assert.equal(sandbox.getTransformPerspectiveOrigin(), "30% 50%");
    }
  });


  it("TransformBackfaceVisibility", function() {
    sandbox.setTransformBackfaceVisibility(true);
    if (q.env.get("css.transform") !== null) {
      assert.equal(sandbox.getTransformBackfaceVisibility(), true);
    }
  });
});
