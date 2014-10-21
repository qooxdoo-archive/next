describe('Transform', function() {

  beforeEach(function() {
    globalSetup();
  });
  afterEach(function() {
    globalTeardown();
  });

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
      assert.notEqual(-1, sandbox.getTransformOrigin().indexOf("30% 10%"));
    }
  });


  it("TransformStyle", function() {
    sandbox.setTransformStyle("flat");
    if (q.env.get("css.transform") !== null) {
      assert.equal("flat", sandbox.getTransformStyle());
    }
  });


  it("TransformPerspective", function() {
    sandbox.setTransformPerspective(1234);
    if (q.env.get("css.transform") !== null) {
      assert.equal("1234px", sandbox.getTransformPerspective());
    }
  });


  it("TransformPerspectiveOrigin", function() {
    sandbox.setTransformPerspectiveOrigin("30% 50%");
    if (q.env.get("css.transform") !== null) {
      assert.equal("30% 50%", sandbox.getTransformPerspectiveOrigin());
    }
  });


  it("TransformBackfaceVisibility", function() {
    sandbox.setTransformBackfaceVisibility(true);
    if (q.env.get("css.transform") !== null) {
      assert.equal(true, sandbox.getTransformBackfaceVisibility());
    }
  });
});
