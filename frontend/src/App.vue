<template>
  <div>
    <PageHeader/>

    <div class="container mt-3">
      <router-view />
    </div>

    <div class="footer-copyright py-3 text-center">
      © 2018 <a href="/"> Pizza42 </a>
    </div>

  </div>
</template>

<script>
import PageHeader from './components/shared/PageHeader'

export default {
  name: 'app',
  components: {
    PageHeader
  }
}
</script>

<style>
/* Bootstrap */
@import './../node_modules/bootstrap/dist/css/bootstrap.css';

/* Prevent page from jumping due to the scrollbar */
html { margin-left: calc(100vw - 100%); }

/* cursor styles */
.cursor-pointer {
  cursor: pointer;
}

</style>
