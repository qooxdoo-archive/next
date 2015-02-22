/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */

describe("bom.client.OperatingSystem", function () {

  it("Get os.name with help of platform", function () {
    var initiallyPlatform = navigator.platform;

    var platforms = {
      // Android
      // Android will detect in userAgent not in platform
//      "Android": "android",
      "Linux": "linux",

      // Apple
      "iPhone": "ios",
      "iPod": "ios",
      "iPad": "ios",
      "Macintosh": "osx",
      "MacIntel": "osx",
      "Mac OS X": "osx",
      "MacPPC": "osx",

      // BlackBerry
      "BlackBerry": "blackberry",

      // FreeBSD
//      "FreeBSD i386": "freebsd",
//      "FreeBSD amd64": "freebsd",

      // Linux
      "Linux i686": "linux",
      "Linux x686": "linux",
      "Linux armv7l": "linux",
      "Linux x86_64": "linux",

      // Nintendo
//      "Nintendo DSi": "nintendo",
//      "Nintendo 3DS": "nintendo",
//      "Nintendo Wii": "nintendo",
//      "Nintendo WiiU": "nintendo",

      // Symbian
      "Symbian": "symbian",

      // webOS will detect in userAgent not in platform
//      "webOS": "webos",

      // Solaris
//      "SunOS": "solaris",
//      "SunOS i86pc": "solaris",
//      "SunOS sun4u": "solaris",

      // Sony
//      "PLAYSTATION 3": "playstation",
//      "PlayStation 4": "playstation",
//      "PSP": "psp",

      // Windows
      "Win32": "win",
      "Win64": "win"
    };

    for (var platformKey in platforms) {
      if (platforms.hasOwnProperty(platformKey)) {
        var expectedValue = platforms[platformKey];
        Object.defineProperty(navigator, "platform", {
          get: function () {
            return platformKey;
          }
        });
        assert.equal(expectedValue, qx.bom.client.OperatingSystem.getName());
      }
    }

    // restore to original
    Object.defineProperty(navigator, "platform", {
      get: function () {
        return initiallyPlatform;
      }
    });
  });

  it("Get os.name with help of userAgent", function () {
    var initiallyUserAgent = navigator.userAgent;

    var userAgents = {
      "RIM Tablet OS": "rim_tabletos",
      "webOS": "webos",
      "Android": "android"
    };

    for (var userAgentKey in userAgents) {
      if (userAgents.hasOwnProperty(userAgentKey)) {
        var expectedValue = userAgents[userAgentKey];
        Object.defineProperty(navigator, "userAgent", {
          get: function () {
            return userAgentKey;
          }
        });
        assert.equal(expectedValue, qx.bom.client.OperatingSystem.getName());
      }
    }

    // restore to original
    Object.defineProperty(navigator, "userAgent", {
      get: function () {
        return initiallyUserAgent;
      }
    });
  });
});
