"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    module.exports = {
      "metrics": {
        "backEndTime": true,
        "frontEndTime": true,
        "fullyLoadedTime": true,
        "rumSpeedIndex": true,
        "firstByteTime": true,
        "firstPaintTime": true,
        "latencyTime": true,
        "jsErrors": true
      },
      "budgets": {
        "global": {
          "jsErrors": {
            "max": 0
          }
        },
        "connections": {
          "3g": {
            "backEndTime": {
              "max": 1000
            },
            "frontEndTime": {
              "max": 3000
            },
            "fullyLoadedTime": {
              "max": 4000
            },
            "rumSpeedIndex": {
              "max": 3000
            },
            "firstByteTime": {
              "max": 900
            },
            "firstPaintTime": {
              "max": 3000
            },
            "latencyTime": {
              "max": 200
            }
          }
        }
      }
    };
  }, {}], 2: [function (require, module, exports) {}, {}], 3: [function (require, module, exports) {
    window.speedbar = window.speedbar || {};

    (function (doc, speedbar) {
      require("./style.css");
      var budget = require("./budget.json");
      var template = require("./template.js");

      speedbar.init = function () {

        this.el = document.createElement("div");
        this.el.innerHTML = template;
        document.body.appendChild(this.el);
      };

      // get current perf metrics
      // render template with them
      // validate current metrics against budget
      // inject bar onto page

      window.addEventListener("onload", speedbar.init());
    })(document, window.speedbar);
  }, { "./budget.json": 1, "./style.css": 4, "./template.js": 5 }], 4: [function (require, module, exports) {
    var css = "#perf-budget-bar{background-color:#222}#perf-budget-bar .metric{background-color:red}";require("./../node_modules/cssify")(css);module.exports = css;
  }, { "./../node_modules/cssify": 6 }], 5: [function (require, module, exports) {
    module.exports = "<div id=\"perf-budget-bar\">\n  <div class=\"perf-budget-bar__metric\"></div>\n  <div class=\"perf-budget-bar__metric\"></div>\n  <div class=\"perf-budget-bar__metric\"></div>\n  <div class=\"perf-budget-bar__metric\"></div>\n</div>";
  }, {}], 6: [function (require, module, exports) {
    module.exports = function (css, customDocument) {
      var doc = customDocument || document;
      if (doc.createStyleSheet) {
        var sheet = doc.createStyleSheet();
        sheet.cssText = css;
        return sheet.ownerNode;
      } else {
        var head = doc.getElementsByTagName("head")[0],
            style = doc.createElement("style");

        style.type = "text/css";

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(doc.createTextNode(css));
        }

        head.appendChild(style);
        return style;
      }
    };

    module.exports.byUrl = function (url) {
      if (document.createStyleSheet) {
        return document.createStyleSheet(url).ownerNode;
      } else {
        var head = document.getElementsByTagName("head")[0],
            link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = url;

        head.appendChild(link);
        return link;
      }
    };
  }, {}] }, {}, [2, 3, 5]);
//# sourceMappingURL=perf-budget-bar.js.map