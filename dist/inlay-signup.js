/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/signup.js":
/*!***********************!*\
  !*** ./src/signup.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

// InlaySignup app
(function () {
  if (!window.inlaySignupInit) {
    // This is the first time this *type* of Inlay has been encountered.
    // We need to define anything global here.

    /**
     * The inlay object has the following properties:
     * - initData object of data served along with the bundle script.
     * - publicID string for the inlay instance on the server. Nb. you may have
     *   multiple instances of that instance(!) on a web page.
     * - script   DOM node of the script tag that has caused us to be loaded,
     *            e.g. useful for positioning our UI after it, or extracting
     *            locally specified data- attributes.
     * - request(fetchParams)
     *            method providing fetch() wrapper for all Inlay-related
     *            requests. The URL is fixed, so you only provide the params
     *            object.
     */
    window.inlaySignupInit = function (inlay) {
      // Here we create the signup form and put it on the page.
      var signupAppDiv = document.createElement('div'); // We append 'i' to the inlayID because classes can't start with a number.

      signupAppDiv.classList.add('inlay-signup', 'i' + inlay.publicID, 'at-rest');
      signupAppDiv.innerHTML = "\n      <div class=\"is-overlay\">\n        <div class=\"is-locator\">\n          <button class=\"is-close\" title=\"Close this form\">\xD7</button>\n          <form action='#' >\n            <div class=\"is-field email\">\n              <label>Email</label>\n              <input\n                name=\"email\"\n                type=\"email\"\n                placeholder=\"youremail@example.org\"\n                required\n                />\n            </div>\n            <div class=\"is-field first_name\">\n              <label>First name</label>\n              <input\n                name=\"first_name\"\n                type=\"text\"\n                required\n                />\n            </div>\n            <div class=\"is-field last_name\">\n              <label>Last name</label>\n              <input\n                name=\"last_name\"\n                type=\"text\"\n                required\n                />\n            </div>\n            <div class=\"is-buttons\">\n              <div class=\"is-smallprint\" ></div>\n              <button class=\"is-submit\" ></button>\n              <div class=\"is-progress\"></div>\n            </div>\n          </form>\n          <div class=\"is-thanks\">Thank you.</div>\n      </div>\n      ";
      var nodes = {
        overlay: signupAppDiv.firstElementChild,
        emailInput: signupAppDiv.querySelector('input[name="email"]'),
        firstNameInput: signupAppDiv.querySelector('input[name="first_name"]'),
        lastNameInput: signupAppDiv.querySelector('input[name="last_name"]'),
        submitButton: signupAppDiv.querySelector('button.is-submit'),
        closeButton: signupAppDiv.querySelector('button.is-close'),
        smallprint: signupAppDiv.querySelector('.is-smallprint'),
        thanks: signupAppDiv.querySelector('.is-thanks'),
        progress: signupAppDiv.querySelector('.is-progress'),
        form: signupAppDiv.querySelector('form')
      };
      nodes.thanks.style.display = 'none';
      nodes.submitButton.textContent = inlay.initData.signupButtonText;
      nodes.thanks.innerHTML = inlay.initData.webThanksHTML;
      nodes.smallprint.innerHTML = inlay.initData.smallprintHTML;
      var allInputs = ['emailInput', 'firstNameInput', 'lastNameInput'].map(function (i) {
        return nodes[i];
      });
      var isActive = false;

      var handleInputInterraction = function handleInputInterraction(i) {
        if (!isActive) {
          // First time we're moving to active.
          signupAppDiv.classList.remove('at-rest');
          signupAppDiv.classList.add('focussed');
          document.body.classList.add('inlay-signup-modal-active'); // Move our main DOM container.

          document.body.appendChild(signupAppDiv);
          isActive = true;
          setTimeout(function () {
            return nodes.emailInput.focus();
          }, 1);
        } // Maintain a .invalid class on the parent container.


        i.classList.remove('pre-interaction');

        if (i.validity.valid) {
          i.parentNode.classList.remove('invalid');
        } else {
          i.parentNode.classList.add('invalid');
        }
      };

      var reset = function reset() {
        isActive = false;
        signupAppDiv.classList.add('at-rest');
        signupAppDiv.classList.remove('focussed');
        document.body.classList.remove('inlay-signup-modal-active');
        allInputs.forEach(function (i) {
          i.value = '';
          i.classList.add('pre-interaction');
          i.parentNode.classList.remove('invalid');
          i.reset && i.reset();
        }); // replace the node.

        inlay.script.insertAdjacentElement('afterend', signupAppDiv);
        nodes.form.style.display = '';
        nodes.thanks.style.display = 'none';
        nodes.submitButton.textContent = inlay.initData.signupButtonText;
        nodes.submitButton.disabled = false;
      };

      nodes.overlay.addEventListener('click', function (e) {
        if (this === e.target) reset();
      });
      nodes.thanks.addEventListener('click', reset);
      nodes.closeButton.addEventListener('click', reset); // Initial state: don't show validation errors.

      allInputs.forEach(function (i) {
        // Inputs have a .pre-interaction class until they've been interacted
        // with, or the form has been submitted.
        i.classList.add('pre-interaction');
        i.addEventListener('input', function (e) {
          return handleInputInterraction(i);
        });
        i.addEventListener('focus', function (e) {
          return handleInputInterraction(i);
        });
      }); // Remove the pre-interaction classes from all inputs when submit pressed.

      nodes.closeButton.addEventListener('click', function (e) {
        e.preventDefault();
      }); // Remove the pre-interaction classes from all inputs when submit pressed.

      nodes.submitButton.addEventListener('click', function (e) {
        console.log('buttonclick');
        allInputs.forEach(function (i) {
          return handleInputInterraction;
        });
      });

      function getFormData(token) {
        var d = {
          email: nodes.emailInput.value,
          first_name: nodes.firstNameInput.value,
          last_name: nodes.lastNameInput.value
        };

        if (token) {
          d.token = token;
        }

        return d;
      }

      var progress = {
        doneBefore: 0,
        jobTotal: 100,
        expectedTime: null,
        percent: 0,
        start: null
      };

      function animateTimer(t) {
        if (!progress.start) {
          progress.start = t;
        }

        var linear = Math.min(1, (t - progress.start) / progress.expectedTime);
        var easeout = 1 - (1 - linear) * (1 - linear) * (1 - linear);
        progress.percent = progress.doneBefore + easeout * (progress.percentDoneAtEndOfJob - progress.doneBefore);
        nodes.progress.style.width = progress.percent + '%';

        if (progress.running && linear < 1) {
          window.requestAnimationFrame(animateTimer);
        } else {
          progress.running = false;
        }
      }

      function startTimer(expectedTime, percentDoneAtEndOfJob, reset) {
        expectedTime = expectedTime * 1000;

        if (reset) {
          progress = {
            doneBefore: 0,
            percentDoneAtEndOfJob: percentDoneAtEndOfJob,
            expectedTime: expectedTime,
            percent: 0,
            start: null,
            running: false
          }; // Start animation.

          nodes.progress.classList.add('active');
        } else {
          // Adding a job.
          progress.doneBefore = progress.percent;
          progress.start = null;
          progress.expectedTime = expectedTime;
          progress.percentDoneAtEndOfJob = percentDoneAtEndOfJob;
        }

        if (!progress.running) {
          // Start animation.
          progress.running = true;
          window.requestAnimationFrame(animateTimer);
        }
      }

      window.cancelTimer = function cancelTimer() {
        progress.start = null;
        progress.running = false;
        nodes.progress.classList.remove('active');
      };

      nodes.form.addEventListener('submit', function (e) {
        console.log('submitted and valid');
        e.preventDefault(); // todo validation in case browser validation is not supported.

        nodes.submitButton.disabled = true;
        nodes.submitButton.textContent = 'Just a mo...'; // Expect it to take 2s to do first 20%

        startTimer(2, 20, 1);

        function cancelSubmission() {
          nodes.submitButton.disabled = false;
          nodes.submitButton.textContent = inlay.initData.signupButtonText;
          cancelTimer();
        }

        inlay.request({
          method: 'post',
          body: getFormData()
        }).then(function (r) {
          console.log(r);

          if (r.error) {
            alert("Sorry, there was a problem with the form: " + r.error);
            cancelSubmission();
          } else if (r.token) {
            console.log("Token received, waiting 5s"); // Expect it to take 6s to get to 80% though we'll be done in 5.

            startTimer(6, 80);
            setTimeout(function () {
              console.log("Sending 2nd request, with token"); // Expect it to take 2s to get to 100%

              startTimer(2, 100);
              inlay.request({
                method: 'post',
                body: getFormData(r.token)
              }).then(function (r) {
                if (r.success) {
                  cancelTimer();
                  nodes.form.style.display = 'none';
                  nodes.thanks.style.display = '';
                } else {
                  alert("Sorry, there was a problem with the form: " + (r.error || 'unknown error'));
                  cancelSubmission();
                  return;
                }
              });
            }, 5000);
          }
        });
      }); // Add to page.

      inlay.script.insertAdjacentElement('afterend', signupAppDiv);
    }; // Add style.
    // Your CSS as text


    var styles = "\n    .inlay-signup.at-rest .first_name,\n    .inlay-signup.at-rest .last_name,\n    .inlay-signup.at-rest .is-smallprint,\n    .inlay-signup.at-rest .is-close,\n    .inlay-signup.at-rest label {\n      display:none;\n    }\n    .inlay-signup.focussed .is-field {\n      margin-bottom: 1rem;\n    }\n    .inlay-signup.focussed .is-field input {\n      box-sizing:border-box;\n      width: 100%;\n    }\n    .inlay-signup.at-rest .email,\n    .inlay-signup.at-rest .is-buttons {\n      display:inline-block;\n      margin-left: 1rem;\n    }\n\n    .inlay-signup.focussed .is-overlay {\n      position:fixed;\n      z-index: 10000;\n      left:0;\n      right:0;\n      top:0;\n      bottom:0;\n      background-color: white;\n      background-color: rgba(255, 255, 255, 0.9);\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n    .inlay-signup.focussed .is-locator {\n      position: relative;\n      max-width: 30rem;\n      max-height: 90vh;\n      overflow: auto;\n      background: #662a73;\n      color: white;\n      padding: 2rem;\n      border-radius: 0.5rem;\n    }\n    .inlay-signup.focussed .is-close {\n      display:block;\n      appearance: none;\n      -moz-appearance: none;\n      -webkit-appearance: none;\n      position:absolute;\n      margin: 0;\n      padding: 0;\n      top: 1rem;\n      right: 1rem;\n      width: 4rem;\n      font-size: 2rem;\n      line-height: 1;\n      text-align: center;\n      background: transparent;\n      color:white;\n      border: none;\n    }\n    .is-thanks {\n      font-size: 1.6rem;\n      text-align: center;\n    }\n    .inlay-signup .is-progress {\n      height: 2px;\n      margin-top:0.25rem;\n      background-color: transparent;\n    }\n    .inlay-signup .is-progress.active {\n      background-color: white;\n    }\n\n    .inlay-signup.focussed label {\n    }\n    .inlay-signup.focussed label {\n      display: block;\n    }\n    .inlay-signup.focussed .is-buttons button {\n      width: 100%;\n    }\n    body.inlay-signup-modal-active {\n      position: fixed;\n      overflow: hidden;\n    }\n\n\n";
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
})();

/***/ }),

/***/ 0:
/*!*****************************!*\
  !*** multi ./src/signup.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /var/www/records.climateoutreach.org.uk/sites/all/modules/coin/civicrm/extensions/inlaysignup/src/signup.js */"./src/signup.js");


/***/ })

/******/ });