// import { productSchema } from "./product.schema";
// import { storeGateRequest } from "./helpers.js";

// export default {
//   data() {
//     return {
//       productQuantity: 1,
//       product: null,
//       loading: {
//         checkout: false,
//         priceAtCall: false,
//         priceAtCallWhatsApp: false,
//         addToCart: false,
//         buyNow: false,
//         optionsLoading: false,
//       },
//       selectedOptions: {},
//       resolvedPrice: {},
//     };
//   },
//   computed: {
//     areOptionsSelected() {
//       const product = this.product;
//       if (product?.options?.length) {
//         return product.options.every(
//           (opt) => Boolean(this.selectedOptions[opt._id])
//         );
//       }
//       return true;
//     },
//     isOutOfStock() {
//       const product = this.product;
//       if (product?.options?.length > 0 && this.areOptionsSelected) {
//         const selectedOptionValues = product.options.map(
//           (opt) => this.selectedOptions[opt._id]
//         );
//         const matchingVariant = product.variants?.find((variant) => {
//           if (!variant.options || variant.options.length !== selectedOptionValues.length) {
//             return false;
//           }
//           return variant.options.every(
//             (variantOption, index) => variantOption._id === selectedOptionValues[index]
//           );
//         });
//         if (matchingVariant && matchingVariant.quantity !== undefined) {
//           return matchingVariant.quantity === 0;
//         }
//       }
//       return product?.quantity === 0;
//     },
//   },
//   methods: {
//     updateLoading(key, val) {
//       if (key in this.loading) this.loading[key] = val;
//     },

//     variantByOptions(prod) {
//       if (!prod?.options?.length) return;
//       const allSelected = prod.options.every(
//         (opt) => Boolean(this.selectedOptions[opt._id])
//       );
//       if (!allSelected) return;

//       const selectedOptionValues = prod.options.map(
//         (opt) => this.selectedOptions[opt._id]
//       );
//       const input = { options: selectedOptionValues };

//       storeGateRequest(productSchema.variantByOptions, { input })
//         .then((res) => {
//           if (res?.variantByOptions?.success) {
//             this.loading.optionsLoading = false;
//             this.resolvedPrice = res.variantByOptions.data.pricing;
//             this.product.quantity = res.variantByOptions.data.quantity;
//             this.productQuantity = 1;
//             showToast("تم تحديث السعر بنجاح", "success");
//           }
//         })
//         .finally(() => {
//           this.loading.priceAtCall = false;
//         });
//     },

//     initOptions() {
//       if (!this.product?.options?.length) return;
//       showToast("يرجى تحديد الخيارات", "success");
//     },

//     selectOption(prod, optionId, valueId) {
//       this.selectedOptions[optionId] = valueId;
//       this.loading.optionsLoading = true;
//       setTimeout(() => {
//         if (this.loading.optionsLoading) this.loading.optionsLoading = false;
//       }, 10000);

//       if (prod?.options?.length > 0) {
//         const allSelected = prod.options.every(
//           (opt) => Boolean(this.selectedOptions[opt._id])
//         );
//         if (allSelected) {
//           if (prod.variants?.length > 0) {
//             this.variantByOptions(prod);
//           } else {
//             this.loading.optionsLoading = false;
//           }
//         } else {
//           this.loading.optionsLoading = false;
//         }
//       } else {
//         this.loading.optionsLoading = false;
//       }
//     },

//     addProductToCart(productId, quantity, options = []) {
//       if (this.isOutOfStock) {
//         showToast("لا توفر كمية في المخزون", "error");
//         return;
//       }
//       this.updateLoading("addToCart", true);

//       storeGateRequest(productSchema.addToCart, { data: { productId, quantity, options } })
//         .then((res) => {
//           if (res?.addToCart?.success) {
//             window.updateCart?.(res.addToCart.data); // لاحقًا ممكن نبدله بـ bus
//             this.toggleProductModal?.("productDetails", false);
//             showToast("تمت إضافة المنتج للسلة", "success");
//           } else {
//             showToast(res?.addToCart?.message || "فشل الإضافة", "error");
//           }
//         })
//         .catch(() => showToast("حدث خطأ أثناء الإضافة", "error"))
//         .finally(() => this.updateLoading("addToCart", false));
//     },

//     buyNowProduct(payload) {
//       if (this.isOutOfStock) {
//         showToast("لا توفر كمية في المخزون", "error");
//         return;
//       }
//       this.updateLoading("buyNow", true);

//       storeGateRequest(productSchema.buyNow, payload)
//         .then((res) => {
//           if (res?.buyNow?.success && res?.buyNow?.url) {
//             showToast("جارٍ تحويلك لصفحة الدفع...", "success", 2000);
//             window.location.href = res.buyNow.url;
//           } else {
//             showToast(res?.buyNow?.message || "فشل عملية الشراء", "error");
//           }
//         })
//         .catch(() => showToast("حدث خطأ أثناء عملية الشراء", "error"))
//         .finally(() => this.updateLoading("buyNow", false));
//     },

//     decreaseCartItem() {
//       const minQuantity = this.product?.minQuantity || 1;
//       if (this.productQuantity <= minQuantity) {
//         showToast(`الحد الأدنى ${minQuantity}`, "error");
//         return;
//       }
//       this.productQuantity -= 1;
//     },

//     increaseCartItem() {
//       if (this.isOutOfStock) {
//         showToast("لا توفر كمية في المخزون", "error");
//         return;
//       }

//       let maxQuantity = this.product?.quantity || 999;

//       if (this.product?.options?.length > 0 && this.areOptionsSelected) {
//         const selectedOptionValues = this.product.options.map(
//           (opt) => this.selectedOptions[opt._id]
//         );
//         const matchingVariant = this.product.variants?.find((variant) =>
//           variant.options.every(
//             (variantOption, index) =>
//               variantOption._id === selectedOptionValues[index]
//           )
//         );
//         if (matchingVariant?.quantity !== undefined) {
//           maxQuantity = matchingVariant.quantity;
//         }
//       }

//       if (this.productQuantity >= maxQuantity) {
//         showToast("لا تتوفر كمية أكثر", "error");
//         return;
//       }

//       this.productQuantity += 1;
//     },

//     checkout() {
//       this.loading.checkout = true;
//       window.Qumra?.order
//         ?.checkout()
//         .then((res) => {
//           if (res?.url) {
//             showToast("جارٍ تحويلك لصفحة الدفع...", "success", 2000);
//             window.location.href = res.url;
//           } else {
//             showToast("تعذر بدء الدفع", "error");
//           }
//         })
//         .catch(() => showToast("حدث خطأ أثناء الدفع", "error"))
//         .finally(() => (this.loading.checkout = false));
//     },
//   },
// };
