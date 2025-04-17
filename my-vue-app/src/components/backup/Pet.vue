<template>
  <div id="pet" ref="pet">
    <div v-html="petSvg"></div>
  </div>
</template>

<script>
export default {
  name: 'Pet',
  props: {
    petType: String
  },
  computed: {
    petSvg() {
      if (this.petType === 'bird') {
        return `<svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="55" fill="#cdeffd" stroke="#333" stroke-width="3"/>
              <path d="M40 70 Q60 90 80 70" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/>
              <circle cx="45" cy="55" r="8"/>
              <circle cx="75" cy="55" r="8"/>
            </svg>`;
      } else {
        return `<svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="55" fill="#ffe4e1" stroke="#333" stroke-width="3"/>
              <circle cx="45" cy="50" r="10"/>
              <circle cx="75" cy="50" r="10"/>
              <path d="M45 80 Q60 95 75 80" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>`;
      }
    }
  },
  mounted() {
    const pet = this.$refs.pet;
    let ox, oy;
    pet.onmousedown = (e) => {
      ox = e.offsetX;
      oy = e.offsetY;
      document.onmousemove = (ev) => {
        pet.style.left = (ev.pageX - ox) + 'px';
        pet.style.top = (ev.pageY - oy) + 'px';
      };
      document.onmouseup = () => {
        document.onmousemove = null;
      };
    };
  }
}
</script>
