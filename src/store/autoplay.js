import {  updateUserSettings } from '@/services/user'
const state = {
    autoPlayScan: false,
    autoPlayWatch: false,
    autoPlaySpeedScan: 1,
    autoPlaySpeedWatch: 1,
}

const getters = {
    autoPlayScan: state => state.autoPlayScan,
    autoPlayWatch: state => state.autoPlayWatch,
    autoPlaySpeedScan: state => state.autoPlaySpeedScan,
    autoPlaySpeedWatch: state => state.autoPlaySpeedWatch
}

const mutations = {
    SET_AUTOPLAY_SCAN(state, payload) {
        state.autoPlayScan = payload
    },
    SET_AUTOPLAY_WATCH(state, payload) {
        state.autoPlayWatch = payload
    },
    SET_AUTOPLAY_SPEED_SCAN(state, payload) {
        state.autoPlaySpeedScan = payload
    },
    SET_AUTOPLAY_SPEED_WATCH(state, payload) {
        state.autoPlaySpeedWatch = payload
    }
}

const actions = {
    changeAutoPlayScan({ commit, state }, payload) {
        if (payload === true && state.autoPlayWatch === true) {
            commit('SET_AUTOPLAY_WATCH', false)
        }
        commit('SET_AUTOPLAY_SCAN', payload)
    },
    changeAutoPlayWatch({ commit, state }, payload) {
        if (payload === true && state.autoPlayScan === true) {
            commit('SET_AUTOPLAY_SCAN', false)
        }
        commit('SET_AUTOPLAY_WATCH', payload)
    },
    async setAutoPlaySpeedScan(context, payload) {
        try {
            let userData = {
                ...context.rootState.userData,
            }
            userData['autoPlaySpeedScan'] = payload
            const result = await updateUserSettings({
                userData: userData,
            }, "setAutoPlaySpeedScan")
            context.state.userData = userData
            context.commit('SET_AUTOPLAY_SPEED_SCAN', payload)
            return result.updated
        } catch (error) {
            return null
        }
    },
    async setAutoPlaySpeedWatch(context, payload) {
        try {
            let userData = {
                ...context.rootState.userData,
            }
            userData['autoPlaySpeedWatch'] = payload
            const result = await updateUserSettings({
                userData: userData,
            }, "setAutoPlaySpeedWatch")
            context.state.userData = userData
            context.commit('SET_AUTOPLAY_SPEED_WATCH', payload)
            return result.updated
        } catch (error) {
            return null
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
} 