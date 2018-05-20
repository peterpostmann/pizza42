<template>
  <ul class="list-group">
    <li class="list-group-item">
      Subtotal ({{itemsQuantity}} {{'item' | pluralize(itemsQuantity) }}): {{subtotal, "€ " | formatMoney}}
    </li>

    <li class="list-group-item">
      Shipping:
      <em> Free Shipping</em>
    </li>

    <li class="list-group-item">
      <strong>Total:</strong>
      <strong> {{total, "€ " | formatMoney}}</strong>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ShoppingCartSummary',
  computed: {
    ...mapGetters([
      'itemsQuantity',
      'subtotal',
      'total'
    ])
  }
}
</script>
