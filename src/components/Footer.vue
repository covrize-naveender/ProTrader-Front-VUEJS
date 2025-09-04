<template>
    <div style="height:100%;display:flex;align-items: end;white-space: nowrap;">
                    <!-- footer -->
                    <div style="color:#333333;font-Size:16px;font-weight: 500;">&copy; ProTrader</div>
                    <!-- <ul class="mixed-list">
                    <li class="hoverUnderline">Legal</li>
                    <li class="hoverUnderline">Financial Services Guide(FSG)</li>
                    <li class="hoverUnderline">Support</li>
                    </ul> -->
                </div>
 </template>
 
 <script>
 export default {
    name: 'Footer',
   props: {
  
   },
   data() {
     return {
     
     };
   },
   methods: {
 
   }
 };
 </script>
 
 <style scoped>
    .mixed-list {
                list-style: none;
                padding: 0;
                display: flex;
                color:#656565;
                font-size: 13px;
                cursor: pointer;
                }

                .mixed-list li:before {
                content: "• "; /* You can customize the bullet character as needed */
                margin-right: 10px; /* Add some spacing between the bullet and the list item text */
                display: inline-block;
                margin-left: 10px;
                }
              
 </style>