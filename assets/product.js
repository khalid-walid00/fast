import { storeGateRequest, showToast } from "./helper.js";
import { productSchema } from "./product.schema.js";

export default {
  data() {
    return {
      productQuantity: 1,
      product: null, 
      loading: {
        checkout: false,
        priceAtCall: false,
        priceAtCallWhatsApp: false,
        addToCart: false,
        buyNow: false,
        optionsLoading: false,
      },
      selectedOptions: {},
      resolvedPrice: {},
    };
  },

  computed: {
    areOptionsSelected() {
      const product = this.product;
      if (product?.options?.length) {
        return product.options.every(
          (opt) => Boolean(this.selectedOptions[opt._id])
        );
      }
      return true;
    },

    isOutOfStock() {
      const product = this.product;
      if (product?.options?.length > 0 && this.areOptionsSelected) {
        const selectedOptionValues = product.options.map(
          (opt) => this.selectedOptions[opt._id]
        );

        const matchingVariant = product.variants?.find((variant) => {
          if (!variant.options || variant.options.length !== selectedOptionValues.length) {
            return false;
          }
          return variant.options.every(
            (variantOption, index) =>
              variantOption._id === selectedOptionValues[index]
          );
        });

        if (matchingVariant && matchingVariant.quantity !== undefined) {
          return matchingVariant.quantity === 0;
        }
      }
      return product?.quantity === 0;
    },
  },

  methods: {
    updateLoading(key, val) {
      if (key in this.loading) this.loading[key] = val;
    },
    addProductToCart(productId, quantity, options = []) {
      if (this.isOutOfStock) {
        showToast("لا توفر كمية في المخزون", "error");
        return;
      }
      this.updateLoading("addToCart", true);
    
      this.loading = { ...this.loading, [productId]: true }; 
      storeGateRequest(productSchema.addToCart, { data: { productId, quantity, options } })
        .then((res) => {
          if (res?.addToCart?.success) {
            window.updateCart?.(res.addToCart.data);
            showToast("تمت إضافة المنتج للسلة", "success");
          } else {
            showToast(res?.addToCart?.message || "فشل الإضافة", "error");
          }
        })
        .catch(() => showToast("حدث خطأ أثناء الإضافة", "error"))
        .finally(() => {
          this.loading = { ...this.loading, [productId]: false };
          this.updateLoading("addToCart", false);
        });
    }
    
    ,    

    buyNowProduct(payload) {
      if (this.isOutOfStock) {
        showToast("لا توفر كمية في المخزون", "error");
        return;
      }

      this.updateLoading("buyNow", true);

      storeGateRequest(productSchema.buyNow, payload)
        .then((res) => {
          if (res?.buyNow?.success && res?.buyNow?.url) {
            showToast("جارٍ تحويلك لصفحة الدفع...", "success", 2000);
            window.location.href = res.buyNow.url;
          } else {
            showToast(res?.buyNow?.message || "فشل عملية الشراء", "error");
          }
        })
        .catch(() => showToast("حدث خطأ أثناء عملية الشراء", "error"))
        .finally(() => this.updateLoading("buyNow", false));
    },

    decreaseProductItem() {
      const minQuantity = this.product?.minQuantity || 1;
      if (this.productQuantity <= minQuantity) {
        showToast(`الحد الأدنى ${minQuantity}`, "error");
        return;
      }
      this.productQuantity -= 1;
    },

    increaseProductItem() {
      if (this.isOutOfStock) {
        showToast("الكمية المطلوبة غير متاحة حاليًا. يُرجى تقليل العدد أو اختيار منتج مشابه", "error");
        return;
      }

      let maxQuantity = this.product?.quantity || 999;

      if (this.product?.options?.length > 0 && this.areOptionsSelected) {
        const selectedOptionValues = this.product.options.map(
          (opt) => this.selectedOptions[opt._id]
        );

        const matchingVariant = this.product.variants?.find((variant) =>
          variant.options.every(
            (variantOption, index) =>
              variantOption._id === selectedOptionValues[index]
          )
        );

        if (matchingVariant?.quantity !== undefined) {
          maxQuantity = matchingVariant.quantity;
        }
      }

      if (this.productQuantity >= maxQuantity) {
        showToast("الكمية المطلوبة غير متاحة حاليًا. يُرجى تقليل العدد أو اختيار منتج مشابه", "error");
        return;
      }

      this.productQuantity += 1;
    },

    productCheckout() {
      this.loading.checkout = true;
      window.Qumra?.order
        ?.checkout()
        .then((res) => {
          if (res?.url) {
            showToast("جارٍ تحويلك لصفحة الدفع...", "success", 2000);
            window.location.href = res.url;
          } else {
            showToast("تعذر بدء الدفع", "error");
          }
        })
        .catch(() => showToast("حدث خطأ أثناء الدفع", "error"))
        .finally(() => (this.loading.checkout = false));
    },
   
  },
};
