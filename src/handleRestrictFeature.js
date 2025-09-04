import store from './store'
export function handleButtonClick(action, ...params) {
    if (store?.getters?.getUserId == null) {
        store.commit('SET_RESTRICT_POPUP', true)
    }
    else if (store?.getters['user/subscriptionStatus'] !== 'trialing' && store?.getters['user/subscriptionStatus'] !== 'active') {
        store.commit('SET_RESTRICT_POPUP', true)
    } else {
        if (typeof action === "function") {
            action(...params);
        }
    }
}