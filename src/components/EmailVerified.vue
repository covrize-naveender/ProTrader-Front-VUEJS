<template>
    <div style="width:100%;background:#f5f4f4;height:100%;overflow: hidden;;padding: 40px 40px 40px 80px;">
        
        <div style="width:100%;height:100%;display:flex; justify-content: space-between">
            <div style="height:100%;width:25%;display: flex; flex-direction: column;justify-content: space-between;">
                <div style="height:10%">
                    <Header></Header>
                </div>
                <div style="height:80%;">
                  
                   <div style="height:40%;display: flex;flex-direction: column;justify-content: center;">
                    <div>
                        <span style="font-size:44px">Your email is <span style="color:#F20E17">verified</span></span>
                    </div>
                    <div style="margin-top:2rem;display:flex;align-items: center;">
                        <div class="loader"></div>
                        <div style="margin-left:20px">
                            <span style="color:#828282;font-size:16px">Loading...</span>
                        </div>
                    </div>
                   </div>     


                </div>
                <div style="height:5%;">
                    <!-- footer -->
                    <Footer></Footer>
                </div>
            </div>
            
            <div style="height:100%;width:68%">
                <TrialInfo></TrialInfo>
            </div>
        </div>
    </div>
    </template>
    
    <script>
    // import {loginUser, registerUser} from '../services/user'
 
    import DynamicInput from '../components/DynamicInput.vue'
    import Header from '../components/Header.vue'
    import Footer from '../components/Footer.vue'
    import ResendEmail from '../components/ResendEmail.vue'
    import TrialInfo from '../components/TrialInfo.vue'

    export default {
      name: 'EmailVerified',
      components: {
            DynamicInput,
            Header,
            Footer,
            ResendEmail,
            TrialInfo
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
    .join-us-container {
            /* text-align: center; */
            display: flex;
            align-items: center;
            padding-left: 20px;
        }

        .user-profile {
            width: 60px;
            height: 60px;
            border: 2px solid #fff;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            display: inline-block;
            margin-left: -30px;
            z-index: 1;
        }

        .user-profile img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .user-profile:nth-child(2) {
            margin-left: -20px;
        }

        .user-profile:nth-child(3) {
            margin-left: -20px;
        }

        .join-us-text {
            font-size: 20px;
            color: #333333;
            margin-left: 20px;
            /* margin-top: 20px; */
        }
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

                .loader {
                    border: 4px solid #cecece;
                    border-radius: 50%;
                    border-top: 4px solid #828282;
                    width: 30px;
                    height: 30px;
                    -webkit-animation: spin 2s linear infinite; /* Safari */
                    animation: spin 2s linear infinite;
                    }



                    @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                    }

            
                
    </style>