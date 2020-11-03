<template>
  <div style="overflow:hidden;" class="inlay-signup-a">

    <h2 v-if="inlay.initData.publicTitle">{{inlay.initData.publicTitle}}</h2>

    <ometer-sos-tree
      :count="inlay.initData.count"
      :target="target"
      stmt="trees planted"
      ></ometer-sos-tree>

    <form action='#' @submit.prevent="submitForm" v-if="stage === 'form'">

      <div class="isa-2-cols">
        <div>
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
        <div>
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

      <div>
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
      -->

      <div class="ic-smallprint"
        v-if="inlay.initData.smallprintHTML"
        v-html="inlay.initData.smallprintHTML"></div>

      <div class="ic-submit">
        <button
         @click="wantsToSubmit"
         :disabled="$root.submissionRunning"
          >{{ $root.submissionRunning ? "Please wait.." : inlay.initData.submitButtonText }}</button>
        <inlay-progress ref="progress"></inlay-progress>
      </div>

    </form>

    <div v-if="stage === 'thanks'">
      <div v-html="inlay.initData.webThanksHTML"></div>
      <inlay-socials :socials="inlay.initData.socials" icons="1"></inlay-socials>
    </div>
  </div>
</template>
<style lang="scss">
.inlay-signup-a {
  .isa-2-cols {
    margin-left: -1rem;
    margin-right: -1rem;
    display: flex;
    flex-wrap: wrap;

    &>div {
      flex: 1 0 8rem;
      padding: 0 1rem;
    }
  }

  label {
    display: block;
  }

  input[type="text"],
  input[type="email"],
  textarea {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
<script>
import InlayProgress from './InlayProgress.vue';
import InlaySocials from './InlaySocials.vue';
import OmeterSosTree from './OmeterSosTree.vue';
// import 'vue-select/dist/vue-select.css';
// import vSelect from 'vue-select';

export default {
  props: ['inlay'],
  components: {InlayProgress, InlaySocials, OmeterSosTree},
  data() {
    const d = {
      stage: 'form',
      myId: this.$root.getNextId(),

      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    };
    return d;
  },
  computed: {
    target() {
      // always at 70%
      return Math.floor((this.inlay.initData.count / 0.7) / 1000) * 1000 + 1000;
    }
  },
  methods: {
    wantsToSubmit() {
      // validate all fields.
    },
    submitForm() {
      // Form is valid according to browser.
      this.$root.submissionRunning = true;
      const d = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone: this.phone
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
