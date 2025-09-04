<template>
    <div class="chartFeature-button">

        <div class="chartFeatureFull toptool-gap" style="display: flex;">

            <!-- training room button -->
            <p-button class="p-button-light toptool-bold-font full-text-btn tradingViewBtn" id="trading-room"
                type="button" @click="openNewTab">
                <span class="custom-btn-primary Rocket"></span>
                <span class="p-ml-2"> Trading Room </span>
            </p-button>

            <p-button class="p-button-light toptool-bold-font small-text-btn" id="trading-room-small" type="button"
                v-tooltip.left="'Trading Room'" @click="openNewTab">
                <span class="custom-btn-primary Rocket"></span>
            </p-button>

            <!-- Dropdown buttons -->
            <p-button class="p-button-secondary p-button-outlined userBtn" type="button" @click="toggleDropdowneMenu"
                id="user-menu">
                <UserCircleSvg />

                <i class="pi pi-angle-down p-ml-1"></i>
            </p-button>
            <p-menu class="custom-menu-topbar" ref="dropdownMenu" :model="dropdownButtonSet" :popup="true" />

            <p-button class="openRightContainer" type="button" :icon="arrowIcon" @click="Scroll()" />
        </div>


        <ScanModal :visible.sync="isScanModalVisible" @toggleModal="changeScanModal" />

        <TrainingModeModal :visible.sync="trainingModeDialogOpen" @toggleModal="trainingModeDialogOnClose" />
        <SettingsModal :visible.sync="isSettingModalVisible" @toggleModal="toggleSettings" />
        <TradePlannerModal :visible.sync="isTradeModalVisible" @toggleModal="toggleTradeModal" />
        <TradePlannerStepperDialog :visible.sync="tradePlannerSteper" @onClose="updateTradePlannerStepper(false)" />
        <SavedScanModal :visible.sync="favouriteScan" @toggleModal="toggleFavScanModal" />


        <LoginModal :visible.sync="loginModalOpen" @toggleModal="loginModalClose" />
        <SignUpModal :visible.sync="isAuthModal" />
        <ProfileModal :visible.sync="isProfileModalVisible" @toggleModal="changeProfileModal" />

    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex'
import config from '../../config';

import ScanModal from '../Modals/ScanToolbox/ScanModal.vue'
import LoginModal from '../Modals/Auth/LoginModal.vue'
import SignUpModal from '../Modals/Auth/SignUpModal.vue'
import ProfileModal from '../Modals/Auth/ProfileModal.vue'
import TrainingModeModal from '../Modals/TrainingModeModal.vue'
import SettingsModal from '../Modals/Settings/SettingsModal.vue';
import SavedScanModal from '../Modals/SavedScan/SavedScanModal.vue'

import { handleButtonClick } from '../../handleRestrictFeature';
import TradePlannerModal from '../Modals/TradePlanner/TradePlannerModal.vue';
import TradePlannerStepperDialog from '../Modals/TradePlanner/TradePlannerStepperDialog.vue';
import CustomButton from '../../baseComponents/CustomButton.vue';
import InputSwitch from 'primevue/inputswitch';
import UserCircleSvg from './UserCircleSvg.vue';
import { tourRef } from '../../utils/tourGuide';

export default {
    name: 'ChartFeaturesGroup',
    components: {
        CustomButton,
        ///Authentication Modal
        LoginModal,
        SignUpModal,

        ///new
        SettingsModal,
        TradePlannerModal,
        ScanModal,
        ProfileModal,
        TrainingModeModal,
        TradePlannerStepperDialog,
        SavedScanModal,
        UserCircleSvg
    },
    data() {
        return {
            friday_broadcast: config.FRIDAY_BROADCAST_LINK,
            support_email: config.SUPPORT_EMAIL,

            // open: false,
            favouriteScan: false,
            ///Authentication

            //new
            training_room_link: config.TRANING_ROOM_LINK,
            isScanModalVisible: false,
            trainingModeDialogOpen: false,
            isSettingModalVisible: false,
            isTradeModalVisible: false,

            loginModalOpen: false,
            isProfileModalVisible: false,

            arrowIcon: 'pi pi-arrow-left',

            themeSwitch: false, // Initialize the value for the switch
            themeSwitchAllowed: true, // Define whether the switch is enabled
            originalHide: null

        }
    },
    computed: {
        ...mapGetters([
            'themePrimaryColor',
            'themeFontColor',
            'isTrainingMode',
            'themeSettings',
            'getUserId',
            'scrollRight',
            'isAuthModal',
            'tradePlannerSteper',
            'tourStep'
        ]),
        scanButtonSet() {
            return [
                {
                    label: 'Scans',
                    icon: 'pi pi-compass',
                    buttonClass: '',
                    disabled: this.isTrainingMode,
                    command: () => {
                        this.changeScanModal(true)
                    }
                },
                {
                    label: 'Saved',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    disabled: this.isTrainingMode,
                    icon: 'pi pi-save',
                    command: () => {
                        this.handleButtonClick(this.toggleFavScanModal, true)
                    }
                }
            ]
        },
        otherButtonSet() {
            return [
                {
                    label: 'Trading Room',
                    isSvgIcon: true,
                    svgClass: [`custom-btn-primary ${'Rocket'}`],
                    class: 'Rocket svg-icon',
                    buttonClass: 'p-button-light toptool-bold-font full-text-btn',
                    disabled: false,
                    command: () => {
                        this.openNewTab()
                    }
                }
            ]
        },
        dropdownAllButtonSet() {
            return [
                {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    isUserMenu: true,
                    buttonClass: 'p-button-secondary p-button-outlined',
                    class: 'user-menu-profile',
                    disabled: false,
                    command: () => {
                        this.changeProfileModal(true)
                    }
                },
                {
                    label: 'Settings',
                    icon: 'pi pi-cog',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    class: 'user-menu-settings',
                    disabled: false,
                    command: () => {
                        this.handleButtonClick(this.toggleSettings, true)
                    }
                },
                {
                    label: 'Dark Mode',
                    icon: 'pi pi-moon',
                    class: 'my-custom-switch',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    disabled: false,
                    command: () => {
                        this.handleButtonClick(this.checkDarkMode)
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Trade Planner',
                    icon: 'pi pi-graduation-cap',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    class: 'user-menu-trade-plan',
                    disabled: false,
                    command: () => {
                        this.handleButtonClick(this.toggleTradeModal, true)
                    }
                },
                {
                    label: 'Training Mode',
                    isSvgIcon: true,
                    svgClass: `custom-btn-primary ${'TrainingMode'}`,
                    class: this.isTrainingMode ? 'TrainingMode svg-icon activeTrainingItem' : 'TrainingMode svg-icon',
                    buttonClass: !this.isTrainingMode ? 'p-button-secondary p-button-outlined' : '',
                    class: 'user-menu-training',
                    disabled: false,
                    command: () => {
                        this.handleButtonClick(this.onClickTrainingMode)
                    }
                },
                {
                    label: 'CSV Export',
                    icon: 'pi pi-download',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    class: 'user-menu-csv',
                    disabled: false,
                    command: () => { }
                },
                {
                    separator: true
                },
                {
                    label: 'Friday Broadcast',
                    icon: 'pi pi-play-circle',
                    buttonClass: 'p-button-secondary p-button-outlined',
                    class: 'user-menu-friday',
                    disabled: false,
                    command: () => { this.handleButtonClick(this.openLink) }
                },

                {
                    label: 'Support',
                    icon: 'pi pi-question-circle',
                    buttonClass: !this.isTrainingMode ? 'p-button-secondary p-button-outlined' : '',
                    class: 'user-menu-support',
                    disabled: false,
                    command: () => {
                        const email = this.support_email; // Replace with your email
                        window.location.href = `mailto:${email}`;
                    }
                },
                {
                    label: 'Tutorial',
                    icon: 'pi pi-map',
                    buttonClass: !this.isTrainingMode ? 'p-button-secondary p-button-outlined' : '',
                    class: 'user-menu-tutorial',
                    disabled: false,
                    command: () => {
                        this.handleButtonClick(this.startTour);
                    }
                },
                {
                    separator: true
                },
                {
                    label: this.getUserId ? 'Logout' : 'Login',
                    icon: this.getUserId ? 'pi pi-sign-out' : 'pi pi-sign-in',
                    buttonClass: !this.isTrainingMode ? 'p-button-secondary p-button-outlined' : '',
                    class: 'user-menu-auth',
                    disabled: false,
                    command: () => {
                        this.getUserId ? this.logoutAndNavigate() : this.logInRoute()
                    }
                },


            ]
        },
        dropdownButtonSet() {
            return this.getUserId ? this.dropdownAllButtonSet : this.dropdownAllButtonSet.filter(x => !x.isUserMenu)
        },

    },
    methods: {
        handleButtonClick,
        openNewTab() {
            window.open(this.training_room_link, '_blank');
        },
        changeScanModal(val) {
            this.isScanModalVisible = val
        },
        loginModalClose() {
            this.loginModalOpen = false
        },
        changeProfileModal(val) {
            this.isProfileModalVisible = val
        },
        logoutAndNavigate() {
            localStorage.removeItem('state')
            localStorage.removeItem('stripeSession')
            localStorage.removeItem('GuruRequests')
            localStorage.removeItem('ScanRequests')
            localStorage.removeItem('themeDarkModeSave')
            this.$store.commit('RESET_STATE', true)
            location.reload()
        },
        Scroll() {
            if (this.scrollRight == true) {
                document.getElementById("right-container").style.display = 'block '
                document.getElementById("left-container").style.width = '50%'
                this.$store.commit('SCROLL_RIGHT', false)
                this.arrowIcon = 'pi pi-arrow-right'
            }
            else {
                document.getElementById("right-container").style.display = 'none '
                this.$store.commit('SCROLL_RIGHT', true)
                this.arrowIcon = 'pi pi-arrow-left'

            }
            // content.scrollLeft += 80;
        },
        startTour() {
            if (this.$tours[tourRef.TOUR_REF]) {
                this.handleButtonClick(this.startTourFunction());
            }
        },
        startTourFunction() {
            this.$tours[tourRef.TOUR_REF].start();
            this.setTourStep(0);
        },

        ...mapActions([
            'updateTrainingModeState',
            'toggleDarkMode',
            'enterThemehoverColor',
            'exitElementColor',
            'updateTradePlannerStepper',
            'setTourStep'
        ]),
        onClickTrainingMode() {
            if (this.isTrainingMode) {
                return this.updateTrainingModeState({
                    state: !this.isTrainingMode,
                })
            }

            this.trainingModeDialogOpen = !this.trainingModeDialogOpen
        },
        trainingModeDialogOnClose() {
            this.trainingModeDialogOpen = false
        },
        toggleSettings(val) {
            this.isSettingModalVisible = val
        },
        checkDarkMode() {
            this.toggleDarkMode(this.themeSettings.id).then((d) => {
            })
        },

        logInRoute() {
            this.loginModalOpen = true
        },
        openLink() {
            window.open(this.friday_broadcast, '_blank');
        },
        toggleTradeModal(val) {
            this.isTradeModalVisible = val
        },
        toggleFavScanModal(val) {
            this.favouriteScan = val
        },
        toggleDropdowneMenu(event) {
            this.$refs.dropdownMenu.toggle(event);

            this.$nextTick(() => {
                this.addInputSwitchToTheme(this.$refs.dropdownMenu)
            });
            this.tourNextStep()
        },


        addInputSwitchToTheme(menuRef) {
            const themeDiv = document.querySelector('.my-custom-switch .p-menuitem-link'); // Find the target div

            if (themeDiv) {
                // Create a container for the InputSwitch
                const existingSwitch = themeDiv.querySelector('.p-inputswitch');
                if (!existingSwitch) {
                    const element = menuRef.$el;
                    if (element) {
                        const currentLeft = parseInt(window.getComputedStyle(element).left, 10);
                        const newLeft = currentLeft - 30; // Decrease 25px
                        element.style.left = `${newLeft}px`;
                    }

                    const container = document.createElement('div');
                    themeDiv.appendChild(container);

                    // Dynamically create and mount the PrimeVue InputSwitch using a render function
                    new Vue({
                        el: container,
                        data: {
                            themeSwitch: this.themeSwitch, // Link to parent data
                            themeSwitchAllowed: this.themeSwitchAllowed,
                        },
                        render(h) {
                            return h(InputSwitch, {
                                props: {
                                    value: this.themeSwitch,
                                    disabled: !this.themeSwitchAllowed,
                                },
                                on: {
                                    input: (value) => {
                                        this.themeSwitch = value;
                                    },
                                },
                                style: {
                                    margin: '0 0 0 1.5rem',
                                },

                            });
                        },
                    });
                }
            } else {
                console.error('No element with the class "theme" was found.');
            }
        },
        tourNextStep(time = 300) {
            if (this.$tours[tourRef.TOUR_REF].currentStep > 0) {

                setTimeout(() => {
                    this.setTourStep(this.$tours[tourRef.TOUR_REF].currentStep + 1)
                    this.$tours[tourRef.TOUR_REF].nextStep();
                    this.originalHide = this.$refs.dropdownMenu.hide;
                    this.$refs.dropdownMenu.hide = () => { };
                }, time);
            }
        },
    },
    watch: {
        themeSettings(newVal) {
            if (newVal.id === 'dark') {
                this.themeSwitch = true
            }
            else {
                this.themeSwitch = false
            }

        },
        tourStep(val) {
            if (val != -1 && this.scrollRight == true) {
                this.Scroll()
            }
            let userMenuComplete = this.$tours[tourRef.TOUR_REF]?.steps[val]?.params?.userMenuComplete

            if ((userMenuComplete == true || val == -1) && this.originalHide) {
                this.$refs.dropdownMenu.hide = this.originalHide;
                this.originalHide = null;
                setTimeout(() => {
                    this.$refs.dropdownMenu.hide();
                }, 300);
            }
        },

    }
}
</script>

<style>
.settings-group {
    background-color: #555;
    display: flex;
    margin-left: 5px;
    border-width: 2px;
    border-radius: 5px;
    color: white;
}

.feature_menu {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media screen and (max-width: 944px) {
    #settings-group-header {
        display: none;
    }

    #responsiveTab {
        display: flex;
    }
}

.right-tool-btn .p-button.p-button-icon-only {
    padding: 0.5rem 1.5rem;
}
</style>