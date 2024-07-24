// Inlaydownload app
import "./coDownload.scss";

(() => {
  let langMap = null;

  let ende = {
    Download: "Download",
    "Close this form": "Fenster schließen",
    required: "verpflichtend",
    "First name": "Vorname",
    "Last name": "Nachname",
    Email: "E-Mail Adresse",
    "youremail@example.org": "ihremail@example.org",
    "Email again to confirm": "E-Mail Adresse bestätigen",
    Organisation: "Organisation",
    "Please select": "Bitte auswählen",
    Yes: "Ja",
    No: "Nein",
    "Thank you.": "Vielen Dank ",
    "Just a mo...": "Einen Augenblick...",
    "Your download should begin automatically after a few seconds.<br/>If not use this <a>direct download link</a>":
      "Ihr Download sollte nach wenigen Sekunden automatisch beginnen.<br/>Falls nicht, verwenden Sie bitte diesen <a>direkten Download-Link</a>",
    "Please check your email; the two don’t match":
      "Keine Übereinstimmung; bitte überprüfen Sie Ihre E-Mail Adresse",
    "Sorry, there was a problem with the form":
      "Entschuldigung, es gab ein Problem mit dem Onlineformular",

    "It would be very helpful to understand how and where you intend to use these insights - could you give us a sense please?":
      "Wir würden gerne besser verstehen, wie unsere Handreichung für Sie nützlich sein kann. Könnten Sie uns mitteilen, wie Sie die Erkenntnisse in Ihrer Arbeit zu nutzen gedenken?",
    "<h2>We hope you find this resource useful -&nbsp;please do let us know what you think!</h2>":
      "<h2>Wir hoffen, dass Sie diese Handreichung nützlich finden - wir freuen uns über Rückmeldungen!</h2>",

    "We'd truly appreciate your support in helping us ensure our resources are as impactful as possible. May we send you a few questions about how you've used the resource in a couple of months?":
      "Ihr Feedback hilft uns dabei, unsere Ressourcen so anwendungsorientiert wie möglich zu gestalten. Dürfen wir Ihnen in ein paar Monaten ein paar Fragen zusenden, um zu erfahren, wie Sie diese Handreichung genutzt haben?",
    '<p>We will store, process and manage your information according to our <a href="https://climateoutreach.org/privacy-notice/">privacy policy</a>.&nbsp;</p>':
      '<p>Wir speichern, verarbeiten und verwalten Ihre Daten gemäß unserer <a href="https://climateoutreach.org/privacy-notice/">Datenschutzrichtlinie</a>.</p>',
  };

  // Call like: ts('My name is %1', {1: 'Lorem'});
  function ts(english, params) {
    let translated = english;

    if (langMap) {
      // We expect a translation
      if (!(english in langMap)) {
        console.warn("Missing translation for", { english });
      } else {
        translated = langMap[english];
        console.log("✔ translation for", { english, translated });
      }
    }
    // Translated or not, we need substitutions.
    Object.keys(params || {}).forEach((prop) => {
      translated.replace("%" + prop, params[prop]);
    });
    return translated;
  }

  if (!window.inlayCoDownloadInit) {
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
    window.inlayCoDownloadInit = (inlay) => {
      // Only do this once per inlay instance.
      if (inlay.booted) {
        return;
      }
      inlay.booted = true;
      const uniquePrefix = "i" + inlay.publicID;
      var isActive = false;
      var report = { title: "", id: 0, warning: "" };
      var nodes = {};

      function getFormData(token) {
        const d = {
          email: nodes.emailInput.value,
          first_name: nodes.firstNameInput.value,
          last_name: nodes.lastNameInput.value,
          organisation: nodes.orgInput.value,
          location: window.location.href,
          reportTitle: report.title,
          questionResponse: nodes.questionResponse.value,
          followup: nodes.followup.value,
        };
        if (token) {
          d.token = token;
        }
        return d;
      }

      const handleInputInterraction = (i, d) => {
        if (!isActive) {
          // First time we're moving to active.
          report.title = d.dataset.downloadTitle;
          // Check if this report has no followup and if so, remove the followup elements.
          // console.log({inlay});
          if (
            inlay.initData.noFollowup &&
            inlay.initData.noFollowup.includes(report.title)
          ) {
            // Remove followup.
            nodes.followupContainer.style.display = "none";
            nodes.followup.value = "No";
            console.log("Removing followup texts");
          }

          report.id = d.dataset.downloadId;
          report.warning = (d.dataset.downloadWarning || "")
            .replace(/^\s*/, "")
            .replace(/\s*$/, "");
          console.log(d);
          nodes.title.textContent = "Download: " + d.dataset.downloadTitle;
          if (report.warning) {
            nodes.warningDiv.classList.add("idl-warning");
            nodes.warningDiv.innerHTML = report.warning;
          }
          downloadAppDiv.classList.remove("at-rest");
          downloadAppDiv.classList.add("focussed");
          document.body.classList.add("inlay-download-modal-active");
          // Move our main DOM container.
          document.body.appendChild(downloadAppDiv);
          isActive = true;
          setTimeout(() => nodes.firstNameInput.focus(), 1);
        }
        if (i) {
          // Maintain a .invalid class on the parent container.
          i.classList.remove("pre-interaction");
          if (i.validity.valid) {
            i.parentNode.classList.remove("invalid");
          } else {
            i.parentNode.classList.add("invalid");
          }
        }
      };

      const reset = () => {
        isActive = false;
        downloadAppDiv.classList.add("at-rest");
        downloadAppDiv.classList.remove("focussed");
        document.body.classList.remove("inlay-download-modal-active");
        allInputs.forEach((i) => {
          i.value = "";
          i.classList.add("pre-interaction");
          i.parentNode.classList.remove("invalid");
          i.reset && i.reset();
        });
        nodes.form.style.display = "";
        nodes.thanks.style.display = "none";
        nodes.submitButtonText.textContent = inlay.initData.buttonText;
        nodes.submitButton.disabled = false;
      };

      // We need to add button after each <noscript data-inlay-id={ourID} data-download-title={title} data-download-id={id}>
      [].forEach.call(
        document.querySelectorAll(
          `noscript[data-inlay-id="${inlay.publicID}"]`
        ),
        (el, index, array) => {
          if (el.inlayProcessed) {
            return;
          }
          el.inlayProcessed = 1;
          const btn = document.createElement("a");
          btn.setAttribute("href", "#");
          // Copy classes from noscript tag to enable local styling.
          // Provide defaults.
          btn.className = el.className || "button button--orange";
          // When button clicked, call handleInputInterraction passing the original <noscript> node, el.
          btn.addEventListener("click", (e) => {
            handleInputInterraction(null, el);
          });
          btn.innerHTML =
            'Download<svg class="icon"><use xlink:href="#icon--button"></use></svg>';
          el.insertAdjacentElement("afterend", btn);

          // Language hack!
          // If a particular report ID is found, switch to German.
          // console.log("XXX ", {el, ds: el.dataset, id: el.dataset.downloadId});
          if (el.dataset.downloadId === "27530") {
            console.log("Switched to German");
            langMap = ende;
          }
        }
      );

      // Here we create the download form and put it on the page.
      const downloadAppDiv = document.createElement("div");
      // We append 'i' to the inlayID because classes can't start with a number.
      downloadAppDiv.classList.add(
        "inlay-download",
        "i" + inlay.publicID,
        "at-rest"
      );
      // We need to know the language.

      downloadAppDiv.innerHTML = `
      <div class="idl-overlay">
        <div class="idl-locator">
          <button class="idl-close" title="${ts("Close this form")}">×</button>
          <form action='#' >
            <h2 class="idl-title"></h2>
            <div class="idl-warning-placeholder"></div>
            <div class="idl-field first_name">
              <label for="${uniquePrefix}-fn">${ts(
        "First name"
      )}<sup class="red" title="${ts("required")}">*</sup></label>
              <input
                id="${uniquePrefix}-fn"
                name="first_name"
                type="text"
                required
                />
            </div>

            <div class="idl-field last_name">
              <label for="${uniquePrefix}-ln">${ts(
        "Last name"
      )}<sup class="red" title="${ts("required")}">*</sup></label>
              <input
                id="${uniquePrefix}-fn"
                name="last_name"
                type="text"
                required
                />
            </div>

            <div class="idl-field email">
              <label for="${uniquePrefix}-e1">${ts(
        "Email"
      )}<sup class="red" title="${ts("required")}">*</sup></label>
              <input
                id="${uniquePrefix}-e1"
                name="email"
                type="email"
                placeholder="${ts("youremail@example.org")}"
                required
                />
            </div>

            <div class="idl-field email">
              <label for="${uniquePrefix}-e2">${ts(
        "Email again to confirm"
      )}<sup class="red" title="${ts("required")}">*</sup></label>
              <input
                id="${uniquePrefix}-e1"
                name="email2"
                type="email"
                required
                />
            </div>

            <div class="idl-field organisation">
              <label for="${uniquePrefix}-o">${ts("Organisation")}
                 <sup class="red" title="${ts("required")}">*</sup> </label>
              <input
                id="${uniquePrefix}-o"
                name="organisation"
                type="text"
                placeholder=""
                required
                />
            </div>

            <div class="idl-field question">
              <label for="${uniquePrefix}-q"><span></span><sup class="red" title="${ts(
        "required"
      )}">*</sup></label>
              <textarea
                rows=6 cols=60
                id="${uniquePrefix}-q"
                name="question"
                required
                ></textarea>
            </div>

            <div class="idl-field followup">
              <label for="${uniquePrefix}-fu"><span></span><sup class="red" title="${ts(
        "required"
      )}">*</sup></label>
              <select id="${uniquePrefix}-fu" required name="followup" >
                <option value="">--${ts("Please select")}--</option>
                <option value="Yes">${ts("Yes")}</option>
                <option value="No">${ts("No")}</option>
              </select>
            </div>


            <div class="idl-buttons">
              <div class="idl-smallprint" ></div>
              <button class="idl-submit button button--orange" type="submit" >
                <span>${ts("Download")}</span>
                <svg class="icon"><use xlink:href="#icon--button"></use></svg>
              </button>
              <div class="idl-progress-container"><div class="idl-progress"></div></div>
            </div>
          </form>
          <div class="idl-thanks">
            <div class="text">${ts("Thank you.")}</div>
            <p>${ts(
              "Your download should begin automatically after a few seconds.<br/>If not use this <a>direct download link</a>"
            )}</p>
          </div>
        </div>
      </div>
      `;
      nodes = {
        overlay: downloadAppDiv.firstElementChild,
        emailInput: downloadAppDiv.querySelector('input[name="email"]'),
        title: downloadAppDiv.querySelector(".idl-title"),
        warningDiv: downloadAppDiv.querySelector(".idl-warning-placeholder"),
        email2Input: downloadAppDiv.querySelector('input[name="email2"]'),
        firstNameInput: downloadAppDiv.querySelector(
          'input[name="first_name"]'
        ),
        lastNameInput: downloadAppDiv.querySelector('input[name="last_name"]'),
        orgInput: downloadAppDiv.querySelector('input[name="organisation"]'),
        submitButton: downloadAppDiv.querySelector("button.idl-submit"),
        submitButtonText: downloadAppDiv.querySelector(
          "button.idl-submit span"
        ),
        closeButton: downloadAppDiv.querySelector("button.idl-close"),
        smallprint: downloadAppDiv.querySelector(".idl-smallprint"),
        thanks: downloadAppDiv.querySelector(".idl-thanks"),
        thanksText: downloadAppDiv.querySelector(".idl-thanks .text"),
        downloadLink: downloadAppDiv.querySelector(".idl-thanks a"),
        progress: downloadAppDiv.querySelector(".idl-progress"),
        form: downloadAppDiv.querySelector("form"),
        questionLabel: downloadAppDiv.querySelector(".question label span"),
        questionResponse: downloadAppDiv.querySelector(".question textarea"),
        followupLabel: downloadAppDiv.querySelector(".followup label span"),
        followup: downloadAppDiv.querySelector(".followup select"),
        followupContainer: downloadAppDiv.querySelector(".followup"),
      };

      // Set up the thanks and hide it.
      nodes.thanksText.innerHTML = ts(inlay.initData.webThanksHTML);
      nodes.thanks.style.display = "none";
      // Set button text
      nodes.submitButtonText.textContent = inlay.initData.buttonText;
      // Set up other texts
      nodes.smallprint.innerHTML = ts(inlay.initData.smallprintHTML);
      nodes.questionLabel.textContent = ts(inlay.initData.questionText);
      nodes.followupLabel.textContent = ts(inlay.initData.followupText);

      const allInputs = [
        "emailInput",
        "firstNameInput",
        "lastNameInput",
        "email2Input",
        "orgInput",
      ].map((i) => nodes[i]);
      // Provide ways to close the overlay.
      nodes.overlay.addEventListener("click", function (e) {
        if (this === e.target) reset();
      });
      nodes.thanks.addEventListener("click", reset);
      nodes.closeButton.addEventListener("click", reset);

      // Initial state: don't show validation errors.
      allInputs.forEach((i) => {
        // Inputs have a .pre-interaction class until they've been interacted
        // with, or the form has been subitted.
        i.classList.add("pre-interaction");
        i.addEventListener("input", (e) => handleInputInterraction(i));
        i.addEventListener("focus", (e) => handleInputInterraction(i));
      });

      // Submit button clicked (form may be valid or not)
      // Remove the pre-interaction classes from all inputs when submit pressed.
      nodes.submitButton.addEventListener("click", (e) => {
        console.log("buttonclick");
        allInputs.forEach((i) => handleInputInterraction);
        // Invalidate if emails don't match.
        if (nodes.email2Input.value !== nodes.emailInput.value) {
          alert(ts("Please check your email; the two don’t match"));
          // Prevent form submission.
          e.preventDefault();
          return;
        }
      });

      var progress = {
        doneBefore: 0,
        jobTotal: 100,
        expectedTime: null,
        percent: 0,
        start: null,
      };
      function animateTimer(t) {
        if (!progress.start) {
          progress.start = t;
        }
        const linear = Math.min(
          1,
          (t - progress.start) / progress.expectedTime
        );
        const easeout = 1 - (1 - linear) * (1 - linear) * (1 - linear);
        progress.percent =
          progress.doneBefore +
          easeout * (progress.percentDoneAtEndOfJob - progress.doneBefore);

        nodes.progress.style.width = progress.percent + "%";
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
            percentDoneAtEndOfJob,
            expectedTime: expectedTime,
            percent: 0,
            start: null,
            running: false,
          };
          // Start animation.
          nodes.progress.parentNode.classList.add("active");
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
        nodes.progress.parentNode.classList.remove("active");
      };

      nodes.form.addEventListener("submit", (e) => {
        console.log("submitted and valid");
        e.preventDefault();
        // todo validation in case browser validation is not supported.

        nodes.submitButton.disabled = true;
        nodes.submitButton.textContent = ts("Just a mo...");
        // Expect it to take 2s to do first 20%
        startTimer(2, 20, 1);

        function cancelSubmission() {
          nodes.submitButton.disabled = false;
          nodes.submitButtonText.textContent = ts(inlay.initData.buttonText);
          cancelTimer();
        }

        inlay
          .request({ method: "post", body: getFormData() })
          .then((r) => {
            if (!r) {
              return;
            } else if (r.error) {
              alert(
                ts("Sorry, there was a problem with the form") + " :" + r.error
              );
              cancelSubmission();
            } else if (r.token) {
              console.log("Token received, waiting 5s");
              // Expect it to take 6s to get to 80% though we'll be done in 5.
              startTimer(6, 80);
              setTimeout(() => {
                console.log("Sending 2nd request, with token");
                // Expect it to take 2s to get to 100%
                startTimer(2, 100);
                inlay
                  .request({ method: "post", body: getFormData(r.token) })
                  .then((r) => {
                    if (r.success) {
                      cancelTimer();
                      nodes.form.style.display = "none";
                      nodes.thanks.style.display = "";
                      // Redirect browser to the download page.
                      nodes.downloadLink.setAttribute(
                        "href",
                        "/download/" + report.id
                      );
                      window.location = "/download/" + report.id;
                    } else {
                      alert(
                        ts("Sorry, there was a problem with the form") +
                          " :" +
                          (r.error || "unknown error")
                      );
                      cancelSubmission();
                      return;
                    }
                  });
              }, 5000);
            }
          })
          .catch((e) => {
            console.error("coDownload catch", e);
            cancelSubmission();
          });
      });

      // Add to page.
      inlay.script.insertAdjacentElement("afterend", downloadAppDiv);
    };
  }
})();
