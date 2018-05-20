<template>
  <div>
    <div class="w-100 mb-3" v-for="product in products">
      <Product :product="product" track-by="id" />
    </div>
  </div>
</template>

<script>
import Product from './Product'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProductList',
  computed: mapState({
    products: state => state.products.all
  }),
  methods: mapActions([
    'getProducts'
  ]),
  data: () => {
    return {
      orders: []
    }
  },
  components: { Product },
  created () {
    this.getProducts()
  }
}
</script>
