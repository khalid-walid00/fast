// component-product-gallery.js
export default {
  props: ["images"],
  data() {
    return {
      selectedIndex: 0,
    }
  },
  computed: {
    mainImage() {
      return this.images?.[this.selectedIndex]?.fileUrl || "https://placehold.co/800x800/f0e5d9/333333?text=No+Image";
    }
  },
  template: `
    <div class="flex flex-col">
      <!-- Main Image -->
      <div class="aspect-square w-full bg-gray-200 rounded-xl overflow-hidden shadow-sm">
        <img 
          :src="mainImage" 
          alt="صورة المنتج" 
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <!-- Thumbnail Gallery -->
      <div class="grid grid-cols-4 gap-3 mt-4">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          @click="selectedIndex = index"
          class="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2"
          :class="selectedIndex === index ? 'main-brand-color-border' : 'border-transparent'"
        >
          <img 
            :src="image.fileUrl" 
            alt="صورة مصغرة" 
            class="w-full h-full object-cover thumb-image"
          />
        </div>
      </div>
    </div>
  `
}
