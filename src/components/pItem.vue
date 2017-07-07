<script>
import Vue from 'vue';

Vue.config.keyCodes.baskp = 8;
let bus = new Vue();

export default {
  template: "#item-template",
  name: "p-item",
  props: {
    text: String,
    hindex: Number,
    vindex: Number
  },
  data: function() {
    return {
      editmode: false,
      isEmpty: false
    };
  },
  computed: {},
  mounted() {
    this.isEmptyText();

    bus.$on("id-selected", evt => {
      if (evt.myId != `v${this.hindex}h${this.vindex}`) this.escPress();
    });

    bus.$on("id-setfocus", evt => {
      if (evt.vIndex == this.vindex && evt.hIndex == this.hindex) {
        this.setEditmode(evt.textLength);
      }
    });

    this.$watch("text", val => {
      this.isEmptyText();
    });
    
    this.$watch("editmode", (val, oldval) => {
      if(val === false)
        this.$emit("updaterowvalue", {
        hindex: this.hindex,
        vindex: this.vindex,
        text: this.text
      });
    });
  },
  methods: {
    isEmptyText: function() {
      this.isEmpty = this.text == " " || this.text == "";
    },
    checkValue: function() {},
    setEditmode: function(position) {
      this.editmode = true;
      this.$emit("setactive", {
        myId: `v${this.hindex}h${this.vindex}`
      });

      const pHeight = this.$refs.textareaItem.children[0].clientHeight;
      //try Vue.nextTick ?
      setTimeout(() => {
        const ta = this.$refs.textareaItem.children[1];
        ta.focus();
        if (position) {
          ta.selectionEnd = ta.value.length - position;
        }
        ta.style.height = parseInt(pHeight) + "px";
                ta.scrollTop = 0;
      }, 50);
    },
    submitText: function() {
      this.editmode = false;
      this.$emit("setseparated", {
        text: this.text,
        hindex: this.hindex,
        vindex: this.vindex
      });
      this.isEmptyText();
    },
    escPress: function() {
      this.isEmptyText();
      this.editmode = false;
    },
    deleteSymbol: function() {
      if (this.$refs.textareaItem.children[1].selectionStart === 0) {
        this.$emit("addtoupper", {
          text: this.text,
          hindex: this.hindex,
          vindex: this.vindex
        });
      }
    }
  }
};

</script>
<template>
      <div ref="textareaItem">
    <p v-show="!editmode" @click="setEditmode()" v-bind:class="{ 'no-text': isEmpty }">{{text}}</p>
    <textarea v-show="editmode" v-model="text" v-on:keyup.enter="submitText" v-on:keyup.8="deleteSymbol" v-on:keyup.esc="escPress"></textarea>
  </div>
</template>