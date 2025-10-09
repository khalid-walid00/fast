import { nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
export default {
  name: "component-tooltip",
  props: ['content', 'type'],
  mounted() {
    nextTick(() => {
      if (this.$el && this.content && this.content.trim() !== '') {
        this.instance = tippy(this.$el, { content: this.content, theme: this.type || 'light-border' });
      }
    });
  },
  watch: {
    content(newVal) {
      if (!this.instance && newVal && newVal.trim() !== '') {
        this.instance = tippy(this.$el, { content: newVal, theme: this.type || 'light-border' });
      } else if (this.instance) {
        if (newVal && newVal.trim() !== '') {
          this.instance.setContent(newVal); 
        } else {
          this.instance.destroy();
          this.instance = null;
        }
      }
    }
  },
  template: `<div class="flex-1"><slot></slot></div>`
};