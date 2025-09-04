import Overlays from 'tvjs-overlays'

//--- custom chart overlays
import Bars from 'ChartTypes/Bars'
import Candles from 'ChartTypes/Candles'
import HeikenAshi from 'ChartTypes/HeikenAshi'
import LineChart from 'ChartTypes/LineChart'
import Kagi from 'ChartTypes/Kagi'
import PnF from 'ChartTypes/PnF'
import UpAndDown from 'ChartTypes/UpAndDown'
import BarTrend from 'ChartTypes/BarTrend'
import CompareChart from 'ChartTypes/CompareChart'
import CompareChartMain from 'ChartTypes/CompareChartMain'
import CompareChartSub from 'ChartTypes/CompareChartSub'

//--- custom indicator overlays
import VolumeOBV from 'Indicators/VolumeOBV'
import MACD from 'Indicators/MACD'
import SMAOBV from 'Indicators/SMAOBV'
import RS from 'Indicators/RS'
import BB from 'Indicators/BB'
import ATR from 'Indicators/ATR'
import SMAVolume from 'Indicators/SMAVolume'
import OBVVolume from 'Indicators/OBVVolume'
import SMA from 'Indicators/SMA'
import TCI from 'Indicators/TCI'
import XMA from 'Indicators/XMA'
import SWMA from 'Indicators/SWMA'
import WMA from 'Indicators/WMA'
import VWAP from 'Indicators/VWAP'
import RVM from 'Indicators/RVM'
import Stoch from 'Indicators/Stoch'
import Value from 'Indicators/Value'
import Ichi from 'Indicators/Ichi'
import DarvasBox from './indicators/DarvasBox'
import ChartPatterns from './indicators/ChartPatterns'
import Spline from './indicators/Spline'
import SplineExt from './indicators/SplineExt'
import Splitters from './indicators/Splitters'
import GuppyMMA from './indicators/GuppyMMA.vue'

//--- custom tools overlays
import FibonacciRetrace from 'Tools/FibonacciRetrace'
import FibonacciTime from 'Tools/FibonacciTime'
import HLineTool from 'Tools/HLineTool'
import TrendLineTool from 'Tools/TrendLine'
import HeadShoulderTool from 'Tools/HeadShoulderTool'
import ArcTool from 'Tools/ArcTool'
import ChannelTool from 'Tools/ChannelTool'
import TradeVisualizerTool from 'Tools/TradeVisualizerTool'
import RectangleTool from 'Tools/RectangleTool'
import TrailingStopTool from 'Tools/TrailingStopTool'
import TextTool from 'Tools/TextTool'
import EmojiTool from 'Tools/EmojiTool'
import RangeTool from 'Tools/RangeTool'
import BrushTool from 'Tools/BrushTool'

export default {
  //--- default overlays
  ...Overlays,
  //--- chart types
  Bars,
  Candles,
  HeikenAshi,
  LineChart,
  Kagi,
  PnF,
  BarTrend,
  UpAndDown,
  CompareChart,
  CompareChartMain,
  CompareChartSub,
  Spline,
  Ichi,
  SplineExt,
  Splitters,
  GuppyMMA,
  //--- indicators
  VolumeOBV,
  MACD,
  SMAOBV,
  SMAVolume,
  OBVVolume,
  TCI,
  XMA,
  WMA,
  SWMA,
  SMA,
  VWAP,
  Value,
  Stoch,
  DarvasBox,
  ChartPatterns,
  RS,
  RVM,
  BB,
  ATR,
  //--- tools
  FibonacciRetrace,
  FibonacciTime,
  TrendLineTool,
  HeadShoulderTool,
  HLineTool,
  ChannelTool,
  TradeVisualizerTool,
  RectangleTool,
  TrailingStopTool,
  TextTool,
  EmojiTool,
  RangeTool,
  ArcTool,
  BrushTool,
}
