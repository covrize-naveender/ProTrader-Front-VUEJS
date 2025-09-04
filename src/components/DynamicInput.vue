<template>
    <div class="input-container">
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="inputValue"
        @input="handleInput"
        :style="{border: isError ? '1px solid red':'1px solid #E0E0E0',color:isError?'#F20E17':'#333333'}"
        class="hide-number-arrows hoverBorder"
      />
      <span v-if="iconImg" class="input-icon" style="background: white !important;height: 90%;display: flex;align-items: center; justify-items: center;">
        <img :src="iconImg" @click="togglePasswordVisibility"/>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DynamicInput',
    props: {
      type: {
        type: String,
        default: "text"
      },
      placeholder: {
        type: String,
        default: "Enter text"
      },
      iconImg: {
        type: String,
        default: null
      },
      isError:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        inputValue: ""
      };
    },
    methods: {
      handleInput() {
        this.$emit("input", this.inputValue);
      },
      togglePasswordVisibility() {
      this.$emit('password-visibility-toggled'); // Emit the custom event
    },
    }
  };
  </script>
  
  <style scoped>
  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    border:none
  }
  
  .input-container input {
    padding: 10px 15px 10px 15px;
    height:100%;
    width: 100%;
    border-radius: 6px;

  }
  input::placeholder{
    color: #BDBDBD;
  }

  .hoverBorder:hover{
    border: 1px solid #BDBDBD !important;
  }
  input:focus {
  outline: none;
  border: 1px solid #828282;
}
input {
  padding-left: 20px !important; /* You can adjust the value as needed */
  font-size: 16px;
}
  
  .input-icon {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    color: #ccc;
    margin-right: 8px;
    padding: 8px;
    
  }
  .hide-number-arrows::-webkit-inner-spin-button,
.hide-number-arrows::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
  </style>