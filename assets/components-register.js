
import componentProductGallery from "./component-product-gallery.js";
import componentProductDetails from "./component-product-details.js";
import componentTooltip from "./component-tooltip.js";
import componentLoading from "./component-loading.js";

export function registerComponents(app) {
  app.component("component-product-gallery", componentProductGallery)
  app.component("component-product-details", componentProductDetails)
  app.component("component-tooltip", componentTooltip)
  app.component("component-loading", componentLoading)
}
