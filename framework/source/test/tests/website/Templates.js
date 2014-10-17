describe('Templates', function() {

  beforeEach (function () {
   globalSetup();
  });
  afterEach (function () {
   globalTeardown();
  });

  it("Render", function() {
    var result = q.template.render("{{affe}}", {affe: "george"});
    assert.equal("george", result);
  });

  it("RenderToNodeTmplTextOnly", function() {
    var result = q.template.renderToNode("{{affe}}", {affe: "george"});
    assert.equal(1, result.length);
    assert.equal("george", result[0].innerHTML);
  });

  it("RenderToNodeTmplWithNodes", function() {
    var result = q.template.renderToNode("<div><span>{{affe}}</span></div>", {affe: "george"});
    assert.equal(1, result.length);
    assert.equal("george", result[0].firstChild.firstChild.data);
  });

  it("Get", function() {
    var template = q.create("<div id='tmplateGet'>{{affe}}</div>");
    template.appendTo(sandbox);
    var result = q.template.getFromDom("tmplateGet", {affe: "george"});
    assert.equal(1, result.length);
    assert.equal("george", result[0].innerHTML);
  });
});