export default {
    ////--------------------------------------------Live configuration-------------------------------------------///
    USER_API:process.env.VUE_APP_USER_API || "https://webapi.protrader.com.au/",
    CHARTING_API: process.env.VUE_APP_CORE || "https://core.protrader.com.au/api/v1",

    ////-------------live stripe price ids-------------
    Monthly_priceId:process.env.VUE_APP_MONTHLY_PRICE ||"price_1OCCGXG6YGnUUug3EU4QcoxV",
    Yearly_priceId: process.env.VUE_APP_YEARLY_PRICE || "price_1OCCGXG6YGnUUug3lbzjuNIh",


    // ////--------------------------------------------Developer configuration-------------------------------------------///
    // USER_API:process.env.VUE_APP_USER_API || "http://localhost:9090",
    // CHARTING_API: process.env.VUE_APP_CORE || "http://localhost:5000/api/v1",

    // ////-------------test stripe price ids-------------
    // Monthly_priceId:"price_1OKEcwG6YGnUUug3mkoZ0McK",
    // Yearly_priceId:"price_1OKEgkG6YGnUUug3fZfAGEdD",

    FRIDAY_BROADCAST_LINK:"https://tradingroom.protraderscans.com/t/friday-broadcasts-frank-watkins",
    TRANING_ROOM_LINK:"https://tradingroom.protraderscans.com",
    INTERVAL_POPUP_TIME: 15*60*1000,
    SUB_EXP_POPUP_TIME: 0.05*60*1000,
    TRIAL_DAYS: 14,
    SUB_EXP_NOTIFICATION_DAYS: 3,
    SUPPORT_EMAIL:'support(at)protrader.com.au',
    LINK_PASSCODE:"PT-382796",
    IFRAME_URL:"https://apps.abacus.ai/chatllm/?appId=42fe7b7be&hideTopBar=2",
}