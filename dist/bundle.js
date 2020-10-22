// InlaySignup app
(() => {
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
    window.inlaySignupInit = inlay => {

      // Here we create the signup form and put it on the page.
      const signupAppDiv = document.createElement('div');
      // We append 'i' to the inlayID because classes can't start with a number.
      signupAppDiv.classList.add('inlay-signup', 'i' + inlay.publicID, 'at-rest');
      signupAppDiv.innerHTML = `
      <div class="is-overlay">
        <form class="is-locator" action='#' >
          <div class="is-field email">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="youremail@example.org"
              required
              />
          </div>
          <div class="is-field first_name">
            <label>First name</label>
            <input
              name="first_name"
              type="text"
              required
              />
          </div>
          <div class="is-field last_name">
            <label>Last name</label>
            <input
              name="last_name"
              type="text"
              required
              />
          </div>
          <div class="is-buttons">
            <div class="is-smallprint" ></div>
            <button class="is-submit" ></button>
            <div class="is-progress"></div>
          </div>
        </form>
        <div class="is-thanks is-locator">Thank you.</div>
      </div>
      `;
      const nodes = {
        overlay: signupAppDiv.firstElementChild,
        emailInput: signupAppDiv.querySelector('input[name="email"]'),
        firstNameInput: signupAppDiv.querySelector('input[name="first_name"]'),
        lastNameInput: signupAppDiv.querySelector('input[name="last_name"]'),
        submitButton: signupAppDiv.querySelector('button.is-submit'),
        smallprint: signupAppDiv.querySelector('.is-smallprint'),
        thanks: signupAppDiv.querySelector('.is-thanks'),
        progress: signupAppDiv.querySelector('.is-progress'),
        form: signupAppDiv.querySelector('form')
      };
      console.log({signupAppDiv, nodes});
      nodes.thanks.style.display = 'none';
      nodes.submitButton.textContent = inlay.initData.signupButtonText;
      nodes.thanks.innerHTML = inlay.initData.webThanksHTML;
      nodes.smallprint.innerHTML = inlay.initData.smallprintHTML;
      const allInputs = ['emailInput', 'firstNameInput', 'lastNameInput'].map(i => nodes[i]);

      var isActive = false;

      const handleInputInterraction = i => {
        if (!isActive) {
          // First time we're moving to active.
          signupAppDiv.classList.remove('at-rest');
          signupAppDiv.classList.add('focussed');
          document.body.classList.add('inlay-signup-modal-active');
          // Move our main DOM container.
          document.body.appendChild(signupAppDiv);
          isActive = true;
          setTimeout(() => nodes.emailInput.focus(), 1);
        }
        // Maintain a .invalid class on the parent container.
        i.classList.remove('pre-interaction');
        if (i.validity.valid) {
          i.parentNode.classList.remove('invalid');
        }
        else {
          i.parentNode.classList.add('invalid');
        }
      };

      const reset = e => {
        isActive = false;
        signupAppDiv.classList.add('at-rest');
        signupAppDiv.classList.remove('focussed');
        document.body.classList.remove('inlay-signup-modal-active');
        allInputs.forEach(i => { i.value = ''; i.classList.add('pre-interaction'); i.parentNode.classList.remove('invalid'); i.reset && i.reset(); });
        // replace the node.
        inlay.script.insertAdjacentElement('afterend', signupAppDiv);
        nodes.form.style.display = '';
        nodes.thanks.style.display = 'none';
        nodes.submitButton.textContent = inlay.initData.signupButtonText;
        nodes.submitButton.disabled = false;
      };

      nodes.overlay.addEventListener('click', function(e) {
        if (this === e.target) {
          // Reset if clicked directly, but ignore bubbling clicks from child elements.
          reset(e);
        }});
      nodes.thanks.addEventListener('click', function(e) {
        if (this === e.target) {
          // Reset if clicked directly, but ignore bubbling clicks from child elements.
          reset(e);
        }});

      // Initial state: don't show validation errors.
      allInputs.forEach(i => {
        // Inputs have a .pre-interaction class until they've been interacted
        // with, or the form has been submitted.
        i.classList.add('pre-interaction');
        i.addEventListener('input', e => handleInputInterraction(i));
        i.addEventListener('focus', e => handleInputInterraction(i));
      });

      // Remove the pre-interaction classes from all inputs when submit pressed.
      nodes.submitButton.addEventListener('click', e => {
        console.log('buttonclick');
        allInputs.forEach(i => handleInputInterraction);
      });

      function getFormData(token) {
        const d = {
            email: nodes.emailInput.value,
            first_name: nodes.firstNameInput.value,
            last_name: nodes.lastNameInput.value,
          };
        if (token) {
          d.token = token;
        }
        return d;
      }

      var progress = {
        doneBefore:0,
        jobTotal:100,
        expectedTime: null,
        percent: 0,
        start: null,
      };
      function animateTimer(t) {
        if (!progress.start) {
          progress.start = t;
        }
        const linear = Math.min(1, (t - progress.start) / progress.expectedTime);
        const easeout = 1 - (1-linear) * (1-linear) * (1-linear);
        progress.percent = progress.doneBefore + easeout * (progress.percentDoneAtEndOfJob - progress.doneBefore);

        nodes.progress.style.width = progress.percent + '%';
        if (progress.running && (linear < 1)) {
          window.requestAnimationFrame(animateTimer);
        }
        else {
          progress.running = false;
        }
      }

      function startTimer(expectedTime, percentDoneAtEndOfJob, reset) {
        expectedTime = expectedTime * 1000;
        if (reset) {
          progress = {
            doneBefore:0,
            percentDoneAtEndOfJob,
            expectedTime: expectedTime,
            percent: 0,
            start: null,
            running: false
          };
          // Start animation.
          nodes.progress.classList.add('active');
        }
        else {
          // Adding a job.
          progress.doneBefore = progress.percent;
          progress.start = null;
          progress.expectedTime = expectedTime;
          progress.percentDoneAtEndOfJob = percentDoneAtEndOfJob;
        }
        if (!progress.running) {
          // Start animation.
          progress.running = true;
          window.requestAnimationFrame(animateTimer)
        }
      }
      window.cancelTimer = function cancelTimer() {
        progress.start = null;
        progress.running = false;
        nodes.progress.classList.remove('active');
      }

      nodes.form.addEventListener('submit', e => {
        console.log('submitted and valid');
        e.preventDefault();
        // todo validation in case browser validation is not supported.

        nodes.submitButton.disabled = true;
        nodes.submitButton.textContent = 'Just a mo...';
        // Expect it to take 2s to do first 20%
        startTimer(2, 20, 1);

        function cancelSubmission() {
          nodes.submitButton.disabled = false;
          nodes.submitButton.textContent = inlay.initData.signupButtonText;
          cancelTimer();
        }

        inlay.request({ method: 'post', body: getFormData() })
        .then(r => {
          console.log(r);
          if (r.error) {
            alert("Sorry, there was a problem with the form: " + r.error);
            cancelSubmission();
          }
          else if (r.token) {
            console.log("Token received, waiting 5s");
            // Expect it to take 6s to get to 80% though we'll be done in 5.
            startTimer(6, 80);
            setTimeout(() => {
              console.log("Sending 2nd request, with token");
              // Expect it to take 2s to get to 100%
              startTimer(2, 100);
              inlay.request({ method: 'post', body: getFormData(r.token) })
              .then(r => {
                if (r.success) {
                  cancelTimer();
                  nodes.form.style.display = 'none';
                  nodes.thanks.style.display = '';
                }
                else {
                  alert("Sorry, there was a problem with the form: " + (r.error || 'unknown error'));
                  cancelSubmission();
                  return;
                }
              });
            }, 5000);
          }
        });
      });

      // Add to page.
      inlay.script.insertAdjacentElement('afterend', signupAppDiv);
    };


    // Add style.
    // Your CSS as text
    var styles = `
    .inlay-signup.at-rest .first_name,
    .inlay-signup.at-rest .last_name,
    .inlay-signup.at-rest .is-smallprint,
    .inlay-signup.at-rest label {
      display:none;
    }
    .inlay-signup.focussed .is-field {
      margin-bottom: 1rem;
    }
    .inlay-signup.focussed .is-field input {
      box-sizing:border-box;
      width: 100%;
    }
    .inlay-signup.at-rest .email,
    .inlay-signup.at-rest .is-buttons {
      display:inline-block;
      margin-left: 1rem;
    }

    .inlay-signup.focussed .is-overlay {
      position:fixed;
      z-index: 10000;
      left:0;
      right:0;
      top:0;
      bottom:0;
      background-color: white;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .inlay-signup.focussed .is-locator {
      max-width: 30rem;
      background: #662a73;
      color: white;
      padding: 2rem;
      border-radius: 1rem;
    }
    .is-thanks {
      font-size: 1.6rem;
      text-align: center;
    }
    .inlay-signup .is-progress {
      height: 2px;
      margin-top:0.25rem;
      background-color: transparent;
    }
    .inlay-signup .is-progress.active {
      background-color: white;
    }
    .inlay-signup.focussed label {
      display: block;
    }
    .inlay-signup.focussed .is-buttons button {
      width: 100%;
    }
    body.inlay-signup-modal-active {
      position: fixed;
      overflow: hidden;
    }


`
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
  }
})();
