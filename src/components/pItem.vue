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
  data: function () {
    return {
      editmode: false,
      isEmpty: true
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
        this.setEditmode(undefined, evt.textLength);
      }
    });

    this.$watch("text", val => {
      this.isEmptyText();
    });

    this.$watch("editmode", (val, oldval) => {
      if (val === false)
        this.$emit("updaterowvalue", {
          hindex: this.hindex,
          vindex: this.vindex,
          text: this.text
        });
    });
  },
  methods: {
    isEmptyText: function () {
      //console.log(this.text.charCodeAt(0));
      this.isEmpty = this.text == " " || this.text == "" || this.text.charCodeAt(0) == 13;
    },
    setEditmode: function (e, position) {

console.log(e, position)

      const pHeight = this.$refs.textareaItem.children[0].clientHeight;
      const ta = this.$refs.textareaItem.children[1];


      //if(!e){
      this.editmode = true;
      this.$emit("setactive", {
        myId: `v${this.hindex}h${this.vindex}`
      });

      //try Vue.nextTick ?
      setTimeout(() => {
        ta.focus();
        if (position) {
          ta.selectionEnd = ta.value.length - position;
        }
        ta.style.height = parseInt(pHeight) + "px";
        ta.scrollTop = 0;
      }, 50);

     // }
      if (e) {
        if(ta.value.length > 1){
          var s = window.getSelection();
          var range = s.getRangeAt(0);
          var node = s.anchorNode;
          while (range.toString().indexOf(' ') != 0) {
            range.setStart(node, (range.startOffset - 1));
          }
          range.setStart(node, range.startOffset + 1);
          do {
            range.setEnd(node, range.endOffset - 1);

          } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
          var str = range.toString().trim();
          //console.log(range)
          ta.selectionEnd = range.startOffset;
        } else {
           ta.selectionEnd = 0;
        }
      }


    },
    submitText: function () {
      this.editmode = false;
      this.$emit("setseparated", {
        text: this.text,
        hindex: this.hindex,
        vindex: this.vindex
      });
      this.isEmptyText();
    },
    escPress: function () {
      this.isEmptyText();
      this.editmode = false;
    },
    deleteSymbol: function () {
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
      <p v-show="!editmode" @click="setEditmode" v-bind:class="{ 'no-text': isEmpty }">{{text}}</p>
      <textarea v-show="editmode" v-model="text" v-on:keyup.enter="submitText" v-on:keyup.8="deleteSymbol" v-on:keyup.esc="escPress"></textarea>
  </div>
</template>