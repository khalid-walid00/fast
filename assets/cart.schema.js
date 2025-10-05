export const cartSchema = {
    removeCartItem: `mutation removeCartItem($data: RemoveCartItemInput!) {
      removeCartItem(data: $data) {
        data {
          _id app
          items {
            productId _id variantId
            productData { title slug app image { _id fileUrl } price }
            variantData {
              compareAtPrice
              options { _id label option { _id name } }
              price
            }
            quantity price compareAtPrice totalPrice totalCompareAtPrice totalSavings
          }
          deviceId sessionId status totalQuantity totalPrice totalCompareAtPrice totalSavings isFastOrder
        }
        success message
      }
    }`,
    updateCartItem: `mutation UpdateCartItem($data: updateCartItemInput!) {
      updateCartItem(data: $data) {
        success message
        data {
          _id app
          items {
            productId _id variantId
            productData { title slug app image { fileUrl _id } price }
            variantData {
              price compareAtPrice
              options { label _id option { _id name } }
            }
            quantity price compareAtPrice totalPrice totalCompareAtPrice totalSavings
          }
          deviceId sessionId status totalQuantity totalPrice totalCompareAtPrice totalSavings isFastOrder
        }
      }
    }`,
    createCheckoutToken: `mutation UpdateCartItem($input: CreateCheckoutTokenInput!) {
      createCheckoutToken(input: $input) { success message encryptionKey url }
    }`,
};
