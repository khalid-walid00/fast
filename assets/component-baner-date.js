export default {
  name: "component-baner-date",
  props: {
    days: {
      type: Number,
      default: 5,
    },
    translations: {
      type: Object,
      default: () => ({
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
      }),
    },
  },
  data() {
    return {
      remainingTime: {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      timer: null,
      storageKey: "banner-offer",
    };
  },
  mounted() {
    this.startCountdown();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    startCountdown() {
      let savedEndDate = localStorage.getItem(this.storageKey);
      let endDate;

      if (savedEndDate) {
        endDate = new Date(savedEndDate);
      } else {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + this.days);
        localStorage.setItem(this.storageKey, endDate.toISOString());
      }

      this.timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance <= 0) {
          clearInterval(this.timer);
          localStorage.removeItem(this.storageKey); // 🧹 نظف بعد انتهاء العد
          this.remainingTime = {
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00",
          };
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.remainingTime = {
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        };
      }, 1000);
    },
  },
  template: `
   <div class="flex items-end count-row gap-1 w-max">
      <div class="flex flex-col gap-1 items-center">
        <div class="md:w-[100px] md:h-[100px] w-10 h-10 flex justify-center items-center bg-white rounded-lg">
          <span class="text-primary font-normal md:text-[42px] text-2xl">{{ remainingTime.days }}</span>
        </div>
        <span class="font-medium md:text-base text-[10px]">{{ translations.days }}</span>
      </div>
      <div class="flex flex-col gap-1 items-center">
        <div class="md:w-[100px] md:h-[100px] w-10 h-10 flex justify-center items-center bg-white rounded-lg">
          <span class="text-primary font-normal md:text-[42px] text-2xl">{{ remainingTime.hours }}</span>
        </div>
        <span class="font-medium md:text-base text-[10px]">{{ translations.hours }}</span>
      </div>
      <div class="flex flex-col gap-1 items-center">
        <div class="md:w-[100px] md:h-[100px] w-10 h-10 flex justify-center items-center bg-white rounded-lg">
          <span class="text-primary font-normal md:text-[42px] text-2xl">{{ remainingTime.minutes }}</span>
        </div>
        <span class="font-medium md:text-base text-[10px]">{{ translations.minutes }}</span>
      </div>
      <div class="flex flex-col gap-1 items-center">
        <div class="md:w-[100px] md:h-[100px] w-10 h-10 flex justify-center items-center bg-white rounded-lg">
          <span class="text-primary font-normal md:text-[42px] text-2xl">{{ remainingTime.seconds }}</span>
        </div>
        <span class="font-medium md:text-base text-[10px]">{{ translations.seconds }}</span>
      </div>
    </div>
  `,
};
