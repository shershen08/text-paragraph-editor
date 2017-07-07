<template>
  <div class="wrapper container">
    <div id="drop_zone" v-if="!isDroped" v-on:dragover="handleDragOver" v-on:drop="handleFileSelect">
      <img src="../assets/icon_drag.png"/>
    </div> 
    <text-grid v-if="isDroped" :columns="gridColumns" :maxval="maxLengthCalculated"> 
    </text-grid> 
  </div>
</template>

<script>
import TextGrid from './textGrid';

import {
  readBlob,
  splitByLines,
  getMaxLength
} from '../utils';

export default {
  name: 'mainBlock',
  data() {
    return {
      isDroped: false
    }
  },
  components: {
    TextGrid
  },
  methods: {
    handleFileSelect: function (evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.
      this.listFilesContent(files);
    },
    handleDragOver: function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy";
    },
    listFilesContent: function (files) {
      let filesArray = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === "text/plain") filesArray.push(files[i]);
      }

      filesArray.map(f => {
        readBlob(f, function (readText) {
          f.read = splitByLines(readText);
        });
      });

      setTimeout(() => {
        this.isDroped = true;
        this.gridColumns = filesArray;
        this.maxLengthCalculated = Math.max(...getMaxLength(filesArray));
      }, 1000);
    }
  }
}

</script>

<style lang="less">
  body {
  background: #fff;
  font-family: Arial, 'sans-serif';
}
.container {
  display: flex;
   flex-direction: row;
}
#drop_zone {
  padding: 25px;
  text-align: center;
  flex: 100%;
}
.main-table {
  td {
    vertical-align: top;
  }
  tbody tr:hover {
    background: rgba(155, 155, 155, 0.1);
  }

  th {
    text-align: left;
    padding: 0 10px;
    font-weight: 400;
    color: #6D6D6D;
  }
  th span {
    cursor: pointer;
    img {
      width: 20px;
    margin-right: 8px;
    }
  }
  tr.active p {
    border-left: 7px solid #276091;
    border-right: 7px solid #276091;
  }
  td {
    padding: 5px 10px;
  }
  textarea {
    margin-top: 1em;
    outline: none;
  }
  p, textarea {
    word-wrap: break-word;
    min-height: 20px;
    font-family: Arial, 'sans-serif' !important;
    font-size: 14px !important;
    color:#000 !important;
    line-height: 120% !important;
    letter-spacing: normal !important;
        border-top: none;
        border-bottom: none;
    padding: 0px 5px;
    width: 80%;
    border-left: 7px solid #fff;
    border-right: 7px solid #fff;
    max-width: 250px;
    -webkit-box-shadow: 0 0 1px 0 rgba(155, 155, 155, 0.8);
    box-shadow: 0 0 1px 0 rgba(155, 155, 155, 0.8);
    background: #fff;
  }
  p.no-text {
    background: #FFE1ED;
    box-shadow: none;
    border-left: 7px solid #FFE1ED;
    border-right: 7px solid #FFE1ED;
  }
}

</style>
