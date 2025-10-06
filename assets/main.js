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
