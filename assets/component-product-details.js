import productLogic from "./product.js";
import { showToast, storeGateRequest } from "./helper.js";
import { productSchema } from "./product.schema.js";

export default {
  name: "component-product-details",
  emits: ["update:quantity"],
  mixins: [productLogic],
  props: {
    translations: {
      type: Object,
      default: () => ({
        add_to_cart: 'Add to cart',
        buy_now: 'Buy now',
        select_all_options: 'Please select all options',
        no_quantity: 'No quantity available',
        updating: 'Updating...',
        please_select_all_options:'please select all options'
      })
    },
  },
  data() {
    return {
      currentProduct: __qumra__?.context?.product || {},
      currencySymbol: __qumra__?.globals.currency?.currencySymbol || 'EGP',
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
        return this.translations.select_all_options;
      } else if (this.loading.addToCart) {
        return this.translations.updating;
      } else if (this.productQuantity == 0) {
        return this.translations.no_quantity;
      }
      return '';
    },
    buyNowTooltip() {
      if ((this.currentProduct.options?.length ?? 0) > 0 &&
        Object.keys(this.selectedOptions).length < this.currentProduct.options.length) {
        return this.translations.select_all_options;
      } else if (this.loading.buyNow) {
        return this.translations.updating;
      } else if (this.productQuantity == 0) {
        return this.translations.no_quantity;
      }
      return '';
    },
    quantityTooltip() {
      if ((this.currentProduct.options?.length ?? 0) > 0 &&
        Object.keys(this.selectedOptions).length < this.currentProduct.options.length) {
        return this.translations.select_all_options;
      }
      if (this.allOptionsSelected && this.productQuantity == 0) {
        return this.translations.no_quantity;
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
        showToast(this.translations.please_select_all_options, "success");
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
        showToast(this.translations.add_to_cart);
        this.addProductToCart(productId, quantity, optionsArray);
      } else if (btn?.name === "buyNow") {
        showToast(this.translations.buy_now);
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
            showToast(this.translations.updating, "success");
          }
        })
        .finally(() => {
          this.loading.optionsLoading = false;
        });
    }
  },
  template: `

  <form class="flex flex-col gap-8" @submit.prevent="submitForm" id="productForm">
  <div class="flex flex-col justify-center gap-y-6">
      <!-- Rating -->
      <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">

              <div class="flex items-center gap-3 ">
                  <div class="flex items-center gap-[5px]">
                      <svg v-for="i in 5" :key="i" width="16" height="15" viewBox="0 0 16 15" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_335_1694)">
                              <path
                                  d="M8.2982 0.739L10.1999 5.1267L15.0263 5.55232C15.1025 5.55849 15.1752 5.58679 15.2352 5.63367C15.2951 5.68055 15.3397 5.74391 15.3632 5.81575C15.3868 5.8876 15.3883 5.96473 15.3675 6.03742C15.3468 6.11011 15.3047 6.17511 15.2466 6.22423L11.5933 9.36855L12.6706 14.0312C12.6819 14.0802 12.6832 14.1309 12.6746 14.1804C12.6659 14.2299 12.6475 14.2773 12.6203 14.3197C12.593 14.3621 12.5576 14.3988 12.516 14.4277C12.4743 14.4566 12.4273 14.4771 12.3777 14.4879C12.275 14.5093 12.1679 14.4895 12.0799 14.4329L7.93383 11.9892L3.77687 14.4449C3.73344 14.4709 3.68523 14.4882 3.63502 14.4957C3.5848 14.5032 3.53358 14.5009 3.48429 14.4887C3.43501 14.4766 3.38864 14.455 3.34785 14.4251C3.30707 14.3952 3.27267 14.3577 3.24665 14.3146C3.22059 14.2724 3.20322 14.2255 3.19554 14.1767C3.18785 14.1279 3.19 14.078 3.20186 14.03L4.28045 9.36735L0.631908 6.22423C0.555218 6.15702 0.50822 6.06283 0.50098 5.96183C0.49374 5.86083 0.526832 5.76104 0.593171 5.68383C0.666284 5.60985 0.76574 5.56695 0.870383 5.56428L5.67861 5.13866L7.58036 0.739C7.61103 0.670235 7.66129 0.611766 7.72502 0.570717C7.78875 0.529668 7.86319 0.507812 7.93928 0.507812C8.01536 0.507813 8.0898 0.529668 8.15353 0.570717C8.21726 0.611766 8.26752 0.670235 8.2982 0.739Z"
                                  fill="#FFC700" />
                          </g>
                          <defs>
                              <clipPath id="clip0_335_1694">
                                  <rect width="14.875" height="14" fill="white" transform="translate(0.5 0.5)" />
                              </clipPath>
                          </defs>
                      </svg>
                  </div>
                  <span class="text-secondary">6 تقييمات</span>
              </div>

              <!-- Title & Price -->
              <slot name="title"></slot>
          </div>

          <template v-if="allOptionsSelected">
              <div class="flex  items-center gap-2">
                  <div class="flex  items-center gap-0.5">
                      <span v-text="currentProduct?.pricing?.price"
                          class="text-[28px] font-bold text-secondary"></span>
                      <span v-text="currencySymbol" class="text-[28px] font-bold text-secondary"></span>
                  </div>
                  <div v-show="currentProduct?.pricing?.compareAtPrice"
                      class="flex line-through  items-center gap-0.5">
                      <span v-text="currentProduct?.pricing?.compareAtPrice" class=" text-secondary/50"></span>
                      <span v-text="currencySymbol" class="text-secondary/50"></span>
                  </div>
              </div>
          </template>

          <!-- Show message when options exist but not all are selected -->
          <div v-if="currentProduct?.options?.length > 0 && !allOptionsSelected " class="flex items-center gap-0.5">
              <span class="text-lg text-orange-500 font-medium">{{ translations.select_all_options }}</span>
          </div>
          <!-- Description -->
          <div v-if="currentProduct?.description">
          <slot  name="description"></slot>
      </div>
      </div>

      <template v-if="currentProduct?.options?.length > 0" v-for="opt in currentProduct?.options" :key="opt._id">
          <div class="flex flex-col gap-3">
              <h3 class="text-base font-semibold text-gray-800 ">{{ opt.name }}</h3>
              <div class="flex items-center gap-3 flex-wrap">
                  <button class="rounded-lg py-1.5 px-3 border border-stok" v-for="val in opt.values" :key="val._id" @click.prevent="selectOption(val._id, opt._id)"
                      :class="['size-button ', isOptionSelected(val._id, opt._id) ? 'bg-gray3' : 'bg-white']">
                      {{ val.label }}
                  </button>
              </div>
          </div>
      </template>
  
          <slot name="shipping_settings"></slot>
          
      <div class="flex items-baseline flex-col gap-6">

          <div class="flex flex-col sm:flex-row items-center gap-5 w-full ">
              <component-tooltip :content="addToCartTooltip">
                  <button type="button"
                      @click="addProductToCart(currentProduct._id, productQuantity, Object.values(selectedOptions).filter(id => id))"
                      :disabled="!allOptionsSelected || productQuantity == 0 || loading.addToCart"
                      class="w-full flex-1 bg-primary text-white font-medium py-3.5 px-6 rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed">
                      <component-loading v-if="loading.addToCart"></component-loading>
                      <div v-else class=" flex items-center justify-center gap-2 ">
                          <span class="material-symbols-outlined">shopping_cart</span>
                          <span>{{ translations.add_to_cart }}</span>
                      </div>
                  </button>
              </component-tooltip>

              <div class="flex items-center justify-center gap-4 px-4 min-h-[52px] border border-gray-300 rounded-lg">
                  <component-tooltip class="flex items-center justify-center" :content="quantityTooltip">
                      <button type="button" @click="decreaseProductItem" :disabled="!allOptionsSelected"
                          class=" text-[22px] material-symbols-outlined disabled:opacity-50 disabled:cursor-not-allowed">remove</button>
                  </component-tooltip>

                  <component-tooltip class="flex items-center justify-center" :content="quantityTooltip">
                      <input type="text" id="quantity-inputs" :value="productQuantity" class=" max-w-5  font-medium text-2xl text-center"
                          readonly>
                  </component-tooltip>

                  <component-tooltip class="flex items-center justify-center" :content="quantityTooltip">
                      <button type="button" @click="increaseProductItem" :disabled="!allOptionsSelected"
                          class="text-[22px] material-symbols-outlined disabled:opacity-50 disabled:cursor-not-allowed">add</button>
                  </component-tooltip>
              </div>
          </div>
              <div class="w-full">

          <component-tooltip :content="buyNowTooltip">
              <button type="submit" name="buyNow" value="buyNow"
                  :disabled="!allOptionsSelected || productQuantity == 0 || loading.buyNow"
                  class="w-full min-h-[52px]  border border-primary font-medium py-[11.5px] px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  <component-loading v-if="loading.buyNow"></component-loading>
                  <span class="text-primary" v-else>{{ translations.buy_now }}</span>
              </button>
          </component-tooltip>
          </div>

      </div>
  </div>
</form>
  `
};
