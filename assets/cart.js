import { cartSchema } from "./cart.schema.js";
import { updateFrontendQuantity, storeGateRequest } from "./helper.js";

const updateTimers = {};
const localQuantities = {};
const busy = {};
const lastSuccessfulQuantities = {};

function getQtyFromGlobals(id) {
  try {
    const items = window?.globals?.cart?.items;
    if (!Array.isArray(items)) return undefined;
    const it = items.find((i) => i._id === id);
    return it ? it.quantity : undefined;
  } catch (e) {
    return undefined;
  }
}

function syncFromCartData(cartData) {
  const items = (cartData && cartData.items) || window?.globals?.cart?.items || [];
  if (!Array.isArray(items)) return;
  items.forEach((item) => {
    lastSuccessfulQuantities[item._id] = item.quantity;
    localQuantities[item._id] = item.quantity;
  });
}

syncFromCartData(window?.globals?.cart);

function debounceUpdateCartItem(id) {
  if (updateTimers[id]) clearTimeout(updateTimers[id]);
  if (busy[id]?.isBusy) return;

  updateTimers[id] = setTimeout(() => {
    const quantity = localQuantities[id];
    const fallbackQuantity = (lastSuccessfulQuantities[id] ?? getQtyFromGlobals(id) ?? quantity ?? 1);

    busy[id] = { isBusy: true, lastUpdated: Date.now() };

    storeGateRequest(cartSchema.updateCartItem, { data: { itemId: id, quantity } })
      .then((res) => {
        const payload = res?.updateCartItem;
        if (payload?.success) {
          const data = payload.data;
          if (data) {
            window.updateCart?.(data);
            if (Array.isArray(data.items)) {
              data.items.forEach((it) => {
                lastSuccessfulQuantities[it._id] = it.quantity;
                localQuantities[it._id] = it.quantity;
                try { updateFrontendQuantity(it._id, it.quantity); } catch (e) {}
              });
            } else {
              lastSuccessfulQuantities[id] = quantity;
              localQuantities[id] = quantity;
            }
          } else {
            lastSuccessfulQuantities[id] = quantity;
            localQuantities[id] = quantity;
          }
        } else {
          const serverQty = payload?.data?.items?.find((i) => i._id === id)?.quantity;
          const rollbackQty = (serverQty ?? lastSuccessfulQuantities[id] ?? getQtyFromGlobals(id) ?? 1);
          localQuantities[id] = rollbackQty;
          updateFrontendQuantity(id, rollbackQty);
          showToast(payload?.message || "تعذر تحديث المنتج", "error");

          if (payload?.data) syncFromCartData(payload.data);
        }
      })
      .catch((err) => {
        const rollbackQty = (lastSuccessfulQuantities[id] ?? getQtyFromGlobals(id) ?? 1);
        localQuantities[id] = rollbackQty;
        updateFrontendQuantity(id, rollbackQty);
        console.error(`updateCartItem error for item ${id}`, err);
      })
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
          const data = res?.removeCartItem?.data;
          if (data) {
            window.updateCart?.(data);
            syncFromCartData(data);
          } else {
            delete lastSuccessfulQuantities[id];
            delete localQuantities[id];
          }
        })
        .catch((err) => console.error(`clearCartItem error for item ${id}`, err))
        .finally(() => {
          delete busy[id];
        });
    },

    decreaseCartItem(id, currentQuantity) {
      if (!(id in localQuantities)) {
        localQuantities[id] = currentQuantity;
        lastSuccessfulQuantities[id] = (lastSuccessfulQuantities[id] ?? getQtyFromGlobals(id) ?? currentQuantity);
      }
      if (localQuantities[id] > 1) {
        localQuantities[id]--;
        updateFrontendQuantity(id, localQuantities[id]);
        debounceUpdateCartItem(id);
      }
    },

    increaseCartItem(id, currentQuantity) {
      if (!(id in localQuantities)) {
        localQuantities[id] = currentQuantity;
        lastSuccessfulQuantities[id] = (lastSuccessfulQuantities[id] ?? getQtyFromGlobals(id) ?? currentQuantity);
      }
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
