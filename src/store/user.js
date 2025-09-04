import { isClientAccountActive } from '../services/user'

export default {
  namespaced: true,
  state: () => ({
    subscriptionStatus: 'live',
    trialEndsIn: '',
    subscriptionList: [],
    selectedSubsciption: ''
  }),
  mutations: {
    updateSubscriptionState(state, data) {
      state.subscriptionStatus = data.status
      if (data.status === 'trialing') {
        state.trialEndsIn = data.trialEndsIn
      } else {
        state.trialEndsIn = ''
      }
      state.selectedSubsciption = data?.subscription_cancel_status
    },
    setSubscriptionList(state, data) {
      state.subscriptionList = data
    },
  },
  actions: {
    async retrieveUserSubscriptionStatus(context) {
      const isClientAccountAuthenticated = await isClientAccountActive()
      if (isClientAccountAuthenticated) {
        context.commit("setSubscriptionList", [isClientAccountAuthenticated])
        context.commit('updateSubscriptionState', isClientAccountAuthenticated)
        return { isSuccess: true, data: isClientAccountAuthenticated }
      }
      else {
        return { isSuccess: false, data: null }
      }
    },
  },
  getters: {
    subscriptionList: (state) => state.subscriptionList,
    subscriptionStatus: (state) => state.subscriptionStatus,
  },
}
