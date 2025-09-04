<template>
    <div class="left-sidemenu p-d-flex p-flex-column p-jc-between">
        <div style="overflow-y: auto;overflow-x: hidden;" class="p-mt-4" id="step2">
            <DrawingMenuItem v-for="(menu, index) in menuItems" :key="index" :isDropDown="menu.isDropDown"
                :index="index" :isEmoji="menu.isEmoji" :toolTip="menu.toolTip" :isIcon="menu.isIcon" :icon="menu.icon"
                :dropdownItem="menu.dropdownItem ? menu.dropdownItem : []" :onItemSelect="menu.onClick"
                :svgPath="menu.svgPath" />


            <!-- undo button -->
            <p-button v-tooltip.right="`Undo Action`" icon="pi pi-undo" @click="onClickUndo"
                class="left-sidebar-bottom-btn left-side-bottom-item" :disabled="!(undoActionStore?.length > 0)" />
        </div>
        <div class="p-d-flex p-flex-column">
            <p-button v-for="(menu, index) in menuBottomItems" :key="index" v-tooltip.right="`${menu.toolTip}`"
                :icon="menu.icon" @click="menu.onClick" :class="`${menu.btnClass} left-side-bottom-item`" />
        </div>
        <div v-if="showEmojiBox" :style="divStyle" style="position: absolute;  z-index: 10; margin-left: 0.1rem;">
            <Picker @select="selectEmoji" :show-preview="false" :multiCustom="[]" />
        </div>
        <DarvasBoxDrawing :visible.sync="darvasBoxDrawing" @toggleModal="toggleDarvasBoxDrawingDialog" />
        <TrailingStop v-if="showTrailingStop" :trialingStopData="trialingStopData"
            @hideTrailingStop="trailingStopDialogOnClose" />
        <ChartPropModal :visible.sync="mainChartProps" />
    </div>
</template>

<script>
import ChartAdding from 'Components/ChartAdding'
import { Picker } from 'emoji-mart-vue-2'
import 'emoji-mart-vue-2/css/emoji-mart.css'
import { mapActions, mapGetters } from 'vuex'
import { chartEvents } from '../../chartEvents.js'
import { handleButtonClick } from '../../handleRestrictFeature.js'
import Overlays from '../../overlays'
import DarvasBoxDrawing from '../Modals/DrawingTools/DarvasBoxDrawing.vue'
import TrailingStop from '../Modals/DrawingTools/TrailingStop.vue'
import DrawingMenuItem from './DrawingMenuItem.vue'
import ChartPropModal from '../Modals/ChartPropModal.vue'

export default {
    name: 'LeftSideBar',
    components: {
        Picker,
        DarvasBoxDrawing,
        TrailingStop,
        DrawingMenuItem,
        ChartPropModal
    },
    mixins: [ChartAdding],
    data() {
        return {
            message: '',
            showEmojiBox: false,
            trialingStopData: {},
            showTrailingStop: false,
            darvasBoxDrawing: false,
            trendButtonToggle: false,
            momentumButtonToggle: false,
            volatilityButtonToggle: false,
            toolRemoved: false,
            toolHeight: 0,
            darvasBoxMissing: false,
            //new
            menuItems: [
                {
                    isDropDown: false,
                    svgPath: 'darvas_tool',
                    onClick: () => this.toggleDarvasBoxDrawingDialog(true),
                    toolTip: 'Darvas Box',
                    toolTipMobile: 'Darvas Box',
                    style: 'background-color : red',
                },
                {
                    isDropDown: false,
                    svgPath: 'ruler_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'RangeTool:PriceTime'),
                    toolTip: 'Price Measurement Tool',
                    toolTipMobile: 'Measure Tool',
                    style: 'background-color : red',
                },
                {
                    isDropDown: false,
                    svgPath: 'trend_line_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'TrendLine:Trend'),
                    toolTip: 'Line Tool',
                    toolTipMobile: 'Line Tool',
                    style: 'background-color : blue',
                },
                {
                    isDropDown: false,
                    svgPath: 'horizontal_line_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'HLineTool:Segment'),
                    toolTip: 'Horizontal Line Tool',
                    toolTipMobile: 'Horizontal Tool',
                    style: 'background-color : green',
                },
                {
                    isDropDown: false,
                    svgPath: 'arc_tool',
                    onClick: () => this.handleButtonClick(this.selectDropDownItem, 'ArcTool:Arc', '/images/bottomDark/arc.svg'),
                    toolTip: 'Arc Tool',
                    toolTipMobile: 'Arc Tool',
                    style: 'background-color : blue',
                },
                {
                    isDropDown: false,
                    svgPath: 'head_shoulder_tool',
                    onClick: () => this.handleButtonClick(this.selectDropDownItem, 'HeadShoulderTool:HS', '/images/bottomDark/head-shoulder.svg'),
                    toolTip: 'Head and Shoulder Tool',
                    toolTipMobile: 'Head and Shoulder Tool',
                    style: 'background-color : blue',
                },
                {
                    isDropDown: true,
                    isText: true,
                    toolTip: 'Drawing Tool',
                    toolTipMobile: 'Drawing Tool',
                    isDropDown: true,
                    ref: 'tools',
                    dropdownItem: [
                        {
                            id: 'text',
                            svgPath: 'text_tool',
                            onClick: () => this.handleButtonClick(this.selectDropDownItem, 'TextTool:Label'),
                            toolTip: 'Text Tool',
                            toolTipMobile: 'Text Tool',
                        },
                        {
                            id: 'pencil',
                            svgPath: 'pencil_tool',
                            onClick: () => this.handleButtonClick(this.selectDropDownItem, 'BrushTool:Brush'),
                            toolTip: 'Pencil Tool',
                            toolTipMobile: 'Pencil Tool',
                        },
                    ]
                },

                // {
                //     isDropDown: false,
                //     svgPath: 'text_tool',
                //     onClick: () => this.handleButtonClick(this.selectTool, 'TextTool:Label'),
                //     toolTip: 'Text Tool',
                //     toolTipMobile: 'Text Tool',
                // },
                {
                    isDropDown: false,
                    svgPath: 'rectangle_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'RectangleTool:Shape'),
                    toolTip: 'Box Tool',
                    toolTipMobile: 'Box Tool',
                },
                {
                    isDropDown: false,
                    svgPath: 'parallel_line_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'ChannelTool:Segment'),
                    toolTip: 'Parellel Lines Tool',
                    toolTipMobile: 'Parellel Tool',
                },
                {
                    isDropDown: false,
                    svgPath: 'trade_planner_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'TradeVisualizerTool:PL'),
                    toolTip: 'Trade Visualizer',
                    toolTipMobile: 'Trade Visualizer',
                },
                {
                    isDropDown: false,
                    svgPath: 'fib_retracement_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'FibonacciRetrace:Segment'),
                    toolTip: 'Fibonacci Retracement Tool',
                    toolTipMobile: 'Fibonacci Tool',
                },
                {
                    isDropDown: false,
                    svgPath: 'trailingstop_tool',
                    onClick: () => this.handleButtonClick(this.selectTool, 'TrailingStopTool:PL'),
                    toolTip: 'Trailing Stop',
                    toolTipMobile: 'Trailing Stop',
                },
                {
                    isEmoji: true,
                    isDropDown: false,
                    svgPath: 'emoji_tool',
                    onClick: (index, event) => this.onClickEmoji(index, event),
                    toolTip: 'Emoji Tool',
                    toolTipMobile: 'Emoji Tool',
                },



            ],
            menuBottomItems: [
                {
                    isIcon: true,
                    icon: 'pi pi-trash',
                    isDropDown: false,
                    btnClass: 'p-button-outlined p-button-danger',
                    onClick: () => this.onDeleteButtonClick(),
                    toolTip: 'Delete all Drawing',
                    toolTipMobile: 'Delete all Drawing',
                },
                {
                    isIcon: true,
                    icon: 'pi pi-cog',
                    isDropDown: false,
                    btnClass: 'left-sidebar-bottom-btn',
                    onClick: () => this.$store.commit('MAIN_CHART_PROPS', true),
                    toolTip: 'Chart Prop Settings',
                    toolTipMobile: 'Chart Prop Settings',
                },
            ],
            activeButton: null, // Track which button was clicked
            divStyle: {
                top: '0px', // Position will be calculated dynamically
                left: '0px', // Position will be calculated dynamically
            },
        }
    },
    mounted() {
        this.toolHeight = this.bottomContainerRef?.clientHeight * 0.05
        chartEvents.$on('updateTrailingStopModal', (params) => {
            this.trialingStopData = params
        })
        chartEvents.$on('updateAndShowTrailingStopModal', (params) => {
            this.trialingStopData = params
            this.showTrailingStop = true
        })
        chartEvents.$emit('bindComponentEvent', 'remove-tool', this.onToolRemoved)
    },
    beforeDestroy() {
        chartEvents.$off('updateTrailingStopModal')
    },
    methods: {
        onClickEmoji(index, event) {
            if (this.showEmojiBox) {
                this.showEmojiBox = false
            }
            else {
                this.activeButton = index;
                this.showEmojiBox = true;

                // Get the position of the clicked button
                const buttonRect = event.target.getBoundingClientRect();

                // Calculate the position of the div
                const topPosition = buttonRect.top;
                const leftPosition = buttonRect.right;

                // Check if there is space below the button, if not, position it above
                const availableSpace = window.innerHeight - buttonRect.bottom;
                const divHeight = 340; // Height of the div, you can adjust it as per your content

                const top = availableSpace > divHeight ? topPosition : topPosition - divHeight;
                const left = leftPosition;

                this.divStyle = {
                    top: `${top - (window.innerHeight * 0.05)}px`,
                    left: `${left}px`,
                };
            }

        },
        toggleSideMenu(val) {
            this.$refs[val].toggle(event);
        },
        handleButtonClick,
        selectEmoji(emoji) {
            this.handleButtonClick(this.addEmoji, emoji)
        },
        addEmoji(emoji) {
            this.$store.commit('SET_EMOJI', emoji.native)
            this.selectTool(`EmojiTool:Label`)
        },
        ...mapActions([
            'enterThemehoverColor',
            'exitElementColor',
            'deleteAllDrawing',
            'deleteDrawing',
            'deleteAllDrawingNew'
        ]),
        ...mapActions('action', [
            'onUndoSelect'
        ]),
        selectDropDownItem(tool) {
            this.selectTool(tool)
        },
        trailingStopDialogOnClose() {
            this.showTrailingStop = false
        },
        toggleDarvasBoxDrawingDialog(val) {
            this.darvasBoxDrawing = val
        },
        closeEmpty() {
            this.darvasBoxMissing = false
        },
        darvasBoxNotFound() {
            this.darvasBoxMissing = true
        },
        onDeleteButtonClick() {
            // chartEvents.$emit('onDeleteButtonClick')
            this.deleteAllDrawingNew()

        },
        onDeleteDarvasBox() {
            chartEvents.$emit('onDeleteDarvasBoxDrawing')
        },

        updateStateCharts() {
            const defaultCharts = [
                'trendCharts',
                'momentumCharts',
                'volatilityCharts',
                'volumeCharts'
            ]
            for (const chart of defaultCharts) {

                if (this[chart] && this[chart].selected) {
                    for (const datum of this[chart].data) {
                        if (datum.selected) {
                            this.add_overlay(datum.name)
                        }
                    }
                }
            }
        },
        onToolRemoved() {
            this.toolRemoved = false
        },
        selectTool(toolID) {
            this.showEmojiBox = false
            chartEvents.$emit('generateCustomEvent', 'tool-selected', [toolID])
        },

        add_overlay(
            name,
            gridId,
            updatedProps = undefined,
            dataType = undefined,
            multi_value = false,
            itemId = 0,
            updateRefs = false
        ) {

            const e = { type: name, side: 'auto' }
            let preset = this.get_preset(e.type) || {}
            if (preset.side) e.side = preset.side
            // let onchart = this.chart.data.onchart
            let offchart = this.dc.data.offchart
            let onchart = this.dc.data.onchart



            // Update Preset as per scan
            if (updatedProps) {
                if (dataType === 'object') {
                    for (const key in updatedProps) {
                        if (Object.hasOwnProperty.call(updatedProps, key)) {
                            const element = updatedProps[key]
                            // if(preset.settings[key]){
                            preset.settings[key] = element
                            // }
                        }
                    }
                } else if (dataType === 'string') {
                    preset.settings['length'] = updatedProps
                }
            }

            if (e.side === 'onchart') {
                if (multi_value) {
                    let list = this.$store.state.dc.get(name)
                    let chartObj = list.find((i) => i.id === `onchart.${name}${itemId}`)

                    let data = []
                    let newRef = false
                    if (updateRefs) {
                        newRef = true
                        data = updateRefs[itemId]
                    }
                    // else{
                    if (chartObj) {
                        let newSettings = {
                            settings: { ...chartObj.settings, ...preset.settings },
                        }

                        this.dc.merge(chartObj.id, newSettings)
                        // this.dc.tv.resetChart(true)

                    } else {
                        let multiValChart = {
                            name: preset.name,
                            id: itemId,
                            type: e.type,
                            data: [],
                            settings: preset.settings || {},
                        }

                        this.dc.add('onchart', multiValChart)

                        if (newRef) {
                            this.dc.tv.resetChart(true)
                        }
                    }
                } else {
                    let chartData = onchart.find((indi) => indi.type === e.type)
                    if (chartData) {

                        let newSettings = {
                            settings: { ...chartData.settings, ...preset.settings },
                        }

                        this.dc.merge(chartData.id, newSettings)

                        // this.dc.tv.resetChart(true)
                        return
                    }
                    this.dc.add('onchart', {
                        name: preset.name,
                        type: e.type,
                        data: [],
                        settings: preset.settings || {},
                    })
                }
            } else {
                let chartData = offchart.find((indi) => indi.type === e.type)
                if (chartData) {

                    this.dc.merge(chartData.id, preset)
                    this.dc.tv.resetChart(true)
                    return
                }
                const h = this.avg_grid_h(offchart)

                // construct the new indicator
                const newIndicator = {
                    name: preset.name,
                    type: e.type,
                    data: [],
                    settings: preset.settings || {},
                    grid: { height: h, id: gridId },
                }

                // add the new indi directly if it is a custom grid indicator
                if (gridId) {
                    return this.dc.add('offchart', newIndicator)
                }

                // old indicator list
                const oldList = this.dc.get('offchart').map((ov) => ({
                    name: ov.name,
                    type: ov.type,
                    data: [],
                    settings: ov.settings,
                    grid: ov.grid,
                }))

                // delete all offchart overlays
                this.dc.del('offchart')

                const customGridIndicators = []
                let addRes = null
                for (const indi of oldList) {

                    if (indi.grid.id) {
                        customGridIndicators.push(indi)
                    } else {
                        this.dc.add('offchart', indi)
                    }
                }

                // add the new indi
                this.dc.add('offchart', newIndicator)

                // add the old custom grid indis
                customGridIndicators.forEach((indi) => {

                    this.dc.add('offchart', indi)
                })

                this.addingChartDrawings(e, this)
                // this.$store.commit("CURRENT_OFF_CHART",e.type)
            }
            // this.dc.update_ids()
            // this.chart.update_ids()
        },
        get_preset(type) {
            let proto = this.tradingChart.overlays.find((x) => x.name === type)

            if (proto && proto.methods.meta_info) {
                let meta = proto.methods.meta_info()
                return meta.preset
            }
        },
        avg_grid_h(ovs) {
            if (!ovs.length) return 0.25
            let gh = 0
            for (var ov of ovs) {
                if (ov.grid && typeof ov.grid.height === 'number') {
                    gh += ov.grid.height
                }
            }
            return gh / ovs.length
        },
        onClickUndo() {
            this.onUndoSelect()
        }
    },
    computed: {
        ...mapGetters([
            'dc',
            'tv',
            'scanningIndicators',
            'gurusScanSettings',
            'trendCharts',
            'momentumCharts',
            'volatilityCharts',
            'volumeCharts',
            'plusCharts',
            'chartSettingUpdatedDate',
            'isChartLoading',
            'getSingleIndicator',
            'getMultiIndicator',
            'themeSecondaryColor',
            'themePrimaryColor',
            'themeFontColor',
            'userChartlist',
            'drawingDataList',
            'eventsSettings',
            'chartOverlays',
            'getUserEmail',
            'onlyMatHasAccess',
            'allChartOverlays',
            'mainChartProps',
        ]),
        ...mapGetters('action', ['undoActionStore']),
        chart: function () {
            return this.dc
        },
        tradingChart: function () {
            return this.$store.state.tradingChartReference
        },
        bottomContainerRef() {
            return this.$refs.bottomContainer
        },
    },
    watch: {
        chartSettingUpdatedDate(n, o) {

            if (this.isChartLoading && n > o) {
                this.updateStateCharts()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.left-side-bottom-item {
    margin: 0.4rem 0.8rem;
}
</style>