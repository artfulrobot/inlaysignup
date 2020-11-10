<template>
  <ul class="inlay-socials">
    <li v-for="sn in buttons">
      <a :class="'inlay-socials--' + sn.name"
        :href="sn.url"
        target="_blank"
        >
        <!-- icons from https://teenyicons.com/ -->
        <svg v-if="icons && sn.name==='twitter'" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M14.977 1.467a.5.5 0 00-.87-.301 2.559 2.559 0 01-1.226.763A3.441 3.441 0 0010.526 1a3.539 3.539 0 00-3.537 3.541v.44C3.998 4.75 2.4 2.477 1.967 1.325a.5.5 0 00-.916-.048C.004 3.373-.157 5.407.604 7.139 1.27 8.656 2.61 9.864 4.51 10.665 3.647 11.276 2.194 12 .5 12a.5.5 0 00-.278.916C1.847 14 3.55 14 5.132 14h.048c4.861 0 8.8-3.946 8.8-8.812v-.479c.363-.37.646-.747.82-1.236.193-.546.232-1.178.177-2.006z" fill="currentColor"></path></svg>
        <svg v-if="icons && sn.name==='facebook'" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M0 7.5a7.5 7.5 0 118 7.484V9h2V8H8V6.5A1.5 1.5 0 019.5 5h.5V4h-.5A2.5 2.5 0 007 6.5V8H5v1h2v5.984A7.5 7.5 0 010 7.5z" fill="currentColor"></path></svg>
        <svg v-if="icons && sn.name==='whatsapp'" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M5 4.768a.5.5 0 01.761.34l.14.836a.5.5 0 01-.216.499l-.501.334A4.501 4.501 0 015 5.5v-.732zM9.5 10a4.5 4.5 0 01-1.277-.184l.334-.5a.5.5 0 01.499-.217l.836.14a.5.5 0 01.34.761H9.5z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.5a7.5 7.5 0 113.253 6.182l-2.53 1.265a.5.5 0 01-.67-.67l1.265-2.53A7.467 7.467 0 010 7.5zm4.23-3.42l.206-.138a1.5 1.5 0 012.311 1.001l.14.837a1.5 1.5 0 01-.648 1.495l-.658.438A4.522 4.522 0 007.286 9.42l.44-.658a1.5 1.5 0 011.494-.648l.837.14a1.5 1.5 0 011.001 2.311l-.138.207a.5.5 0 01-.42.229h-1A5.5 5.5 0 014 5.5v-1a.5.5 0 01.23-.42z" fill="currentColor"></path></svg>
        <svg v-if="icons && sn.name==='linkedin'" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.5A1.5 1.5 0 011.5 0h12A1.5 1.5 0 0115 1.5v12a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 010 13.5v-12zM5 5H4V4h1v1zm-1 6V6h1v5H4zm4.5-4A1.5 1.5 0 007 8.5V11H6V6h1v.5a2.5 2.5 0 014 2V11h-1V8.5A1.5 1.5 0 008.5 7z" fill="currentColor"></path></svg>
        <svg v-if="icons && sn.name==='email'" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M.5 2.5A1.5 1.5 0 012 1h12a1.5 1.5 0 011.5 1.5v1.208L8 7.926.5 3.708V2.5z" fill="currentColor"></path><path d="M.5 4.855V12.5A1.5 1.5 0 002 14h12a1.5 1.5 0 001.5-1.5V4.855L8 9.074.5 4.854z" fill="currentColor"></path></svg>
        {{ sn.label }}</a>
    </li>
  </ul>
</template>
<script>
export default {
  props: ['socials', 'icons'],
  data() {

    const url = window.location.href;
    const urlEncoded = encodeURIComponent(window.location.href);

    const treatments = {
      twitter: {
        label: 'Twitter',
        url(sn) {
          return `https://twitter.com/intent/tweet/?text=${encodeURIComponent(sn.tweet)}&url=${urlEncoded}`;
        },
      },
      facebook: {
        label: 'Facebook',
        url(sn) {
          return `https://facebook.com/sharer/sharer.php?u=${urlEncoded}`;
        },
      },
      whatsapp: {
        label: 'WhatsApp',
        url(sn) {
          return `whatsapp://send?text=${encodeURIComponent(sn.whatsappText + ' ' + url)}`;
        },
      },
      email: {
        label: 'Email',
        url(sn) {
          return `mailto:?subject=${encodeURIComponent(sn.subject)}&body=${urlEncoded}`;
        },
      },
      linkedin: {
        label: 'Linked In',
        url(sn) {
          return `https://www.linkedin.com/shareArticle?mini=true&url=${urlEncoded}&title=${encodeURIComponent(sn.linkedInText)}&summary=${encodeURIComponent(sn.linkedInText)}&amp;source=${urlEncoded}`;
        },
      },
    };

    const buttons = this.socials.map(sn => {

      const s = {name: sn.name};
      if (!(sn.name in treatments)) {
        console.warn(`${sn.name} not found in treatments:`, treatments);
        return;
      }
      s.url = treatments[sn.name].url(sn);
      s.label = treatments[sn.name].label;
      return s;
    });

    console.log("data returning ", {buttons});
    return {buttons};
  }
}
</script>
<style lang="scss">
ul.inlay-socials {
  list-style: none;
  margin: 0 -1rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  &>li {
    margin: 1rem 0;
    padding: 0 1rem;
    flex: 1 0 auto;
    list-style: none;

    &>a, &>a:hover, &>a:visited, &>a:active {
      text-decoration: none;
      border-radius: 4px;
      display: block;
      padding: 0.5rem 1rem;
      height: 100%;
      color: black;
      text-align: center;
    }
    &>a {
      background-color: #e8e8e8;
    }
    &>a:hover, &>a:active {
      background-color: #e0e0e0;
    }

    svg {
      vertical-align: baseline;
    }
  }

}
</style>
