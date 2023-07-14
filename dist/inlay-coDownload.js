(()=>{"use strict";var e={205:(e,n,t)=>{t.d(n,{Z:()=>i});var o=t(645),a=t.n(o)()((function(e){return e[1]}));a.push([e.id,"body.inlay-download-modal-active{overflow:hidden;position:fixed}.inlay-download .idl-overlay{align-items:center;background-color:hsla(0,0%,100%,.8);bottom:0;display:none;justify-content:center;left:0;position:fixed;right:0;top:0;z-index:1000}.inlay-download.focussed .idl-overlay{display:flex}.inlay-download .idl-locator{background:#f8f8f5;border-radius:0;flex:0 1 60rem;max-height:90vh;overflow:auto;padding:2rem;position:relative}.inlay-download .idl-close{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#fff;border:none;color:#888;display:block;font-size:2rem;line-height:1;margin:0;padding:0;position:absolute;right:1rem;text-align:center;top:1rem;width:4rem}.inlay-download .idl-close:active,.inlay-download .idl-close:hover{background:#f25d2a;color:#fff}.inlay-download .idl-thanks{font-size:1.6rem;text-align:center}.inlay-download .idl-progress-container{height:2px;margin-top:.25rem}.inlay-download .idl-progress-container .idl-progress{height:2px}.inlay-download .idl-progress-container.active{background-color:#fff}.inlay-download .idl-progress-container.active .idl-progress{background-color:#f25d2a}.inlay-download label{font-weight:700;padding:.375rem}.inlay-download label p{font-size:inherit}.inlay-download label p:last-child{margin-bottom:0}.inlay-download input[type=email],.inlay-download input[type=text],.inlay-download textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;border:1px solid #dcdcdc;color:#111;padding:.75rem;width:100%}.inlay-download form{align-items:top;display:flex;flex-wrap:wrap;margin:0 -1rem;padding:0}.inlay-download h2{flex:0 100%;padding:0 5rem 0 1rem}.inlay-download .idl-field{flex:1 0 45%;margin-bottom:1rem;min-width:18rem;padding:0 1rem}.inlay-download .idl-field.followup,.inlay-download .idl-field.question{flex:0 0 100%}.inlay-download .idl-buttons{flex:0 0 100%;padding-bottom:2rem;text-align:center}.inlay-download a:link,.inlay-download a:visited{color:#f25d2a}.inlay-download a:active,.inlay-download a:hover{color:#f25d2a;text-decoration:underline}.inlay-download .idl-warning{background-color:#2f2831;border-radius:6px;color:#fff;margin-bottom:1rem;padding:.5rem 1rem}.inlay-download .idl-warning strong{color:#f25d2a;font-weight:700}.inlay-download .idl-warning p:last-child{margin-bottom:0}",""]);const i=a},645:e=>{e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=e(n);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,o){"string"==typeof e&&(e=[[null,e,""]]);var a={};if(o)for(var i=0;i<this.length;i++){var r=this[i][0];null!=r&&(a[r]=!0)}for(var l=0;l<e.length;l++){var s=[].concat(e[l]);o&&a[s[0]]||(t&&(s[2]?s[2]="".concat(t," and ").concat(s[2]):s[2]=t),n.push(s))}},n}},379:(e,n,t)=>{var o,a=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},i=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),r=[];function l(e){for(var n=-1,t=0;t<r.length;t++)if(r[t].identifier===e){n=t;break}return n}function s(e,n){for(var t={},o=[],a=0;a<e.length;a++){var i=e[a],s=n.base?i[0]+n.base:i[0],d=t[s]||0,c="".concat(s," ").concat(d);t[s]=d+1;var u=l(c),p={css:i[1],media:i[2],sourceMap:i[3]};-1!==u?(r[u].references++,r[u].updater(p)):r.push({identifier:c,updater:v(p,n),references:1}),o.push(c)}return o}function d(e){var n=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var a=t.nc;a&&(o.nonce=a)}if(Object.keys(o).forEach((function(e){n.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(n);else{var r=i(e.insert||"head");if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}return n}var c,u=(c=[],function(e,n){return c[e]=n,c.filter(Boolean).join("\n")});function p(e,n,t,o){var a=t?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=u(n,a);else{var i=document.createTextNode(a),r=e.childNodes;r[n]&&e.removeChild(r[n]),r.length?e.insertBefore(i,r[n]):e.appendChild(i)}}function f(e,n,t){var o=t.css,a=t.media,i=t.sourceMap;if(a?e.setAttribute("media",a):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var m=null,h=0;function v(e,n){var t,o,a;if(n.singleton){var i=h++;t=m||(m=d(n)),o=p.bind(null,t,i,!1),a=p.bind(null,t,i,!0)}else t=d(n),o=f.bind(null,t,n),a=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return o(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;o(e=n)}else a()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=a());var t=s(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<t.length;o++){var a=l(t[o]);r[a].references--}for(var i=s(e,n),d=0;d<t.length;d++){var c=l(t[d]);0===r[c].references&&(r[c].updater(),r.splice(c,1))}t=i}}}}},n={};function t(o){var a=n[o];if(void 0!==a)return a.exports;var i=n[o]={id:o,exports:{}};return e[o](i,i.exports,t),i.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.nc=void 0,(()=>{var e=t(379),n=t.n(e),o=t(205),a={insert:"head",singleton:!1};n()(o.Z,a);o.Z.locals;!function(){var e=null,n={Download:"Download","Close this form":"Fenster schließen",required:"verpflichtend","First name":"Vorname","Last name":"Nachname",Email:"E-Mail Adresse","youremail@example.org":"ihremail@example.org","Email again to confirm":"E-Mail Adresse bestätigen",Organisation:"Organisation","Please select":"Bitte auswählen",Yes:"Ja",No:"Nein","Thank you.":"Vielen Dank ","Just a mo...":"Einen Augenblick...","Your download should begin automatically after a few seconds.<br/>If not use this <a>direct download link</a>":"Ihr Download sollte nach wenigen Sekunden automatisch beginnen.<br/>Falls nicht, verwenden Sie bitte diesen <a>direkten Download-Link</a>","Please check your email; the two don’t match":"Keine Übereinstimmung; bitte überprüfen Sie Ihre E-Mail Adresse","Sorry, there was a problem with the form":"Entschuldigung, es gab ein Problem mit dem Onlineformular","It would be very helpful to understand how and where you intend to use these insights - could you give us a sense please?":"Wir würden gerne besser verstehen, wie unsere Handreichung für Sie nützlich sein kann. Könnten Sie uns mitteilen, wie Sie die Erkenntnisse in Ihrer Arbeit zu nutzen gedenken?","<h2>We hope you find this resource useful -&nbsp;please do let us know what you think!</h2>":"<h2>Wir hoffen, dass Sie diese Handreichung nützlich finden - wir freuen uns über Rückmeldungen!</h2>","We'd truly appreciate your support in helping us ensure our resources are as impactful as possible. May we send you a few questions about how you've used the resource in a couple of months?":"Ihr Feedback hilft uns dabei, unsere Ressourcen so anwendungsorientiert wie möglich zu gestalten. Dürfen wir Ihnen in ein paar Monaten ein paar Fragen zusenden, um zu erfahren, wie Sie diese Handreichung genutzt haben?",'<p>We will store, process and manage your information according to our <a href="https://climateoutreach.org/privacy-notice/">privacy policy</a>.&nbsp;</p>':'<p>Wir speichern, verarbeiten und verwalten Ihre Daten gemäß unserer <a href="https://climateoutreach.org/privacy-notice/">Datenschutzrichtlinie</a>.</p>'};function t(n,t){var o=n;return e&&(n in e?(o=e[n],console.log("✔ translation for",{english:n,translated:o})):console.warn("Missing translation for",{english:n})),Object.keys(t||{}).forEach((function(e){o.replace("%"+e,t[e])})),o}window.inlayCoDownloadInit||(window.inlayCoDownloadInit=function(o){if(!o.booted){o.booted=!0;var a="i"+o.publicID,i=!1,r={title:"",id:0,warning:""},l={},s=function(e,n){i||(r.title=n.dataset.downloadTitle,o.initData.noFollowup&&o.initData.noFollowup.includes(r.title)&&(l.followupContainer.style.display="none",l.followup.value="No",console.log("Removing followup texts")),r.id=n.dataset.downloadId,r.warning=(n.dataset.downloadWarning||"").replace(/^\s*/,"").replace(/\s*$/,""),console.log(n),l.title.textContent="Download: "+n.dataset.downloadTitle,r.warning&&(l.warningDiv.classList.add("idl-warning"),l.warningDiv.innerHTML=r.warning),c.classList.remove("at-rest"),c.classList.add("focussed"),document.body.classList.add("inlay-download-modal-active"),document.body.appendChild(c),i=!0,setTimeout((function(){return l.firstNameInput.focus()}),1)),e&&(e.classList.remove("pre-interaction"),e.validity.valid?e.parentNode.classList.remove("invalid"):e.parentNode.classList.add("invalid"))},d=function(){i=!1,c.classList.add("at-rest"),c.classList.remove("focussed"),document.body.classList.remove("inlay-download-modal-active"),u.forEach((function(e){e.value="",e.classList.add("pre-interaction"),e.parentNode.classList.remove("invalid"),e.reset&&e.reset()})),l.form.style.display="",l.thanks.style.display="none",l.submitButtonText.textContent=o.initData.buttonText,l.submitButton.disabled=!1};[].forEach.call(document.querySelectorAll('noscript[data-inlay-id="'.concat(o.publicID,'"]')),(function(t,o,a){if(!t.inlayProcessed){t.inlayProcessed=1;var i=document.createElement("a");i.setAttribute("href","#"),i.className=t.className||"button button--orange",i.addEventListener("click",(function(e){s(null,t)})),i.innerHTML='Download<svg class="icon"><use xlink:href="#icon--button"></use></svg>',t.insertAdjacentElement("afterend",i),"27530"===t.dataset.downloadId&&(console.log("Switched to German"),e=n)}}));var c=document.createElement("div");c.classList.add("inlay-download","i"+o.publicID,"at-rest"),c.innerHTML='\n      <div class="idl-overlay">\n        <div class="idl-locator">\n          <button class="idl-close" title="'.concat(t("Close this form"),'">×</button>\n          <form action=\'#\' >\n            <h2 class="idl-title"></h2>\n            <div class="idl-warning-placeholder"></div>\n            <div class="idl-field first_name">\n              <label for="').concat(a,'-fn">').concat(t("First name"),'<sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <input\n                id="').concat(a,'-fn"\n                name="first_name"\n                type="text"\n                required\n                />\n            </div>\n\n            <div class="idl-field last_name">\n              <label for="').concat(a,'-ln">').concat(t("Last name"),'<sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <input\n                id="').concat(a,'-fn"\n                name="last_name"\n                type="text"\n                required\n                />\n            </div>\n\n            <div class="idl-field email">\n              <label for="').concat(a,'-e1">').concat(t("Email"),'<sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <input\n                id="').concat(a,'-e1"\n                name="email"\n                type="email"\n                placeholder="').concat(t("youremail@example.org"),'"\n                required\n                />\n            </div>\n\n            <div class="idl-field email">\n              <label for="').concat(a,'-e2">').concat(t("Email again to confirm"),'<sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <input\n                id="').concat(a,'-e1"\n                name="email2"\n                type="email"\n                required\n                />\n            </div>\n\n            <div class="idl-field organisation">\n              <label for="').concat(a,'-o">').concat(t("Organisation"),'</label>\n              <input\n                id="').concat(a,'-o"\n                name="organisation"\n                type="text"\n                placeholder=""\n                />\n            </div>\n\n            <div class="idl-field question">\n              <label for="').concat(a,'-q"><span></span><sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <textarea\n                rows=6 cols=60\n                id="').concat(a,'-q"\n                name="question"\n                required\n                ></textarea>\n            </div>\n\n            <div class="idl-field followup">\n              <label for="').concat(a,'-fu"><span></span><sup class="red" title="').concat(t("required"),'">*</sup></label>\n              <select id="').concat(a,'-fu" required name="followup" >\n                <option value="">--').concat(t("Please select"),'--</option>\n                <option value="Yes">').concat(t("Yes"),'</option>\n                <option value="No">').concat(t("No"),'</option>\n              </select>\n            </div>\n\n\n            <div class="idl-buttons">\n              <div class="idl-smallprint" ></div>\n              <button class="idl-submit button button--orange" type="submit" >\n                <span>').concat(t("Download"),'</span>\n                <svg class="icon"><use xlink:href="#icon--button"></use></svg>\n              </button>\n              <div class="idl-progress-container"><div class="idl-progress"></div></div>\n            </div>\n          </form>\n          <div class="idl-thanks">\n            <div class="text">').concat(t("Thank you."),"</div>\n            <p>").concat(t("Your download should begin automatically after a few seconds.<br/>If not use this <a>direct download link</a>"),"</p>\n          </div>\n        </div>\n      </div>\n      "),(l={overlay:c.firstElementChild,emailInput:c.querySelector('input[name="email"]'),title:c.querySelector(".idl-title"),warningDiv:c.querySelector(".idl-warning-placeholder"),email2Input:c.querySelector('input[name="email2"]'),firstNameInput:c.querySelector('input[name="first_name"]'),lastNameInput:c.querySelector('input[name="last_name"]'),orgInput:c.querySelector('input[name="organisation"]'),submitButton:c.querySelector("button.idl-submit"),submitButtonText:c.querySelector("button.idl-submit span"),closeButton:c.querySelector("button.idl-close"),smallprint:c.querySelector(".idl-smallprint"),thanks:c.querySelector(".idl-thanks"),thanksText:c.querySelector(".idl-thanks .text"),downloadLink:c.querySelector(".idl-thanks a"),progress:c.querySelector(".idl-progress"),form:c.querySelector("form"),questionLabel:c.querySelector(".question label span"),questionResponse:c.querySelector(".question textarea"),followupLabel:c.querySelector(".followup label span"),followup:c.querySelector(".followup select"),followupContainer:followup.parentElement}).thanksText.innerHTML=t(o.initData.webThanksHTML),l.thanks.style.display="none",l.submitButtonText.textContent=o.initData.buttonText,l.smallprint.innerHTML=t(o.initData.smallprintHTML),l.questionLabel.textContent=t(o.initData.questionText),l.followupLabel.textContent=t(o.initData.followupText);var u=["emailInput","firstNameInput","lastNameInput","email2Input","orgInput"].map((function(e){return l[e]}));l.overlay.addEventListener("click",(function(e){this===e.target&&d()})),l.thanks.addEventListener("click",d),l.closeButton.addEventListener("click",d),u.forEach((function(e){e.classList.add("pre-interaction"),e.addEventListener("input",(function(n){return s(e)})),e.addEventListener("focus",(function(n){return s(e)}))})),l.submitButton.addEventListener("click",(function(e){if(console.log("buttonclick"),u.forEach((function(e){return s})),l.email2Input.value!==l.emailInput.value)return alert(t("Please check your email; the two don’t match")),void e.preventDefault()}));var p={doneBefore:0,jobTotal:100,expectedTime:null,percent:0,start:null};window.cancelTimer=function(){p.start=null,p.running=!1,l.progress.parentNode.classList.remove("active")},l.form.addEventListener("submit",(function(e){function n(){l.submitButton.disabled=!1,l.submitButtonText.textContent=t(o.initData.buttonText),cancelTimer()}console.log("submitted and valid"),e.preventDefault(),l.submitButton.disabled=!0,l.submitButton.textContent=t("Just a mo..."),h(2,20,1),o.request({method:"post",body:f()}).then((function(e){e&&(e.error?(alert(t("Sorry, there was a problem with the form")+" :"+e.error),n()):e.token&&(console.log("Token received, waiting 5s"),h(6,80),setTimeout((function(){console.log("Sending 2nd request, with token"),h(2,100),o.request({method:"post",body:f(e.token)}).then((function(e){if(!e.success)return alert(t("Sorry, there was a problem with the form")+" :"+(e.error||"unknown error")),void n();cancelTimer(),l.form.style.display="none",l.thanks.style.display="",l.downloadLink.setAttribute("href","/download/"+r.id),window.location="/download/"+r.id}))}),5e3)))})).catch((function(e){console.error("coDownload catch",e),n()}))})),o.script.insertAdjacentElement("afterend",c)}function f(e){var n={email:l.emailInput.value,first_name:l.firstNameInput.value,last_name:l.lastNameInput.value,organisation:l.orgInput.value,location:window.location.href,reportTitle:r.title,questionResponse:l.questionResponse.value,followup:l.followup.value};return e&&(n.token=e),n}function m(e){p.start||(p.start=e);var n=Math.min(1,(e-p.start)/p.expectedTime),t=1-(1-n)*(1-n)*(1-n);p.percent=p.doneBefore+t*(p.percentDoneAtEndOfJob-p.doneBefore),l.progress.style.width=p.percent+"%",p.running&&n<1?window.requestAnimationFrame(m):p.running=!1}function h(e,n,t){e*=1e3,t?(p={doneBefore:0,percentDoneAtEndOfJob:n,expectedTime:e,percent:0,start:null,running:!1},l.progress.parentNode.classList.add("active")):(p.doneBefore=p.percent,p.start=null,p.expectedTime=e,p.percentDoneAtEndOfJob=n),p.running||(p.running=!0,window.requestAnimationFrame(m))}})}()})()})();