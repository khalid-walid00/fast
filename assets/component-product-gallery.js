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
      <div class="grid grid-cols-4 gap-4 min-h-[200px] mt-4">
    
          <img 
              v-for="(image, index) in images" 
          :key="index"
          @click="selectedIndex = index"
            :src="image.fileUrl" 
            alt="صورة مصغرة" 
            class="w-full h-full rounded-lg cursor-pointer object-cover thumb-image"
          />
      </div>
    </div>
  `
}
