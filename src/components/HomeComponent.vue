<template>
    <div>
        <TopToolBox />
        <TourGuide />
        <div class="middle-container f-w" id="middle-container">
            <LeftSideBar />
            <div class="chart-container-full" :class="{ 'chart-expanded': !isAIOpen }">
                <LayoutChart :class="`main-content-block`" />
                <ChartSidebar :isVisible="isAIOpen" @toggle="handleSidebarToggle" />

            </div>
            <div class="right-container" id="right-container" ref="rightContainer">
                <right-tool-box />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { setJwt } from '../services/http'
import {
    isClientAccountActive,
    isLogged
} from '../services/user'
import ChartSidebar from './Chart/ChartSidebar.vue'
import LayoutChart from './Chart/LayoutChart.vue'
import config from '../config.js'
import TopToolBox from './topToolBox/TopToolBox'
import LeftSideBar from './LeftSideBar/LeftSideBar.vue'
import RightToolBox from './RightSideBar/RightToolBox.vue'
import TourGuide from './TourGuide.vue'


export default {
    name: 'HomeComponent',
    components: {
        LayoutChart,
        TopToolBox,
        LeftSideBar,
        TourGuide,
        RightToolBox,
        ChartSidebar
    },
    async mounted() {
        this.$store.commit('SET_MINUS_INDEX', this.$route.query?.i ?? 0)
        this.retrieveSymbolsList()
        const token = localStorage.getItem('state')
        if (token) {
            const response = await this.$store.dispatch(
                'user/retrieveUserSubscriptionStatus'
            )
            if (response.isSuccess) {
                if (response.data?.trialEndsIn <= config.SUB_EXP_NOTIFICATION_DAYS && response.data?.status == "trialing") {
                    setTimeout(() => {
                        this.$store.commit('SET_SUB_EXP_POPUP', true)
                    }, config.SUB_EXP_POPUP_TIME);
                }
                await isLogged()
                setJwt()
                setInterval(() => {

                    isClientAccountActive().then((d) => {

                        if (d.status === 'inactive') {
                            //this.$router.push('/products')
                        }
                    })
                }, 60000 * 30)
            } else {
                // this.$router.push('/products')
            }
        }
        else {
            localStorage.removeItem('themeDarkModeSave')
            localStorage.removeItem('themeModeSave')
            setTimeout(() => {
                this.$store.commit('SET_INTERVAL_POPUP', true)
            }, config.INTERVAL_POPUP_TIME);
        }
        this.updateContainerWidth()
        window.addEventListener("resize", this.updateContainerWidth);

    },
    beforeDestroy() {
        window.removeEventListener("resize", this.updateContainerWidth);
    },

    methods: {
        ...mapActions(['retrieveSymbolsList', 'showBrushData', 'changeRightBoxWidth', 'setAIView']),
        updateContainerWidth() {
            const containerWidth = this.$refs.rightContainer.getBoundingClientRect().width;
            this.changeRightBoxWidth(containerWidth)
        },
        handleSidebarToggle(isVisible) {
            this.setAIView(isVisible)
        }
    },
    computed: {
        ...mapGetters([
            'getSymbolsList',
            'isChartLoading',
            'themeSettings',
            'themePrimaryColor',
            'themeSecondaryColor',
            'themeDarkMode',
            'themeFontColor',
            'getUserId',
            'getLayout',
            'isAIOpen'
        ]),
        showChart() {
            return this.getSymbolsList.length > 0
        },

        // togglebox(){
        //   return !this.togglerighttoolbox ? 'background-color: red' : ''
        //     //  return `@media screen and (max-width: 1000px) { .right-container {display : none}  }`
        // },

        showLoader() {
            let showLoad = !this.showChart || this.isChartLoading
            if (!showLoad) {
                // this.showBrushData()
            }
            return showLoad
        },
    },
}
</script>
<style lang="scss" scoped>


</style>