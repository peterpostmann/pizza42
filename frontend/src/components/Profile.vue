<template>
<div>
  <div v-if="profile.authenticated">
    <div class="card card-default profile-area mb-3" v-if="profile.data">
      <div class="card-body">
        <div class="media">
          <img :src="profile.data.picture" class="align-self-center mr-3" alt="avatar">
          <div class="media-body">
            <h5 class="mt-0">{{ profile.data.name }}</h5>
            Email: {{ profile.custom_data.email }} - 
            <span class="text-success" v-if="profile.custom_data.email_verified">verified</span>
            <span class="text-warning" v-if="!profile.custom_data.email_verified">unverified (Please click on the link in the e-mail we sent you)</span>
          </div>
          <span class="float-right cursor-pointer" v-on:click="hide = !hide">showToken()</span>
        </div>
      </div>
    </div>
    <div class="card card-default mb-3" v-if="!hide">
      <div class="card-body">
        <pre>{{showToken()}}</pre>
      </div>
    </div>
    <div class="card card-default" v-if="orders.Items && orders.Items.length > 0">
      <table class="card-body table table-sm">
        <thead>
          <tr>
            <th scope="col" style="widht: 10%">#</th>
            <th scope="col" style="widht: 20%">Date</th>
            <th scope="col" style="widht: 60%">Order</th>
            <th scope="col" style="widht: 10%"><div class="text-right mr-3">Total</div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders.Items">
            <th scope="row">{{order.order_id.slice(0, 8)}}</th>
            <td>{{order.date | formatDate}}</td>
            <td class="mb-3">
              <div v-for="(item, id) in order.order">{{item.quantity}}x {{products[id].name}}</div>
            </td>
            <td><p class="text-right mr-3">{{order.total, "€ " | formatMoney}}</p></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card card-default" v-if="!orders.Items || orders.Items.length <= 0">
      <div class="card-body">
        <p class="card-text">You don't have any orders yet. Time to eat some pizza :)</p>
      </div>
    </div>
  </div>
  <div class="card card-default" v-if="!profile.authenticated">
    <div class="card-body" v-if="!profile.authenticated">
      You are not logged in
      <span class="float-right cursor-pointer" @click="getOrders()">getOrders()</span>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import decode from 'jwt-decode'

export default {
  computed: mapState({
    orders: state => state.orders.data,
    profile: state => state.profile,
    products: state => state.products.all
  }),
  methods: {
    ...mapActions([
      'getOrders',
      'getProducts',
      'logout'
    ]),
    showToken () {
      return {
        access_token: decode(localStorage.getItem('access_token')),
        id_token: decode(localStorage.getItem('id_token'))
      }
    }
  },
  data: () => {
    return {
      hide: true
    }
  },
  created () {
    this.getProducts()
    if (this.profile.authenticated) {
      this.getOrders()
    }
  }
}
</script>

<style>
  .profile-area img {
    width: 50px;
    height: 50px;
  }
</style>
