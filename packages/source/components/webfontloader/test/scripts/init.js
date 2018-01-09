/******/
(function(modules) { // webpackBootstrap
  /******/ // The module cache
  /******/
  var installedModules = {};

  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {

    /******/ // Check if module is in cache
    /******/
    if (installedModules[moduleId])
    /******/
      return installedModules[moduleId].exports;

    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/
      exports: {},
      /******/
      id: moduleId,
      /******/
      loaded: false
        /******/
    };

    /******/ // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    /******/ // Flag the module as loaded
    /******/
    module.loaded = true;

    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }


  /******/ // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;

  /******/ // expose the module cache
  /******/
  __webpack_require__.c = installedModules;

  /******/ // __webpack_public_path__
  /******/
  __webpack_require__.p = "./";

  /******/ // Load entry module and return exports
  /******/
  return __webpack_require__(0);
  /******/
})
/************************************************************************/
/******/
([
  /* 0 */
  /***/
  function(module, exports, __webpack_require__) {

    'use strict';
    var fontloader = __webpack_require__(1);
    fontloader('LogoTypeGothic', '/styles/webfont.css');


    /***/
  },
  /* 1 */
  /***/
  function(module, exports, __webpack_require__) {

    module.exports = function(family, css) {
      var config = {},
        wf;
      if (window.WebFontConfig) {
        config = window.WebFontConfig;
      } else {
        wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      }
      config['families'] = config['families'] || [];
      config['urls'] = config['urls'] || [];
      config.families.push(family);
      config.urls.push(css);
      console.log(config);
      window.webFontConfig = config;
    };


    /***/
  }
  /******/
]);
