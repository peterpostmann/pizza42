<template>
<div>

  <div class="alert alert-warning" role="alert" v-if="!profile.authenticated && cartProducts.length > 0">
   Please <a @click="login()" class="cursor-pointer">log in or sign up</a> before placing an order
   <span class="float-right cursor-pointer" @click="checkout()">checkout()</span>
  </div>

  <div class="alert alert-warning" role="alert" v-if="profile.authenticated && !profile.custom_data.email_verified">
    Please verify your e-mail address before placing an order
   <span class="float-right cursor-pointer" @click="checkout()">checkout()</span>
  </div>

  <div class="card card-default" v-if="cartProducts.length > 0">
    <table class="table table-sm">
      <tbody>
        <tr v-for="item in cartProducts">
          <td>{{item.quantity}}x {{item.name}}</td>
          <td></td>
          <td><p class="text-right">{{item.quantity * item.price, "€ " | formatMoney}}</p></td>
        </tr>
        <tr>
          <td colspan=3><p class="text-right"><em> Free Shipping</em></p></td>
        </tr>
        <tr>
          <td colspan=3><p class="text-right"><strong>Total:  {{total, "€ " | formatMoney}}</strong></p></td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-success"
      :disabled="!profile.authenticated || (profile.authenticated && !profile.custom_data.email_verified)"
      @click="checkout()">
      <strong>Buy now</strong>
    </button>
  </div>

  <div class="card card-default" v-if="cartProducts.length <= 0 && !shoppingCart.orderId">
    <div class="card-body">
      <p class="card-text">You don't have items in your basket</p>
    </div>
  </div>

  <div class="card card-default" v-if="cartProducts.length <= 0 && shoppingCart.orderId">
    <div class="card-body">
      <p class="card-text">The order has been placed. Your order number is: <strong class="cursor-pointer" @click="$router.push({ path: 'profile'})">{{shoppingCart.orderId.slice(0, 8)}}</strong></p>
    </div>
  </div>

</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ShoppingCartSummary',
  computed: {
    ...mapGetters([
      'total',
      'cartProducts'
    ]),
    ...mapState(['profile', 'shoppingCart'])
  },
  data: () => {
    return {
      ordered: ''
    }
  },
  methods: {
    ...mapActions([
      'postOrder',
      'login'
    ]),
    checkout () {
      var id
      var requestBody = {
        order: {}
      }

      for (id in this.cartProducts) {
        requestBody.order[id] = {
          quantity: this.cartProducts[id].quantity
        }
      }

      this.postOrder({
        order: requestBody
      })
    }
  }
}
</script>
