<template>
  <div style="overflow:hidden;" class="inlay-signup-co isco">

    <form action='#' @submit.prevent="submitForm" v-if="stage === 'form'">
      <h2 v-if="inlay.initData.publicTitle">{{inlay.initData.publicTitle}}</h2>

      <div v-if="inlay.initData.introHTML"
        class="isco-intro"
        v-html="inlay.initData.introHTML"></div>

      <div class="isco-2-cols">
        <div class="isco-input-wrapper">
          <label :for="myId + 'fname'" >First name</label>
          <input
            required
            type="text"
            :id="myId + 'fname'"
            :name="first_name"
            :ref="first_name"
            :disabled="$root.submissionRunning"
            v-model="first_name"
            />
        </div>
        <div class="isco-input-wrapper">
          <label :for="myId + 'lname'" >Last name</label>
          <input
            required
            type="text"
            :id="myId + 'lname'"
            :name="last_name"
            :ref="last_name"
            :disabled="$root.submissionRunning"
            v-model="last_name"
            />
        </div>
      </div>

      <div class="isco-2-cols">
        <div class="isco-input-wrapper">
          <label :for="myId + 'email'" >Email</label>
          <input
            required
            type="email"
            :id="myId + 'email'"
            :name="email"
            :ref="email"
            :disabled="$root.submissionRunning"
            v-model="email"
            />
        </div>

        <div class="isco-input-wrapper">
          <label :for="myId + 'email'" >Email again</label>
          <input
            required
            type="email"
            :id="myId + 'email2'"
            :name="email2"
            :ref="email2"
            :disabled="$root.submissionRunning"
            @input="validateEmail2"
            v-model="email2"
            />
        </div>
      </div>

      <div class="isco-2-cols">
        <div class="isco-input-wrapper">
          <label :for="myId + 'organisation'" >Organisation</label>
          <input
            required
            type="text"
            :id="myId + 'organisation'"
            :name="organisation"
            :ref="organisation"
            :disabled="$root.submissionRunning"
            v-model="organisation"
            />
        </div>

        <div class="isco-input-wrapper">
          <label :for="myId + 'country'" >Country</label>
          <select
            required
            :id="myId + 'country'"
            :name="country"
            :ref="country"
            :disabled="$root.submissionRunning"
            v-model="country"
            >
            <option v-for="c in inlay.initData.countries"
                    :value="c[0]">{{c[1]}}</option>
          </select>
        </div>
      </div>

      <!--
      <div v-if="inlay.initData.phoneAsk">
        <label :for="myId + 'phone'" >Phone</label>
        <input
          type="text"
          :id="myId + 'phone'"
          :name="phone"
          :ref="phone"
          :disabled="$root.submissionRunning"
          v-model="phone"
          />
      </div>

      <div class="isco-smallprint"
        v-if="inlay.initData.smallprintHTML"
        v-html="inlay.initData.smallprintHTML"></div>
      -->

      <div class="isco-submit">
        <button
         @click="wantsToSubmit"
         :disabled="$root.submissionRunning"
          class="submit"
          >{{ $root.submissionRunning ? "Please wait.." : inlay.initData.submitButtonText }}</button>
        <inlay-progress ref="progress"></inlay-progress>
      </div>

      <div class="isco-error">{{ error }}</div>

    </form>

    <div v-if="stage === 'thanks'">
      <div v-html="inlay.initData.webThanksHTML"></div>
      <inlay-socials :socials="inlay.initData.socials" icons="1"></inlay-socials>
    </div>
  </div>
</template>
<style lang="scss">
  $orange: #f67f00;
  $yellow: #ffc839;
.inlay-signup-co {
  .isco-2-cols {
    margin-left: -1rem;
    margin-right: -1rem;
    display: flex;
    flex-wrap: wrap;

    &>div {
      flex: 1 0 18rem;
      padding: 0 1rem;
    }
  }

  .isco-intro {
    font-size: 1.3125rem;
  }

  .isco-input-wrapper {
    margin-bottom: 1rem;
  }
  input[type="text"],
  input[type="email"],
  select,
  label {
    display: block;
    box-sizing: border-box;
    width: 100%;
  }

  .isco-submit {
    text-align: center;

    button {
      // font-size: 1.1rem;
      // background: $yellow;
      // &:hover { background: $orange; }
    }
  }

  .isco-error {
    color: #a00;
  }
}
</style>
<script>
import InlayProgress from './InlayProgress.vue';
import InlaySocials from './InlaySocials.vue';

export default {
  props: ['inlay'],
  components: {InlayProgress, InlaySocials},
  data() {
    const d = {
      stage: 'form',
      myId: this.$root.getNextId(),

      first_name: '',
      last_name: '',
      email: '',
      email2: '',
      organisation: '',
      country: 'GB',

      error: ''
    };
    return d;
  },
  computed: {
    target() {
      // always at 70%
      return Math.floor((this.inlay.initData.count / 0.7) / 1000) * 1000 + 1000;
    },
    countSigners() {
      return this.inlay.initData.count + (this.stage === 'thanks' ? 1 : 0);
    }
  },
  methods: {
    wantsToSubmit(e) {
      // validate all fields.
      if (!this.validateEmail2()) {
        e.preventDefault();
        return;
      }
    },
    validateEmail2() {
      if (this.email != this.email2) {
        this.error = 'Emails do not match';
        return false;
      }
      this.error = '';
      return true;
    },
    submitForm() {
      // Form is valid according to browser.
      this.$root.submissionRunning = true;
      const d = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        organisation: this.organisation,
        country: this.country
      };

      const progress = this.$refs.progress;
      // Allow 5s to get 20% through in first submit.
      progress.startTimer(5, 20, {reset: 1});
      this.inlay.request({method: 'post', body: d})
        .then(r => {
          if (r.token) {
            d.token = r.token;
            // Allow 5s for our wait, taking us to 80% linearly.
            progress.startTimer(5, 80, {easing: false});
            // Force 5s wait for the token to become valid
            return new Promise((resolve, reject) => {
              window.setTimeout(resolve, 5000);
            });
          }
          else {
            console.warn("unexpected resonse", r);
            throw (r.error || 'Unknown error');
          }
        })
        .then(() => {
          // Finally allow 5s for the final submission to 100%
          progress.startTimer(5, 100);
          return this.inlay.request({method: 'post', body: d});
        })
        .then(r => {
          if (r.error) {
            throw (r.error);
          }
          this.stage = 'thanks';
          progress.cancelTimer();
        })
        .catch(e => {
          console.error(e);
          if (typeof e === 'String') {
            alert(e);
          }
          else {
            alert("Unexpected error");
          }
          this.$root.submissionRunning = false;
          progress.cancelTimer();
        });
    }
  }
}
</script>
