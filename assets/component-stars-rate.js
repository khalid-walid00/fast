export default {
  name: "component-stars-rate",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    size: { type: [Number, Object], default: 20 },

    readonly: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: "",
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      hoverValue: 0,
    };
  },
  computed: {
    currentValue() {
      return this.hoverValue || this.modelValue;
    },
    starSize() {
      if (typeof this.size === 'object') {
        if (window.innerWidth < 640) return this.size.sm || 14;
        if (window.innerWidth < 1024) return this.size.md || 18;
        return this.size.lg || 24;
      }
      return this.size || 14; 
    },
  },
  methods: {
    setRating(value) {
      if (this.readonly) return;
      this.$emit("update:modelValue", value);
    },
    setHover(value) {
      if (this.readonly) return;
      this.hoverValue = value;
    },
    clearHover() {
      if (this.readonly) return;
      this.hoverValue = 0;
    },
  },
  template: `
    <div class="flex py-1 gap-[5px] items-center  select-none">
   <svg
  v-for="n in 5"
  :key="n"
  :width="starSize"
  :height="starSize * 1.14"
  viewBox="0 0 14 16"
  xmlns="http://www.w3.org/2000/svg"
  class="cursor-pointer transition-colors duration-200 hover:scale-105 active:scale-95"
  :fill="n <= currentValue ? '#FFC700' : '#E6E6E6'"
  @click="setRating(n)"
  @mouseenter="setHover(n)"
  @mouseleave="clearHover"
>

        <path d="M7.33948 0.273003L9.12936 5.28752L13.6718 5.77394C13.7436 5.78099 13.812 5.81334 13.8684 5.86692C13.9248 5.92049 13.9667 5.9929 13.9889 6.07501C14.0111 6.15712 14.0125 6.24527 13.993 6.32834C13.9735 6.41141 13.9339 6.4857 13.8792 6.54183L10.4407 10.1353L11.4547 15.4641C11.4653 15.5201 11.4666 15.5781 11.4584 15.6346C11.4503 15.6912 11.4329 15.7453 11.4073 15.7938C11.3817 15.8423 11.3483 15.8843 11.3091 15.9173C11.27 15.9502 11.2257 15.9736 11.179 15.9861C11.0823 16.0105 10.9815 15.9879 10.8987 15.9232L6.99655 13.1304L3.08411 15.9369C3.04324 15.9666 2.99786 15.9863 2.9506 15.9949C2.90334 16.0035 2.85513 16.0008 2.80875 15.987C2.76236 15.9732 2.71872 15.9484 2.68033 15.9143C2.64194 15.8801 2.60957 15.8372 2.58509 15.7879C2.56056 15.7397 2.54421 15.6862 2.53698 15.6304C2.52974 15.5746 2.53177 15.5176 2.54293 15.4628L3.55807 10.134L0.124149 6.54183C0.0519698 6.46503 0.00773673 6.35739 0.000922335 6.24195C-0.00589206 6.12652 0.025254 6.01247 0.0876904 5.92424C0.156503 5.83969 0.250108 5.79067 0.348595 5.78761L4.87399 5.30118L6.66386 0.273003C6.69273 0.194414 6.74004 0.127593 6.80002 0.0806799C6.86 0.0337672 6.93006 0.00878906 7.00167 0.00878906C7.07328 0.00878906 7.14334 0.0337672 7.20332 0.0806799C7.2633 0.127593 7.31061 0.194414 7.33948 0.273003Z"/>
      </svg>
    </div>
  `
};
