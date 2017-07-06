<script>
import Vue from 'vue';
import pItem from './components/pItem';

export default {
    name: "row-item",
    template: "#row-template",
      components: {
        Main
    },
    props: {
        ii: Number,
        columns: Array
    },
    data: function () {
        return {
            isActive: false
        };
    },
    methods: {
        fileParagraph: function (item) {
            return item ? item : "";
        },
        activeRowClass: function () {
            var result = [];
            if (this.isActive) result.push("active");
            return result;
        },
        toggleActive: function (index) {
            this.isActive = !this.isActive;
        }
    }
};
</script>
<template>
      <tr v-bind:class="activeRowClass()" @click="toggleActive">
    <td v-for="(key,j) in columns">
      <p-item :text="fileParagraph(key)" v-on:setseparated="$parent.itemsAdd" :hindex="j" :vindex="ii" v-on:setactive="$parent.communicateActive" v-on:addtoupper="$parent.itemsRemove" v-on:updaterowvalue="$parent.updateRowValue" />
    </td>
  </tr>
</template>