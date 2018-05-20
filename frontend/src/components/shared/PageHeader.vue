<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container">

      <router-link :to="'/'" class="navbar-brand">
        Pizza42 &#x1F355;
      </router-link>

      <span class="navbar-text float-xs-right" v-if="!profile.authenticated">
        Please <a @click="login()" class="navbar-text cursor-pointer">log in or sign up</a>
      </span>
 
      <span class="navbar-text float-xs-right" v-if="profile.authenticated">
        Hello <router-link :to="'profile'"><strong class="navbar-text cursor-pointer">{{profile.data.name}}</strong></router-link> | 
        <a @click="logout()" class="navbar-text cursor-pointer">Log Out</a>
      </span>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PageHeader',
  computed: {
    ...mapState(['profile'])
  },
  methods: mapActions([
    'login',
    'logout'
  ])
}
</script>
