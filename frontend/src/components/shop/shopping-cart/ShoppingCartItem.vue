<template>
  <div class="media ShoppingCartItem">
    <div class="media-body">
      <strong class="d-block">{{item.name}}</strong>
      <span>Quantity: {{item.quantity}} - {{item.price, "€ " | formatMoney}}</span>
    </div>
    <div class="media-right align-middle">
      <RemoveFromCart :product="item" />
    </div>
  </div>
</template>

<script>
import RemoveFromCart from './../products/RemoveFromCart'

export default {
  name: 'ShoppingCartItem',
  props: {
    item: Object
  },
  components: { RemoveFromCart }
}
</script>

<style>
.ShoppingCartItem {
  margin-bottom: 3px;
}
</style>
