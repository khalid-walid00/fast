import { cartSchema } from "./cart.schema.js";
import { updateFrontendQuantity, storeGateRequest } from "./helper.js";

const updateTimers = {};
const localQuantities = {};
const busy = {};

function debounceUpdateCartItem(id) {
  if (updateTimers[id]) clearTimeout(updateTimers[id]);
  if (busy[id]?.isBusy) return;

  updateTimers[id] = setTimeout(() => {
    const quantity = localQuantities[id];
    busy[id] = { isBusy: true, lastUpdated: Date.now() };

    storeGateRequest(cartSchema.updateCartItem, { data: { itemId: id, quantity } })
      .then((res) => {
        window.updateCart?.(res.updateCartItem?.data);
      })
      .catch((err) => console.error(`updateCartItem error for item ${id}`, err))
      .finally(() => {
        delete busy[id];
      });
  }, 500);
}


export default {
  methods: {
    inbusy(id) {
      return busy[id]?.isBusy || false;
    },
    clearCartItem(id) {
      busy[id] = { isBusy: true, lastUpdated: Date.now() };
      storeGateRequest(cartSchema.removeCartItem, { data: { itemId: id } })
        .then((res) => {
          window.updateCart?.(res.removeCartItem?.data);
        })
        .catch((err) => console.error(`clearCartItem error for item ${id}`, err))
        .finally(() => {
          delete busy[id];
        });
    },
    decreaseCartItem(id, currentQuantity) {
      if (!(id in localQuantities)) localQuantities[id] = currentQuantity;
      if (localQuantities[id] > 1) {
        localQuantities[id]--;
        updateFrontendQuantity(id, localQuantities[id]);
        debounceUpdateCartItem(id);
      }
    },
    increaseCartItem(id, currentQuantity) {
      if (!(id in localQuantities)) localQuantities[id] = currentQuantity;
      localQuantities[id]++;
      updateFrontendQuantity(id, localQuantities[id]);
      debounceUpdateCartItem(id);
    },
    checkout() {
      window.updateLoading?.("checkout", true);
      window.qumra?.checkout?.().finally(() => window.updateLoading?.("checkout", false));
    },
  },
};
