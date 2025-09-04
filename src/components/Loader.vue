<template>
        <div class="loader"></div>
    </template>
    
    <script>

    export default {
      name: 'Loader',
      components: {
         
    },
      data() {
        return {
           
            
        }
      },
      methods: {
      
      },
      computed: {
    
      },
      watch: {
        
  },

    }
    </script>
    
    <style>
   

                .loader {
                    border: 4px solid #cecece;
                    border-radius: 50%;
                    border-top: 4px solid #828282;
                    width: 28px;
                    height: 28px;
                    -webkit-animation: spin 2s linear infinite; /* Safari */
                    animation: spin 2s linear infinite;
                    }



                    @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                    }

            
                
    </style>