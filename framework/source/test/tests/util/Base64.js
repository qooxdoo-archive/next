/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Adrian Olaru (adrianolaru)

 ************************************************************************ */

describe("util.Base64", function () {

  it("EncodeDecode", function () {
    var str = "Luke, I'm your father! Nooooooooooo!";
    var encodedStr = qx.util.Base64.encode(str);
    sinonSandbox.spy()(str, qx.util.Base64.decode(encodedStr));
  });

  it("ChineseChars", function () {
    var str = "Abecedariab语言工具";
    var encodedStr = qx.util.Base64.encode(str);
    sinonSandbox.spy()(str, qx.util.Base64.decode(encodedStr));
  });

  it("ChineseCharsExplicitNot8bit", function () {
    var str = "Abecedariab语言工具";
    var encodedStr = qx.util.Base64.encode(str, false);
    sinonSandbox.spy()(str, qx.util.Base64.decode(encodedStr, false));
  });

  it("ChineseCharsExplicit8bit", function () {
    var str = "Abecedariab语言工具";
    var encodedStr = qx.util.Base64.encode(str, false);
    assert.notEqual(str, qx.util.Base64.decode(encodedStr, true));
  });

  it("GermanChars", function () {
    var str = "Am Donnerstag diskutieren die Abgeordneten dann ab 9 Uhr zweieinhalb Stunden lang in erster Lesung über drei fraktionsübergreifende Gesetzentwürfe zur Präimplantationsdiagnostik (PID). Weitere Themen sind am Donnerstag unter anderem der Schutz vor Straßen- und Schienenlärm und die Einführung eines Mindestlohns";
    var encodedStr = qx.util.Base64.encode(str);
    sinonSandbox.spy()(str, qx.util.Base64.decode(encodedStr));
  });

  it("KnownEncoding", function () {
    var str = "Hello\nThis\nIs\nA\nText\nFile";
    var expected = "SGVsbG8KVGhpcwpJcwpBClRleHQKRmlsZQ==";
    var encodedStr = qx.util.Base64.encode(str);
    sinonSandbox.spy()(encodedStr, expected);
    sinonSandbox.spy()(str, qx.util.Base64.decode(encodedStr));
  });
});
