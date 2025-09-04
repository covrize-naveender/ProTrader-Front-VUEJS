<template>
  <div class="tv-floating-toolbar tv-grouped-floating-toolbar ui-draggable" data-name="drawing-toolbar" :style="style"
    ref="win">
    <div class="tv-floating-toolbar__widget-wrapper">
      <div class="tv-floating-toolbar__drag js-drag ui-draggable-handle" @mousedown="onMouseDown">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 12" width="8" height="12" fill="currentColor">
          <rect width="2" height="2" rx="1"></rect>
          <rect width="2" height="2" rx="1" y="5"></rect>
          <rect width="2" height="2" rx="1" y="10"></rect>
          <rect width="2" height="2" rx="1" x="6"></rect>
          <rect width="2" height="2" rx="1" x="6" y="5"></rect>
          <rect width="2" height="2" rx="1" x="6" y="10"></rect>
        </svg>
      </div>
      <div class="tv-floating-toolbar__content js-content"></div>
      <div class="floating-toolbar-react-widgets">
        <!-- ----------------------------------color  ------------------------------------------------------->
        <div class="floating-toolbar-react-widgets__button color-button apply-common-tooltip" data-role="button"
          data-name="line-tool-color" style="position: relative" v-if="settingsList && settingsList.includes('color')">
          <div class="wrap-2EG6_6QR">
            <span class="icon-2EG6_6QR">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="none">
                <path stroke="currentColor"
                  d="M1.5 11.5l-.7.7a1 1 0 0 0-.3.71v3.59h3.59a1 1 0 0 0 .7-.3l.71-.7m-4-4l9-9m-9 9l2 2m2 2l9-9m-9 9l-2-2m11-7l1.3-1.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.3 1.3m4 4l-4-4m-7 11l9-9">
                </path>
              </svg>
            </span>
            <div class="colorBg-2EG6_6QR">
              <div class="selected-color-bar" :style="selectedColorStyle"></div>
            </div>
          </div>
          <color-picker v-model="selectedColor" invisibleBackground style="position: absolute" />
        </div>

        <!-- line color -->
        <div class="floating-toolbar-react-widgets__button color-button apply-common-tooltip" data-role="button"
          data-name="line-tool-color" style="position: relative"
          v-if="settingsList && settingsList.includes('lineColor')">
          <div class="selected-line-color" :style="selectedLineColorStyle"></div>
          <color-picker v-model="selectedLineColor" invisibleBackground style="position: absolute" />
        </div>

        <!-- line width -->

        <!-- ------ color 2- --------------------------------  -->
        <div class="floating-toolbar-react-widgets__button color-button apply-common-tooltip" data-role="button"
          data-name="line-tool-color" style="position: relative"
          v-if="settingsList && settingsList.includes('borderColor')">
          <div class="wrap-2EG6_6QR">
            <span class="icon-2EG6_6QR">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="none">
                <path stroke="currentColor"
                  d="M1.5 11.5l-.7.7a1 1 0 0 0-.3.71v3.59h3.59a1 1 0 0 0 .7-.3l.71-.7m-4-4l9-9m-9 9l2 2m2 2l9-9m-9 9l-2-2m11-7l1.3-1.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.3 1.3m4 4l-4-4m-7 11l9-9">
                </path>
              </svg>
            </span>
            <div class="colorBg-2EG6_6QR">
              <div class="selected-color-bar" :style="selectedBorderColorStyle"></div>
            </div>
          </div>
          <color-picker v-model="selectedBorderColor" invisibleBackground style="position: absolute" />
        </div>

        <!-- -------------------------------------line width ---------------------------------------->
        <div class="floating-toolbar-react-widgets__button button-1SoiPS-f apply-common-tooltip" title="Line tool width"
          data-role="button" data-name="line-tool-width" style="position: relative"
          v-if="settingsList && settingsList.includes('lineWidth')" @click="toggleLineWidth">
          <p-menu class="tool-menu tool-text-menu" ref="lineWidthMenu" :model="lineWidthMenu" :popup="true"
            appendTo="body" />
          <div>
            <div class="buttonWrap-3Te2Sp8a">
              <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 1" width="18" height="1">
                  <rect width="18" height="1" fill="currentColor" rx=".5"></rect>
                </svg></span>
              <div class="buttonLabel-3Te2Sp8a">{{ selectedLineWidth }}px</div>
            </div>
          </div>
        </div>

        <!-- font size -->
        <div class="floating-toolbar-react-widgets__button button-1SoiPS-f apply-common-tooltip" title="Line tool width"
          data-role="button" data-name="line-tool-width" style="position: relative"
          v-if="settingsList && settingsList.includes('fontSize')" @click="toggleFontSize">
          <p-menu class="tool-menu tool-text-menu" ref="fontSizeMenu" :model="fontSizeMenu" :popup="true"
            appendTo="body" />
          <div>
            <div class="buttonWrap-3Te2Sp8a">
              <div class="buttonLabel-3Te2Sp8a">{{ selectedFontSize }}px</div>
            </div>
          </div>
        </div>

        <!-- line style -->
        <div class="floating-toolbar-react-widgets__button button-1SoiPS-f apply-common-tooltip" title="Style"
          data-role="button" data-name="style" style="position: relative"
          v-if="settingsList && settingsList.includes('lineStyle')" @click="toggleLineStyle">
          <p-menu class="tool-menu" ref="lineStyleMenu" :model="lineStyleMenu" :popup="true" appendTo="body"
            style="color: blue;" />
          <span>
            <solid-line v-if="selectedLineStyle == 'solid'" />
            <dashed-line v-if="selectedLineStyle == 'dashed'" />
            <dotted-line v-if="selectedLineStyle == 'dotted'" />
          </span>
        </div>

        <!-- line head style -->
        <div class="floating-toolbar-react-widgets__button button-1SoiPS-f apply-common-tooltip" title="Line Head Style"
          data-role="button" data-name="line-head-style" style="position: relative"
          v-if="settingsList && settingsList.includes('lineHeadStyle')" @click="toggleLineHeadStyle">
          <p-menu class="tool-menu" ref="lineHeadStyleMenu" :model="lineHeadStyleMenu" :popup="true" appendTo="body" />
          <div style="text-align: center">
            <arrow-line v-if="selectedLineHeadStyle === 'arrow'" />
            <solid-line v-if="selectedLineHeadStyle === 'normal'" />
            <div style="margin-top: -15px">
              {{ selectedLineHeadStyle }}
            </div>
          </div>
        </div>

        <div data-role="button"
          class="floating-toolbar-react-widgets__button button-2YcRd2gv button-2Vpz_LXc apply-common-tooltip isInteractive-2Vpz_LXc"
          title="Settings" data-name="settings" v-if="settingsList && settingsList.includes('settings')"
          @click="showTextInputDialog = !showTextInputDialog">
          <span class="icon-2Vpz_LXc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"
              fill="none">
              <path fill="currentcolor" fill-rule="evenodd" clip-rule="evenodd"
                d="M13 5.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5V7.05l.4.09c.9.18 1.73.53 2.46 1.02l.34.23.29-.3.81-.8c.2-.2.52-.2.71 0l.7.7.36-.35-.35.35c.2.2.2.51 0 .7l-.82.82-.29.29.23.34c.49.73.84 1.57 1.02 2.46l.08.4H22.5c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5H20.95l-.09.4c-.18.9-.53 1.73-1.02 2.46l-.23.34.3.29.8.81c.2.2.2.52 0 .71l-.7.7a.5.5 0 0 1-.7 0l-.82-.8-.29-.3-.34.23c-.73.49-1.57.84-2.46 1.02l-.4.08V22.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V20.95l-.4-.09a6.96 6.96 0 0 1-2.46-1.02l-.34-.23-.29.3-.81.8.35.36-.35-.35a.5.5 0 0 1-.71 0l-.7-.71a.5.5 0 0 1 0-.7l-.36-.36.35.35.82-.81.29-.29-.23-.34a6.96 6.96 0 0 1-1.02-2.46l-.08-.4H5.5a.5.5 0 0 1-.5-.5v-1c0-.28.22-.5.5-.5H7.05l.09-.4c.18-.9.53-1.73 1.02-2.46l.23-.34-.3-.29-.8-.81a.5.5 0 0 1 0-.71l.7-.7c.2-.2.51-.2.7 0l.82.8.29.3.34-.23a6.96 6.96 0 0 1 2.46-1.02l.4-.08V5.5zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.75c-.73.2-1.43.48-2.06.86l-.54-.53a1.5 1.5 0 0 0-2.12 0l-.7.7a1.5 1.5 0 0 0 0 2.12l.53.54A7.95 7.95 0 0 0 6.25 12H5.5c-.83 0-1.5.67-1.5 1.5v1c0 .83.67 1.5 1.5 1.5h.75c.2.73.48 1.43.86 2.06l-.53.54a1.5 1.5 0 0 0 0 2.12l.7.7a1.5 1.5 0 0 0 2.12 0l.54-.53c.63.38 1.33.67 2.06.86v.75c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5v-.75a7.95 7.95 0 0 0 2.06-.86l.54.53a1.5 1.5 0 0 0 2.12 0l.7-.7a1.5 1.5 0 0 0 0-2.12l-.53-.54c.38-.63.67-1.33.86-2.06h.75c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-.75a7.95 7.95 0 0 0-.86-2.06l.53-.54a1.5 1.5 0 0 0 0-2.12l-.7-.7a1.5 1.5 0 0 0-2.12 0l-.54.53A7.95 7.95 0 0 0 16 6.25V5.5c0-.83-.67-1.5-1.5-1.5h-1zM12 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm2-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z">
              </path>
            </svg></span>
        </div>

        <div data-role="button"
          class="floating-toolbar-react-widgets__button button-2YcRd2gv button-2Vpz_LXc apply-common-tooltip isInteractive-2Vpz_LXc"
          title="Settings" data-name="settings" v-if="toolType == 'FibonacciRetrace'"
          @click="showFibtDialog = !showFibtDialog">
          <span class="icon-2Vpz_LXc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"
              fill="none">
              <path fill="currentcolor" fill-rule="evenodd" clip-rule="evenodd"
                d="M13 5.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5V7.05l.4.09c.9.18 1.73.53 2.46 1.02l.34.23.29-.3.81-.8c.2-.2.52-.2.71 0l.7.7.36-.35-.35.35c.2.2.2.51 0 .7l-.82.82-.29.29.23.34c.49.73.84 1.57 1.02 2.46l.08.4H22.5c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5H20.95l-.09.4c-.18.9-.53 1.73-1.02 2.46l-.23.34.3.29.8.81c.2.2.2.52 0 .71l-.7.7a.5.5 0 0 1-.7 0l-.82-.8-.29-.3-.34.23c-.73.49-1.57.84-2.46 1.02l-.4.08V22.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V20.95l-.4-.09a6.96 6.96 0 0 1-2.46-1.02l-.34-.23-.29.3-.81.8.35.36-.35-.35a.5.5 0 0 1-.71 0l-.7-.71a.5.5 0 0 1 0-.7l-.36-.36.35.35.82-.81.29-.29-.23-.34a6.96 6.96 0 0 1-1.02-2.46l-.08-.4H5.5a.5.5 0 0 1-.5-.5v-1c0-.28.22-.5.5-.5H7.05l.09-.4c.18-.9.53-1.73 1.02-2.46l.23-.34-.3-.29-.8-.81a.5.5 0 0 1 0-.71l.7-.7c.2-.2.51-.2.7 0l.82.8.29.3.34-.23a6.96 6.96 0 0 1 2.46-1.02l.4-.08V5.5zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.75c-.73.2-1.43.48-2.06.86l-.54-.53a1.5 1.5 0 0 0-2.12 0l-.7.7a1.5 1.5 0 0 0 0 2.12l.53.54A7.95 7.95 0 0 0 6.25 12H5.5c-.83 0-1.5.67-1.5 1.5v1c0 .83.67 1.5 1.5 1.5h.75c.2.73.48 1.43.86 2.06l-.53.54a1.5 1.5 0 0 0 0 2.12l.7.7a1.5 1.5 0 0 0 2.12 0l.54-.53c.63.38 1.33.67 2.06.86v.75c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5v-.75a7.95 7.95 0 0 0 2.06-.86l.54.53a1.5 1.5 0 0 0 2.12 0l.7-.7a1.5 1.5 0 0 0 0-2.12l-.53-.54c.38-.63.67-1.33.86-2.06h.75c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-.75a7.95 7.95 0 0 0-.86-2.06l.53-.54a1.5 1.5 0 0 0 0-2.12l-.7-.7a1.5 1.5 0 0 0-2.12 0l-.54.53A7.95 7.95 0 0 0 16 6.25V5.5c0-.83-.67-1.5-1.5-1.5h-1zM12 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm2-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z">
              </path>
            </svg></span>
        </div>

        <!-- v-on:keyup.enter="mymethod()" -->
        <!-- @mousemove="mymethod()" -->
        <div :style="[{ cursor: 'pointer' }]" data-role="button" @click="showSettingProps"
          class="floating-toolbar-react-widgets__button remove-button button-2Vpz_LXc apply-common-tooltip isInteractive-2Vpz_LXc"
          title="Settings" data-name="Settings" v-if="showTrailingStop">
          <span>

            <i class="pi pi-cog"></i>
          </span>
        </div>

        <div :style="[{ cursor: 'pointer' }]" data-role="button" @click="onRemoveTool"
          class="floating-toolbar-react-widgets__button remove-button button-2Vpz_LXc apply-common-tooltip isInteractive-2Vpz_LXc"
          title="Remove" data-name="remove">
          <span class="icon-2Vpz_LXc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28"
              height="28">
              <path fill="currentColor" fill-rule="evenodd"
                d="M11.5 6a.5.5 0 0 0-.5.5V8h6V6.5a.5.5 0 0 0-.5-.5h-5zM18 8V6.5c0-.83-.67-1.5-1.5-1.5h-5c-.83 0-1.5.67-1.5 1.5V8H5.5a.5.5 0 0 0 0 1H7v12.5A2.5 2.5 0 0 0 9.5 24h9a2.5 2.5 0 0 0 2.5-2.5V9h1.5a.5.5 0 0 0 0-1H18zm2 1H8v12.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V9zm-8.5 3c.28 0 .5.22.5.5v7a.5.5 0 0 1-1 0v-7c0-.28.22-.5.5-.5zm5.5.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z">
              </path>
            </svg></span>
        </div>
      </div>
    </div>

    <FibonacciSettings :visible.sync="showFibtDialog" @onClose="showFibtDialog = false" @ok="onUpdateFibonacci" :get-settings="getSettings" :change-settings="changeSettings"/>

    <text-settings :visible.sync="showTextInputDialog" @onClose="showTextInputDialog = false" @ok="onUpdateText"
      :change-settings="changeSettings" :get-settings="getSettings" :initialText="getSettings('text')" />
  </div>
  <!--  </window>-->
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import {
  updateDrawingDataV2
} from '@/services/drawing'
import { mapActions, mapGetters } from 'vuex'
import { chartEvents } from "../../chartEvents"
import Overlays from "../../overlays"
import { actionsubType, actionType } from '../../utils/action.js'
import { debounce } from "../../utils/helper"
import Drag from '../shared/drag'
import ArrowLine from './ArrowLine.vue'
import DashedLine from './DashedLine.vue'
import DottedLine from './DottedLine.vue'
import FibonacciSettings from './FibonacciSettings.vue'
import SolidLine from './SolidLine.vue'
import TextSettings from './TextSettings.vue'
import { fontSizeMenuOption, lineHeadStyleMenuOption, lineStyleMenuOption, lineWidthMenuOption } from './toolMenu.js'
import Utils from './utils.js'

export default {
  name: 'ToolSettings',
  mixins: [Drag],
  props: ['id', 'main', 'dc', 'tv', 'data'],
  components: {
    SolidLine,
    DashedLine,
    DottedLine,
    ArrowLine,
    TextSettings,
    FibonacciSettings,
    ColorPicker,
  },
  mounted() {

    this.ww = this.$refs.win.clientWidth
    this.wh = this.$refs.win.clientHeight
    const { x, y } = this.$props.data.lastLocation
    this.x = x || this.tvw * 0.05
    this.y = y || this.tvh * 0.1 - this.wh * 0.5
    this.$store.commit("SET_DRAWING_ID", this.$props.id)
    window.addEventListener('resize', this.onResize);
    this.updateDimensions();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  data() {
    return {
      ww: 0,
      wh: 0,
      x: 0,
      y: 0,
      showTextInputDialog: false,
      showFibtDialog: false,
      lineWidthMenu: lineWidthMenuOption.map((item) => {
        return {
          label: item.label,
          command: () => {
            this.selectedLineWidth = item.width
          }
        }
      }),
      fontSizeMenu: fontSizeMenuOption.map((item) => {
        return {
          label: item.label,
          command: () => {
            this.selectedFontSize = item.fontSize
          }
        }
      }),
      lineStyleMenu: lineStyleMenuOption.map((item) => {
        return {
          label: item.label,
          class: item.class,
          command: () => {
            this.selectedLineStyle = item.linestyle
          }
        }
      }),
      lineHeadStyleMenu: lineHeadStyleMenuOption.map((item) => {
        return {
          label: item.label,
          class: item.class,
          command: () => {
            this.selectedLineHeadStyle = item.lineHeadStyle
          }
        }
      }),
    }
  },
  computed: {
    ...mapGetters(['themeDarkMode', 'getUserId', 'themeFontColor', 'multiChartSymbol', 'selectedTab', 'getLayout', 'isFullScreen', 'multiDrawingData']),
    getSymbolName() {
      return this.multiChartSymbol[this.selectedTab]?.symbol
    },
    toolType(){
      return this.$props.data.tool.type
    },
    chartIndex() {
      return this.dc.data.chart.chartIndex
    },
    showTrailingStop() {
      return this.$props?.data?.tool?.type === "TrailingStopTool"
    },
    selectedColor: {
      get() {
        return this.getSettings('color')
      },
      set(value) {
        this.changeSettings({
          color: value,
        })
      },
    },
    selectedLineColor: {
      get() {
        return this.getSettings('lineColor')
      },
      set(value) {
        this.changeSettings({
          lineColor: value,
        })
      },
    },
    selectedBorderColor: {
      get() {
        return this.getSettings('borderColor')
      },
      set(value) {
        this.changeSettings({
          borderColor: value,
        })
      },
    },
    selectedLineWidth: {
      get() {
        return this.getSettings('lineWidth')
      },
      set(value) {
        this.changeSettings({
          lineWidth: value,
        })
      },
    },
    selectedLineStyle: {
      get() {
        return this.getSettings('lineStyle')
      },
      set(value) {
        this.changeSettings({
          lineStyle: value,
        })
      },
    },
    selectedFontSize: {
      get() {
        return this.getSettings('fontSize')
      },
      set(value) {
        this.changeSettings({
          fontSize: value,
        })
      },
    },
    selectedLineHeadStyle: {
      get() {
        return this.getSettings('lineHeadStyle')
      },
      set(value) {
        this.changeSettings({
          lineHeadStyle: value,
        })
      },
    },
    selectedColorStyle() {
      return { backgroundColor: this.getSettings('color') }
    },
    selectedLineColorStyle() {
      return { backgroundColor: this.getSettings('lineColor') }
    },
    selectedBorderColorStyle() {
      return { backgroundColor: this.getSettings('borderColor') }
    },
    style() {
      this.setLastLocation()
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
    },
    tvw() {
      return this.$props.tv.width
    },
    tvh() {
      return this.$props.tv.height
    },
    sett() {
      return this.$props.data.tool.settings
    },
    tool() {
      return this.$props.data.tool
    },
    settingsList() {
      return this.sett.settingsList
    },
    openDialog() {
      return this.$props.data.openDialog
    },
  },
  methods: {
    ...mapActions(['deleteDrawing']),
    ...mapActions('action',['setUndoAction']),
    toggleLineWidth(event) {
      this.$refs.lineWidthMenu.toggle(event);
    },
    toggleFontSize(event) {
      this.$refs.fontSizeMenu.toggle(event);
    },
    toggleLineStyle(event) {
      this.$refs.lineStyleMenu.toggle(event);
    },
    toggleLineHeadStyle(event) {
      this.$refs.lineHeadStyleMenu.toggle(event);
    },
    setLastLocation() {
      localStorage.setItem(
        'toolSettingsMetaData',
        JSON.stringify({ x: this.x, y: this.y })
      )
    },
    s2d(str) {
      return Utils.sett2desc(str)
    },
    async onRemoveTool() {
      let res = await this.deleteDrawing({ t: this.dc.data.selected, e: 'onRemoveTool', index: this.chartIndex })

      if (res) {
        // this.dc.del(this.data.tool.id)

        this.$props.main.remove_widget(this.$props.id)
        this.dc.data.selected = ""
      }
    },
    showSettingProps() {
      chartEvents.$emit('updateAndShowTrailingStopModal', this.sett)
    },
    update_sett(k, val) {
      let dcid = this.$props.data.tool.id

      let valN = parseFloat(val)
      if (valN !== valN) valN = val

      this.$props.dc.merge(`${dcid}.settings`, { [k]: valN })
    },
    getSettings(newSettings) {
      return newSettings in this.sett ? this.sett[newSettings] : ''
    },
    changeSettings(newSettings) {
      let currentSettings = {}
      Object.keys(newSettings).map(x => {
       currentSettings[x] = this.getSettings(x)
      })
      
      this.setUndoAction({
          type: actionsubType.DRAWING_PARAM_UPDATE,
          actionType: actionType.DRAWING_ACTION,
          payload: {
            chartIndex: this.chartIndex,
            drawingRef: this.dc.data.selected,
            data: currentSettings
          }
        })
      this.dc.merge(this.dc.data.selected + '.settings', newSettings)
      this.$nextTick(debounce(() => {
        const xx = this.dc.get_one(this.dc.data.selected)
        if (this.getLayout == '1tab' || this.isFullScreen) {
          updateDrawingDataV2({
            data: {
              data: JSON.stringify(xx),
              modeId: xx.settings?.$uuid
              // modeId:xx.settings.modeId
            }, userId: this.getUserId, symbolName: this.getSymbolName,
          })
        }

        if (xx.settings.settingsList) {
          let data = {}
          xx.settings.settingsList.forEach((sett) => {
            data[sett] = newSettings[sett] || xx.settings[sett]
          })
          let overlay_tv = Object.values(Overlays)
          let currentOverlay = overlay_tv.find(d => d.name === xx.type)
          if (currentOverlay) {

            if (currentOverlay.methods.tool) {
              let toolSettings = currentOverlay.methods.tool()
              let toolId = `${xx.type}:${toolSettings.type}`
              let singleTool = this.dc.data.tools.find(d => d.type === toolId)
              if (singleTool) {
                singleTool.settings = { ...singleTool.settings, ...newSettings }
              }

            }
          }
          if (data) {
            localStorage.setItem(xx.type, JSON.stringify(data))
          }
        }

      }))
    },
    onClickColor() {
      this.changeSettings({
        fontColor: 'red',
      })
    },
    onUpdateText(text) {
      this.changeSettings({
        text,
      })
      this.showTextInputDialog = false
    },
    onUpdateFibonacci(text) {
      this.showFibtDialog = false
    },
    onResize() {
      this.updateDimensions();
      this.validatePositionx();
      this.validatePositiony();
    },

    updateDimensions() {
      this.ww = this.$refs.win.clientWidth;
      this.wh = this.$refs.win.clientHeight;
    },

    validatePositionx() {
      if (this.x < 0) this.x = 0;
      else if (this.x > (this.tvw - this.ww)) this.x = this.tvw - this.ww
    },
    validatePositiony() {
      if (this.y < 0) this.y = 0;
      else if (this.y > (this.tvh - this.wh)) this.y = this.tvh - this.wh
    }
  },
  watch: {
    x() {
      this.validatePositionx();
    },
    y() {
      this.validatePositiony();
    },
    openDialog: {
      handler: function (newValue) {
        // setTimeout(() => {
        //   this.showTextInputDialog = newValue
        // }, 100)
      },
      immediate: true,
    },
  },
  filters: {
    /**
     * @param {String} text
     */
    capitalize(text) {

      return text[0].toUpperCase() + text.substring(1)
    },
  },
}
</script>
<style scoped>
.tv-floating-toolbar {
  position: absolute;
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  touch-action: none;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  opacity: 1;
  transition: transform 0.2625s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.2625s cubic-bezier(0.215, 0.61, 0.355, 1);
  /* background-color: #fff; */
  box-shadow: 0 2px 6px hsla(227, 6%, 44%, 0.6);
  border-radius: 6px;
  /*border: 0 solid;*/
  /*border-color: #f0f3fa;*/
  color: #4a4a4a;
  z-index: 21;
  left: 0;
  top: 0;
  pointer-events: all;
  width: max-content;
}

.tv-floating-toolbar__widget-wrapper {
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: #4a4a4a;
  display: flex;
  pointer-events: all;
  border-radius: 6px;
}

.tv-floating-toolbar__drag {
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #b2b5be;
  cursor: grab;
  width: 24px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.tv-floating-toolbar__content {
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: #4a4a4a;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.floating-toolbar-react-widgets {
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: #4a4a4a;
  display: inline-flex;
}

.floating-toolbar-react-widgets__button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  border-left: 1px solid #f0f3fa;
  color: #131722;
}

.color-button {
  -webkit-text-size-adjust: 100%;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  flex: 1 0 auto;
  cursor: default;
  position: relative;
  z-index: 0;
  transition: background-color 0.35s ease, color 60ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  /* border-left: 1px solid #f0f3fa; */
  /* color: #131722; */
}

.remove-button {
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
}

.floating-toolbar-react-widgets__button:hover {
  /* background: rgba(222, 221, 221, 0.78); */
}


.selected-color-bar {
  width: 100%;
  height: 5px;
  border: 0.1px solid black;
}

.selected-line-color {
  width: 100%;
  height: 20%;
  border: 0.1px solid black;
}

.flex {
  display: flex;
  height: 1rem;
  align-items: center;
}
</style>
