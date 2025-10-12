export default {
  props: ["images"],
  data() {
    return {
      selectedIndex: 0,
      thumbsSwiper: null,
    };
  },
  computed: {
    mainImage() {
      return (
        this.images?.[this.selectedIndex]?.fileUrl ||
        "https://placehold.co/800x800/f0e5d9/333333?text=No+Image"
      );
    },
  },
  mounted() {
    this.initThumbsSwiper();
    this.initZoomEffect(); // ✅ تفعيل الزووم بعد تركيب العنصر
  },
  updated() {
    this.initZoomEffect(); // ✅ إعادة تفعيل الزووم عند تغيير الصورة
  },
  beforeDestroy() {
    this.destroyThumbsSwiper();
  },
  methods: {
    // ---- تهيئة السلايدر ----
    initThumbsSwiper() {
      if (typeof window === "undefined" || !window.Swiper) return;

      if (this.thumbsSwiper) return;

      this.$nextTick(() => {
        this.thumbsSwiper = new window.Swiper(".thumbs-swiper", {
          slidesPerView: 3,
          navigation: {
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
          },
          spaceBetween: 10,
          loop: true,
          breakpoints: {
            300: { spaceBetween: 8 },
            768: { spaceBetween: 11 },
            1024: { spaceBetween: 11 },
          },
        });
      });
    },

    destroyThumbsSwiper() {
      if (this.thumbsSwiper && this.thumbsSwiper.destroy) {
        this.thumbsSwiper.destroy(true, true);
      }
      this.thumbsSwiper = null;
    },

    initZoomEffect() {
      this.$nextTick(() => {
        const imageZoom = document.getElementById("imageZoom");
        if (!imageZoom) return;

        const img = imageZoom.querySelector("img");
        if (!img) return;

        imageZoom.addEventListener("mousemove", (event) => {
          imageZoom.style.setProperty("--display", "block");
          const x = (event.offsetX * 100) / imageZoom.offsetWidth;
          const y = (event.offsetY * 100) / imageZoom.offsetHeight;
          imageZoom.style.setProperty("--zoom-x", x + "%");
          imageZoom.style.setProperty("--zoom-y", y + "%");
        });

        imageZoom.addEventListener("mouseout", () => {
          imageZoom.style.setProperty("--display", "none");
        });
      });
    },
  },
  template: `
    <div class="flex flex-col">
      <!-- Main Image + Zoom -->
      <div 
        id="imageZoom"
        class="relative cursor-zoom-in w-full bg-gray-200 rounded-xl overflow-hidden shadow-sm"
        style="
          --zoom-x: 0%; 
          --zoom-y: 0%; 
          --display: none;
        "
        :style="{'--url': 'url(' + mainImage + ')'}"
      >
        <img
          :src="mainImage"
          alt="صورة المنتج"
          class="w-full aspect-square h-full max-h-[373px] object-cover"
        />
      </div>

      <!-- Thumbs Swiper -->
      <div class="relative md:mt-4 mt-5">
        <div class="thumbs-swiper swiper px-8">
          <div class="swiper-wrapper">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="swiper-slide cursor-pointer p-1"
              @click="selectedIndex = index"
            >
              <img
                :src="image.fileUrl"
                alt="صورة مصغرة"
                class="w-full min-w-[84px] h-[100px] md:h-[200px] rounded-lg object-cover border transition-all duration-200"
                :class="{'border-primary': selectedIndex === index, 'border-transparent': selectedIndex !== index}"
              />
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <button class="thumbs-prev bg-gray2 material-symbols-outlined w-6 h-6 text-gray/80 flex items-center justify-center
          text-base absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow">
          arrow_left_alt
        </button>
        <button class="thumbs-next bg-primary material-symbols-outlined w-6 h-6 text-white flex items-center justify-center
          text-base absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow">
          arrow_right_alt
        </button>
      </div>
    </div>
  `,
};
