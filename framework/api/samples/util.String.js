addSample("q.string.camelCase", {
  javascript: function() {
    console.log(q.string.camelCase("I-like-cookies") === "ILikeCookies");
  },
  executable: true
});

addSample("q.string.format", {
  javascript: function() {
    console.log(qx.lang.String.format("Hello %1, my name is %2", ["Egon", "Franz"]) == "Hello Egon, my name is Franz");
  },
  executable: true
});

addSample("q.string.hyphenate", {
  javascript: function() {
    console.log(q.string.hyphenate("weLikeCookies") === "we-like-cookies");
  },
  executable: true
});

addSample("q.string.escapeHtml", {
  javascript: function() {
    console.log(q.string.escapeHtml('"bread" & "butter"') === "&quot;bread&quot; &amp; &quot;butter&quot;");
  },
  executable: true
});