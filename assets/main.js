import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import cart from "./cart.js";
import product from "./product.js";
import { showToast } from "./helper.js";

import { registerComponents } from "./components-register.js";

console.log("✅ main.js loaded");

const app = createApp({
  delimiters: ["[[", "]]"],
  data() {
    return {
      ...__qumra__,
      product: __qumra__?.context?.product ?? null,
      productQuantity: 1,
      selectedOptions: {},
      currentLanguage: this.getCurrentLanguage(),
      spinnerVisible: true,
      message: "مرحباً بك في متجرنا!",
      search: __qumra__?.context?.query?.q ?? "",
      globalLoading: {
        page: false,
        cart: false,
        checkout: false,
        addToCart: false,
        buyNow: false,
      },
      modal: { open: false, type: "" },
    };
  },
  methods: {
    getCurrentLanguage() {
      const pathParts = window.location.pathname.split('/');
      const lang = pathParts[1];
      if (lang === 'ar' || lang === 'en') {
        return lang;
      }
      return 'ar';
    },
    handleRedirect(url) {
      if(url?.startsWith('/')){
        return `/${this.currentLanguage}${url}`
      } else {
        return `/${this.currentLanguage}/${url}`
      }
    },
    switchLang(newLang) {
      if (this.currentLanguage === newLang) {
        showToast(`اللغة ${newLang === 'ar' ? 'العربية' : 'English'} مفعلة بالفعل`);
        return;
      }

      const pathParts = window.location.pathname.split('/');
      if (pathParts[1] === 'ar' || pathParts[1] === 'en') {
        pathParts[1] = newLang; 
      } else {
        pathParts.splice(1, 0, newLang);
      }
      window.location.pathname = pathParts.join('/');
      this.currentLanguage = newLang;
      showToast(`تم تغيير اللغة إلى ${newLang === 'ar' ? 'العربية' : 'English'}`);
    },
    updateLoading(type, value) {
      this.globalLoading[type] = value;
    },
    handleAddToCart(productId, quantity) {
      console.log("Add to cart:", productId, quantity);
      showToast(`تمت إضافة المنتج (${productId}) بعدد ${quantity}`);
    },
    handleBuyNow(productId, quantity) {
      console.log("Buy now:", productId, quantity);
      showToast(`شراء مباشر: ${productId} بعدد ${quantity}`);
    },
    updateCartItem(id, item) {
      const found = this.globals?.cart?.items?.find(i => i._id === id);
      if (found) Object.assign(found, item);
    },
    updateCart(data) {
      this.globals.cart = data;
    },
    setSearch(q) {
      this.globalLoading.page = true;
      this.search = q;
      window.location.href = `/search?q=${encodeURIComponent(q)}`
    },
    toggleModal(type, open) {
      this.modal.open = open !== undefined ? open : !this.modal.open;
      this.modal.type = type;
    },
    login() {
      window.qumra?.login?.();
    },
    logout() {
      window.qumra?.logout?.();
    },
    ensureLanguageInUrl() {
      const pathParts = window.location.pathname.split('/');
      const currentLang = pathParts[1];
      if (currentLang !== 'ar' && currentLang !== 'en') {
        const newPath = `/${this.currentLanguage}${window.location.pathname}`;
        const newUrl = newPath + window.location.search + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    },
  },
  mounted() {
    this.spinnerVisible = false;
    this.currentLanguage = this.getCurrentLanguage();
    this.ensureLanguageInUrl();
    
    console.log("Mounted ✅ binding methods to window");

    Object.keys(this.$options.methods).forEach((key) => {
      if (typeof this[key] === "function") {
        window[key] = this[key].bind(this);
        globalThis[key] = window[key];
      }
    });

    // Make showToast available globally
    window.showToast = showToast;
    globalThis.showToast = showToast;

    window.globalLoading = this.globalLoading;
    window.globals = this.globals;
  },
});

app.mixin(cart);
app.mixin(product);
registerComponents(app)

console.log("Registered components:", app._context.components);

app.mount("#app");
console.log("✅ App mounted executed");

