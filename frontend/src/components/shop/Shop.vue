<template>
  <div class="row">
    <div class="col-sm-9">
      <ProductList />
    </div>
    <div class="col-sm-3">
      <ShoppingCart 
        :auth="auth" 
      />
    </div>
  </div>
</template>

<script>
import ProductList from './products/ProductList'
import ShoppingCart from './shopping-cart/ShoppingCart'

export default {
  name: 'Shop',
  props: ['auth'],
  components: {
    ProductList,
    ShoppingCart
  }
}
</script>
