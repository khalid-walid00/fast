import productLogic from "./product.js";
import { showToast, storeGateRequest } from "./helper.js";
import { productSchema } from "./product.schema.js";

export default {
  name: "component-product-details",
  emits: ["update:quantity"],
  mixins: [productLogic],
  data() {
    return {
      currentProduct: __qumra__?.context?.product || {},
      selectedOptions: {},
    };
  },
  computed: {
    allOptionsSelected() {
      if (!this.currentProduct?.options?.length) return true;
      return this.currentProduct.options.every(
        (opt) => Boolean(this.selectedOptions[opt._id])
      );
    },
    addToCartTooltip() {
      if ((this.currentProduct.options?.length ?? 0) > 0 &&
        Object.keys(this.selectedOptions).length < this.currentProduct.options.length) {
        return 'يرجى اختيار كل الخيارات';
      } else if (this.loading.addToCart) {
        return 'جاري إضافة المنتج...';
      } else if (this.productQuantity == 0) {
        return 'لا توجد كمية متاحة';
      }
      return '';
    },
    buyNowTooltip() {
      if ((this.currentProduct.options?.length ?? 0) > 0 &&
        Object.keys(this.selectedOptions).length < this.currentProduct.options.length) {
        return 'يرجى اختيار كل الخيارات';
      } else if (this.loading.buyNow) {
        return 'جاري المعالجة...';
      } else if (this.productQuantity == 0) {
        return 'لا توجد كمية متاحة';
      }
      return '';
    },
    quantityTooltip() {
      if ((this.currentProduct.options?.length ?? 0) > 0 &&
        Object.keys(this.selectedOptions).length < this.currentProduct.options.length) {
        return 'اختر الخيارات';
      }
      if (this.allOptionsSelected && this.productQuantity == 0) {
        return 'لا يوجد كمية';
      }
      return '';
    }
  },
  mounted() {
    console.log('Product Data (from global context):', this.currentProduct);
    if (this.currentProduct?.options?.length > 0) {
      const allSelected = this.currentProduct.options.every(
        (opt) => Boolean(this.selectedOptions[opt._id])
      );
      if (!allSelected) {
        showToast("يرجى تحديد الخيارات", "success");
      }
    }
  },
  methods: {
    selectOption(valueId, optionGroupId) {
      this.selectedOptions[optionGroupId] = valueId;

      if (this.currentProduct?.options?.length &&
        Object.keys(this.selectedOptions).length === this.currentProduct.options.length) {
        this.variantByOptions(this.currentProduct);
      }
    },

    isOptionSelected(valueId, optionGroupId) {
      return this.selectedOptions[optionGroupId] === valueId;
    },

    submitForm(e) {
      const form = e.target;
      const formData = new FormData(form);
      const productId = this.currentProduct._id;
      const quantity = +formData.get("quantity");
      const btn = e.submitter;
      const optionsArray = Object.values(this.selectedOptions).filter(id => id);

      if (btn?.name === "addToCart") {
        this.addProductToCart(productId, quantity, optionsArray);
      } else if (btn?.name === "buyNow") {
        this.buyNowProduct({
          data: { productId, quantity, options: optionsArray },
        });
      }
    },

    variantByOptions(prod) {
      if (!prod?.options?.length) return;

      const allSelected = prod.options.every(
        (opt) => Boolean(this.selectedOptions[opt._id])
      );
      if (!allSelected) return;

      const selectedOptionValues = prod.options.map(
        (opt) => this.selectedOptions[opt._id]
      );

      const input = { options: selectedOptionValues };
      this.loading.optionsLoading = true;

      storeGateRequest(productSchema.variantByOptions, { input })
        .then((res) => {
          if (res?.variantByOptions?.success) {
            this.currentProduct.pricing = res.variantByOptions.data.pricing;
            this.currentProduct.quantity = res.variantByOptions.data.quantity;
            this.productQuantity = 1;
            showToast("تم تحديث السعر والكمية بنجاح", "success");
          }
        })
        .finally(() => {
          this.loading.optionsLoading = false;
        });
    }
  },
  template: `
  <form class="flex flex-col gap-8" @submit.prevent="submitForm" id="productForm">
    <div class="flex flex-col justify-center space-y-5">
      <!-- Rating -->
      <div class="flex items-center space-x-1 space-x-reverse">
        <div class="flex text-yellow-400 rating-stars">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined !text-xl" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <span class="text-gray-500 text-sm font-medium">6 تقييمات</span>
      </div>

      <!-- Title & Price -->
      <slot name="title"></slot>
     <div class="flex items-baseline space-x-3 space-x-reverse">
     
     <template v-if="allOptionsSelected">
     <div class="flex  items-center gap-0.5">
                    <span
                        v-text="currentProduct?.pricing?.price"
                        class="text-3xl font-bold text-primary"></span>
                    <span class="text-3xl font-bold text-primary">EGP</span>
                </div>
     <div v-show="currentProduct?.pricing?.compareAtPrice" class="flex line-through  items-center gap-0.5">
                    <span
                        v-text="currentProduct?.pricing?.compareAtPrice"
                        class="text-lg text-gray-400"></span>
                    <span class="text-lg text-gray-400">EGP</span>
                </div>
                </div>
      </template>
      
      <!-- Show message when options exist but not all are selected -->
      <div  v-if="currentProduct?.options?.length > 0 && !allOptionsSelected " class="flex items-center gap-0.5">
        <span class="text-lg text-orange-500 font-medium">يرجى اختيار جميع الخيارات</span>
      </div>
      <!-- Description -->
      <slot name="description"></slot>

      <div class="border-t border-gray-200 pt-5 space-y-5">
        <template v-for="opt in currentProduct?.options" :key="opt._id">
          <div>
            <h3 class="text-base font-semibold text-gray-800 mb-3">{{ opt.name }}</h3>
            <div class="flex items-center space-x-3 space-x-reverse">
              <button
                v-for="val in opt.values" :key="val._id"
                @click.prevent="selectOption(val._id, opt._id)"
                :class="['size-button px-5 py-2 rounded-none border', isOptionSelected(val._id, opt._id) ? 'bg-gray-200' : 'bg-white']"
              >
                {{ val.label }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <component-tooltip :content="addToCartTooltip">
          <button type="button"
                  @click="addProductToCart(currentProduct._id, productQuantity, Object.values(selectedOptions).filter(id => id))"
                  :disabled="!allOptionsSelected || productQuantity == 0 || loading.addToCart"
                  class="w-full flex-1 bg-primary text-white font-bold py-3.5 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <component-loading v-if="loading.addToCart"></component-loading>
                <div v-else class=" flex items-center justify-center gap-2 "> 
                <span class="material-symbols-outlined">shopping_cart</span>
                <span >إضافة للسلة</span>
                </div>
          </button>
        </component-tooltip>

        <div class="flex items-center border border-gray-300 rounded-lg">
          <component-tooltip :content="quantityTooltip">
            <button type="button" 
                    @click="decreaseProductItem" 
                    :disabled="!allOptionsSelected"
                    class="px-4 py-3 material-symbols-outlined disabled:opacity-50 disabled:cursor-not-allowed">remove</button>
          </component-tooltip>

          <component-tooltip :content="quantityTooltip">
            <input type="text" 
              id="quantity-inputs"
              :value="productQuantity" 
              class="w-12 text-center" 
              readonly>
          </component-tooltip>

          <component-tooltip :content="quantityTooltip">
            <button type="button" 
                    @click="increaseProductItem" 
                    :disabled="!allOptionsSelected"
                    class="px-4 py-3 material-symbols-outlined disabled:opacity-50 disabled:cursor-not-allowed">add</button>
          </component-tooltip>
        </div>
      </div>

      <component-tooltip :content="buyNowTooltip">
        <button type="submit"
          name="buyNow"
          value="buyNow"
          :disabled="!allOptionsSelected || productQuantity == 0 || loading.buyNow"
          class="w-full main-brand-color-border border-2 main-brand-color-text font-bold py-3.5 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
    <component-loading v-if="loading.buyNow"></component-loading>
           <span v-else>إشتري الآن</span>
        </button>
      </component-tooltip>

    </div>
  </form>
  `
};
