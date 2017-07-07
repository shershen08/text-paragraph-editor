<script>
import Vue from 'vue';
import rowItem from './rowItem';
import {downloadFileHTML, getMaxLength} from '../utils';

let bus = new Vue();

export default {
    name: "text-grid",
    template: "#grid-template",
    components: {
        rowItem
    },
    props: {
        columns: Array,
        maxval: Number
    },
    data: function () {
        return {
            columnWidth: parseInt(100 / this.columns.length) - 1 + "%",
            maxvalReal: this.maxval
        };
    },
    computed: {},
    methods: {
        downloadFile: downloadFileHTML,
        fileName: function (item) {
            return item.name;
        },
        getColumnsForRow: function (index) {
            return this.columns.map(c => c.read[index - 1]);
        },
        updateRowValue: function (event) {

            Vue.set(this.columns[event.hindex].read, event.vindex - 1, event.text)
        },
        itemsAdd: function (eventDetails) {
            const pieces = eventDetails.text.split(/\n/);
            this.columns[eventDetails.hindex].read[eventDetails.vindex - 1] =
                pieces[0];

            this.columns[eventDetails.hindex].read.splice(
                [eventDetails.vindex],
                0,
                pieces[1]
            );

            bus.$emit("id-setfocus", {
                vIndex: eventDetails.vindex + 1,
                hIndex: eventDetails.hindex
            });
            this.maxvalReal = Math.max(...getMaxLength(this.columns));
        },
        itemsRemove: function (event) {
            const upperText = this.columns[event.hindex].read[
                event.vindex - 2
            ];
            this.columns[event.hindex].read[event.vindex - 2] =
                upperText + event.text;

            this.columns[event.hindex].read.splice(
                [event.vindex - 1],
                1
            );
            bus.$emit("id-setfocus", {
                vIndex: event.vindex - 1,
                hIndex: event.hindex,
                textLength: event.text.length
            });
            this.maxvalReal = Math.max(...getMaxLength(this.columns));
        },
        communicateActive: function (e) {
            bus.$emit("id-selected", e);
        }
    }
};
</script>
<template>
      <div>
    <table class="main-table">
      <thead>
        <tr>
          <th v-for="key in columns" v-bind:style="{width:columnWidth}">
            <span class="arrow" @click="downloadFile(key)">
            <img src="../assets/download.png"/>
          {{fileName(key)}}
          </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <row-item v-for="i in maxvalReal" :ii="i" :key="i" :columns="getColumnsForRow(i)"/>
      </tbody>
    </table>
  </div>
</template>