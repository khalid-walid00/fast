import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
// import cart from "./cart.js";
// import product from "./product.js";
console.log("✅ main.js loaded");

const app = createApp({
	delimiters: ['[[', ']]'],
	data() {
		return {
			...__qumra__,
			spinnerVisible: true,
			message: "مرحباً بك في متجرنا!",
			globals: window.__qumra__ || {},
			search: "",
			globalLoading: {
				page: false,
				cart: false,
				checkout: false,
				addToCart: false,
				buyNow: false,
			},
			modal: {
				open: false,
				type: "",
			},
		};
	},
	methods: {
		updateLoading(type, value) {
			this.globalLoading[type] = value;
		},
		updateCartItem(id, item) {
			const found = this.globals?.cart?.items?.find(i => i._id === id);
			if (found) Object.assign(found, item);
		},
		updateCart(data) {
			this.globals.cart = data;
		},
		showToast(message, type = "success") {
			window.Toastify({
				text: message,
				duration: 3000,
				close: true,
				gravity: "top",
				position: "right",
				style: {
					background: type === "success"
						? "linear-gradient(to right, #00b09b, #96c93d)"
						: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
		},
		setSearch(q) {
			this.globalLoading.page = true;
			this.context.search = q;
			window.location.href = `/search?q=${encodeURIComponent(q)}`;
		},
		toggleModal(type, open) {
			console.log("modal", type, open);
			this.modal.open = open !== undefined ? open : !this.modal.open;
			this.modal.type = type;
		},
		login() {
			window.qumra?.login?.();
		},
		logout() {
			window.qumra?.logout?.();
		}
	},
	mounted() {
		this.spinnerVisible = false;
		console.log("Mounted ✅ binding methods to window");

		window.updateCart = this.updateCart.bind(this);
		window.updateCartItem = this.updateCartItem.bind(this);
		window.updateLoading = this.updateLoading.bind(this);
		window.globalLoading = this.globalLoading;
		window.globals = this.globals;
		window.showToast = this.showToast.bind(this);
		window.setSearch = this.setSearch.bind(this);
		window.toggleModal = this.toggleModal.bind(this);
	}
	// mounted() {
	// 	this.spinnerVisible = false;
	//     console.log("Mounted ✅ binding methods to window");

	// 	Object.keys(this.$options.methods).forEach((key) => {
	// 	  if (typeof this[key] === "function") {
	// 		window[key] = this[key].bind(this);
	// 		globalThis[key] = window[key];
	// 	  }
	// 	});

	// 	window.globalLoading = this.globalLoading;
	// 	window.globals = this.globals;
	//   }

});

// app.mixin(cart);
// app.mixin(product);

app.mount("#app");
console.log("✅ App mounted executed");

(function(){
  const initCountdown = () => {
    const dEl = document.getElementById('dVal2');
    const hEl = document.getElementById('hVal2');
    const mEl = document.getElementById('mVal2');
    const sEl = document.getElementById('sVal2');
    if (!dEl || !hEl || !mEl || !sEl) return;
    const targetDate = new Date(Date.now() + 48 * 60 * 60 * 1000).getTime();
    function update() {
      const now = Date.now();
      let diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (24*60*60*1000));
      diff %= 24*60*60*1000;
      const hours = Math.floor(diff / (60*60*1000));
      diff %= 60*60*1000;
      const mins = Math.floor(diff / (60*1000));
      diff %= 60*1000;
      const secs = Math.floor(diff / 1000);
      dEl.textContent = String(days).padStart(2,'0');
      hEl.textContent = String(hours).padStart(2,'0');
      mEl.textContent = String(mins).padStart(2,'0');
      sEl.textContent = String(secs).padStart(2,'0');
    }
    update();
    setInterval(update, 1000);
  };

  const initSwipers = () => {
    if (!window.Swiper) return false;
    if (document.querySelector('.categories-swiper')) {
      new window.Swiper('.categories-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: { enabled: true, momentumRatio: 0.4 },
        resistanceRatio: 0.8,
      });
    }
    if (document.querySelector('.reviews-swiper')) {
      new window.Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 12,
        navigation: {
          nextEl: '.reviews-swiper .nav-next',
          prevEl: '.reviews-swiper .nav-prev',
        },
      });
    }
    // Best Sellers - mobile swiper
    if (document.querySelector('.best-swiper')) {
      new window.Swiper('.best-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 12,
        pagination: { el: '.best-swiper .swiper-pagination', clickable: true },
        observer: true,
        observeParents: true,
      });
    }
    // Best Sellers Tabs - mobile swiper
    if (document.querySelector('.best-tabs-swiper')) {
      new window.Swiper('.best-tabs-swiper', {
        slidesPerView: 'auto',
        freeMode: { enabled: true },
        spaceBetween: 12,
        resistanceRatio: 0.8,
        observer: true,
        observeParents: true,
      });
    }
    return true;
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    // Retry until Swiper is available (in case CDN loads after DOMContentLoaded)
    let tries = 0;
    const timer = setInterval(() => {
      const ok = initSwipers();
      if (ok || tries++ > 20) clearInterval(timer);
    }, 150);
  });
})();
