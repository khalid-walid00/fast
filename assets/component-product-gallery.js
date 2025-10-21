export default {
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },

    // ✅ إعدادات السلايدر يتم تمريرها من الخارج
    slidesPerView: {
      type: Number,
      default: 3,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    spaceBetween: {
      type: Number,
      default: 10,
    },
    autoplayDelay: {
      type: Number,
      default: 0, // 0 = بدون تشغيل تلقائي
    },
    speed: {
      type: Number,
      default: 400,
    },
  },

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
    this.initZoomEffect();
  },

  updated() {
    this.initZoomEffect();
  },

  beforeDestroy() {
    this.destroyThumbsSwiper();
  },

  methods: {
    // ---- تهيئة السلايدر ----
    initThumbsSwiper() {
      if (typeof window === "undefined" || !window.Swiper) return;

      // لو موجود سوايبر بالفعل، متعملش إعادة تهيئة
      if (this.thumbsSwiper) return;

      this.$nextTick(() => {
        const config = {
          slidesPerView: this.slidesPerView,
          spaceBetween: this.spaceBetween,
          loop: this.loop,
          speed: this.speed,
          navigation: {
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
          },
          watchSlidesProgress: true,
          slideToClickedSlide: true,
          breakpoints: {
            300: { spaceBetween: this.spaceBetween - 2 },
            768: { spaceBetween: this.spaceBetween },
            1024: { spaceBetween: this.spaceBetween },
          },
        };

        if (this.autoplayDelay > 0) {
          config.autoplay = {
            delay: this.autoplayDelay,
            disableOnInteraction: false,
          };
        }

        this.thumbsSwiper = new window.Swiper(".thumbs-swiper", config);
      });
    },

    destroyThumbsSwiper() {
      if (this.thumbsSwiper && this.thumbsSwiper.destroy) {
        this.thumbsSwiper.destroy(true, true);
      }
      this.thumbsSwiper = null;
    },

    // ---- تأثير الزووم ----
    initZoomEffect() {
      this.$nextTick(() => {
        const imageZoom = document.getElementById("imageZoom");
        if (!imageZoom) return;

        const img = imageZoom.querySelector("img");
        if (!img) return;

        const handleMove = (event) => {
          imageZoom.style.setProperty("--display", "block");
          const x = (event.offsetX * 100) / imageZoom.offsetWidth;
          const y = (event.offsetY * 100) / imageZoom.offsetHeight;
          imageZoom.style.setProperty("--zoom-x", x + "%");
          imageZoom.style.setProperty("--zoom-y", y + "%");
        };

        const handleOut = () => {
          imageZoom.style.setProperty("--display", "none");
        };

        imageZoom.addEventListener("mousemove", handleMove);
        imageZoom.addEventListener("mouseout", handleOut);
      });
    },
  },
  template: `
    <div class="flex flex-col lg:sticky top-0">
      <!-- الصورة الرئيسية -->
      <div 
        id="imageZoom"
        class="relative cursor-zoom-in w-full bg-gray-200 rounded-xl overflow-hidden shadow-sm"
        style="--zoom-x: 0%; --zoom-y: 0%; --display: none;"
        :style="{'--url': 'url(' + mainImage + ')'}"
      >
        <img
          :src="mainImage"
          alt="صورة المنتج"
          class="w-full aspect-square h-full max-h-[373px] object-cover"
        />
      </div>

      <!-- المصغرات -->
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

        <!-- الأسهم -->
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
