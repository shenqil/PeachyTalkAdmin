import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div>
        <div class="bg-white rounded-xl mx-auto max-w-sm space-y-2 shadow-md py-8 px-8 sm:(py-4 flex items-center space-y-0 space-x-6) ">
          <img class="rounded-full mx-auto h-24 block sm:(mx-0 flex-shrink-0) " src="/img/erin-lindford.jpg" alt="Woman's Face" />
          <div class="space-y-2 text-center sm:text-left">
            <div class="space-y-0.5">
              <p class="font-semibold text-lg text-black">Erin Lindford</p>
              <p class="font-medium text-gray-500">Product Engineer</p>
            </div>
            <button class="border rounded-full font-semibold border-purple-200 text-sm py-1 px-4 text-purple-600 hover:(text-white bg-purple-600 border-transparent) focus:(outline-none ring-2 ring-purple-600 ring-offset-2) ">
              Message
            </button>
          </div>
        </div>
      </div>
    )
  }
})