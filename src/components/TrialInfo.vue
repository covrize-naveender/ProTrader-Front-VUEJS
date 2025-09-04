<template>
    <div
        style="height:100%;width:100%;background: white;border-radius: 30px;padding:30px;display: flex;flex-direction: column;justify-content: space-between;overflow-y: auto;overflow-x: hidden;">
        <!-- <div style="height:5%;font-size:12px;width:100%">
      
        <div style="display: flex; align-items: center;justify-content: center;">
        <div style="width: 90%;display: flex;justify-content: space-between;">
            <div style="display: flex;width:fit-content; margin-right: 2rem;" v-for="(item,i) of marqueData" :key="i">
                    <span style="color:#828282;width: 80%;white-space: nowrap;">{{ item?.name }}</span> 
                    <span style="color:#F20E17;padding-left: 2rem;">{{ item?.percent }}</span> 
                </div>
        </div>
        </div>



                </div> -->
        <div style="height:100%;display: flex;flex-direction: column;align-items: center;padding-top: 20px;">
            <div style="height:70%;width: 90%;" class="trial-info-header">
                <!-- trial content -->
                <div
                    style="border:1px solid #F20E17;font-size: 18px;color:#F20E17;width: fit-content;border-radius: 5px;padding: 5px 15px 5px 15px;font-weight: 500;">
                    {{trial_days}}-DAYS FREE TRIAL
                </div>
                <div class="trial-Heading" style="margin: 6% 0% 2% 0%;font-size: 65px;font-weight: bold;">
                    <span style="color:#300003">Scans 1000+ Stocks in </span>
                    <span style="color:#F20E17">seconds </span>
                    <span style="color:#300003">with ProTrader</span>
                </div>
                <div class="join-us-container">
                    <div class="user-profile">
                        <img src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="User 1">
                    </div>
                    <div class="user-profile">
                        <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="User 2">
                    </div>
                    <div class="user-profile">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="User 3">
                    </div>
                    <div class="user-profile">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="User 4">
                    </div>
                    <div class="join-us-text">5k+ Stock Traders joined us, now it's your turn</div>
                </div>

            </div>
            <div style="height:30%;width: 90%;color:#AEAEAE;font-size: 15px;text-align: justify;">
                <!-- important notice -->
                <span style="font-weight:bold;">IMPORTANT NOTICE: </span>
                <span style="font-weight:200;color:#c5c5c5;" class="disclaimer-text">
                    ProTrader’s website is for general information only and is not intended to address any person’s
                    personal financial requirements, goals, objectives, or life situation. The information does not form
                    and should not be considered as personal, tailored, or one-to-one advice. Nor is it a recommendation
                    about your investment decisions. ProTrader are not financial advisors and we do not hold ourselves
                    out to be financial advisors or planners. This website is not a substitute for professional
                    financial advice. The information does not consider your personal circumstances. The contents of
                    this site change daily and the past performance results on this website do not guarantee future
                    results. This website contains general information only. The information on this website is
                    delivered to the general public and is not aimed at any individual. We encourage you to seek advice
                    from a trusted and qualified financial adviser. Nothing on this website should be taken as a
                    solicitation to buy or sell a financial product. Any reliance you place on information on this
                    website is strictly at your own risk. You alone accept the responsibility for your investment
                    decisions. Investing in stocks carries a risk of financial loss when stock prices fall. Only trade
                    with funds you can afford to lose.
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import DynamicMarquee from 'vue-dynamic-marquee'
import config from '../config';


export default {
    name: 'TrialInfo',
    components: {
        DynamicMarquee
    },
    props: {

    },
    data() {
        return {
            marqueData: [
                { name: "Apple Inc", percent: "+0.37%" },
                // {name:"E. I. du Pont de Nemours and Company",percent:"+0.08%"},
                // {name:"Alcoa Corporation",percent:"+1.31%"},
                { name: "Adicet Bio Inc", percent: "-0.14%" },
                { name: "Adagene Inc", percent: "+0.42%" },
                { name: "Addus HomeCare Corp", percent: "+0.99% " },
            ],
            trial_days: config.TRIAL_DAYS
        };
    },
    methods: {

    }
};
</script>

<style scoped></style>