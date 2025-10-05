export const productSchema = {
    
  variantByOptions: `mutation VariantByOptions($input: VariantByOptions!) {
    variantByOptions(input: $input) {
      success
      message
      data {
        _id
        product
        options {
          _id
          option {
            _id
            product
            valuesCount
            values {
              _id
              label
              type
              sortOrder
              createdAt
              updatedAt
            }
            name
            createdAt
            updatedAt
          }
          label
          type
          sortOrder
          createdAt
          updatedAt
        }
        images {
          _id
          fileUrl
        }
        pricing {
         compareAtPrice
         originalPrice
         price
        }
        quantity
      }
    }
  }
`
,
  addToCart: `mutation AddToCart($data: AddToCartInput!) {
addToCart(data: $data) {
  data {
    _id
    app
    items {
      productId
      _id
      variantId
      productData {
        title
        slug
        app
        image {
          _id
          fileUrl
        }
        price
      }
      variantData {
        compareAtPrice
        options {
          _id
          label
          option {
            _id
            name
          }
        }
        price
      }
      quantity
      price
      compareAtPrice
      totalPrice
      totalCompareAtPrice
      totalSavings
    }
    deviceId
    sessionId
    status
    totalQuantity
    totalPrice
    totalCompareAtPrice
    totalSavings
    isFastOrder
  }
  success
  message
}
}`,
  buyNow: `mutation BuyNow($data: AddToCartInput!) {
buyNow(data: $data) {
  success
  message
  url
  encryptionKey
}
}
  `,
  resolvePrice: `mutation ResolvePrice($input: ResolvePriceInput!) {
resolvePrice(input: $input) {
  success
  message
  data {
    product {
      _id
      pricing {
        originalPrice
        compareAtPrice
        price
      }
    }
  }
}
}`
}