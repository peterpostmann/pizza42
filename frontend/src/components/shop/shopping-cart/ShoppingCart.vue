<template>
  <div>
    <div class="ShoppingCartItems">
      <ShoppingCartItem
        v-for="item in items"
        :item="item"
        :key="item.id" />
    </div>

    <ShoppingCartSummary />

    <div class="mt-3 text-xs-center float-right">
      <button class="btn btn-success"
        :disabled="items.length == 0"
        @click="placeOrder()">
        Checkout
      </button>
    </div>
  </div>
</template>

<script>
import ShoppingCartItem from './ShoppingCartItem'
import ShoppingCartSummary from './ShoppingCartSummary'
import { mapGetters } from 'vuex'

export default {
  name: 'ShoppingCart',
  computed: mapGetters({
    items: 'cartProducts'
  }),
  components: {
    ShoppingCartItem,
    ShoppingCartSummary
  },
  methods: {
    placeOrder () {
      this.$router.push('/checkout')
    }
  }
}
</script>

<style>

.ShoppingCartItems .ShoppingCartItem:last-child {
  margin-bottom: 12px;
}

</style>
