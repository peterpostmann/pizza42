<template>
  <div class="card">
    <div class="card-body">
        <h5 class="card-title float-left">{{product.name}}</h5>
        <h5 class="card-text float-right">{{product.price, "€ " | formatMoney}}</h5>
        <div class="clearfix" />
        <p class="card-text float-left col-sm-9">{{product.description}}</p>
        <div class="float-right"><AddToCart :product="product" /></div>
    </div>
  </div>
</template>

<script>
import AddToCart from './AddToCart'

export default {
  name: 'Product',
  props: {
    product: Object
  },
  components: { AddToCart }
}
</script>
