<script>

import { Overlay } from 'trading-vue-js'
import { mapGetters } from 'vuex';

export default {
  name: 'RVM',
  mixins: [Overlay],
  computed: {
    sett() {
      return this.$props.settings
    },
    color() {
      return this.sett.color || '#0000ff'
    },
    backColor() {
      return this.sett.backColor || '#15d822'
    },
    backColor1() {
      return this.sett.backColor1 || '#25d6ee'
    },
    lineWidth() {
      return this.sett.lineWidth || 5
    },
    length() {
      return this.sett.length
    },
  },
  methods: {
    meta_info() {
      return {
        author: 'shrutipatel', version: '1.0.0',
        desc: 'Relative Volatility Measure',
        preset: {
          name: 'RVM $length',
          side: 'offchart',
          settings: {
            lineWidth: 0.75,
            color: '#279fc4'
          }
        }
      }
    },

    use_for() { return ['RVM'] },

    draw(ctx) {
      const { t2screen, $2screen } = this.$props.layout
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      ctx.beginPath()

      for (let i = 0; i < this.$props.data.length; i++) {
        const p = this.$props.data[i];
        const x = t2screen(p[0])
        const y = $2screen(p[1])
        let p1 = i < this.$props.data.length - 1 ? this.$props.data[i + 1] : this.$props.data[i - 1]
        const x1 = t2screen(p1[0])
        if (p[1] <= 10 && p[1] >=0 ) {
          ctx.fillStyle = this.backColor || '#15d822';  
          ctx.fillRect(x - ((x1-x)/2), 0, x1-x+1, ctx.canvas.height);  
        }
        if (p[1] > 10 && p[1] <= 20 ) {
          ctx.fillStyle = this.backColor1 || '#25d6ee';  
          ctx.fillRect(x - ((x1-x)/2), 0, x1-x+1, ctx.canvas.height);  
        }
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    
    calc() {
      return {
        props: {
          length: { def: 9, text: 'Length' }
        },
        init: `
          this.combineArr = []
        `,
        update: `
            let short1 = atr(3)[0];
            let short2 = atr(5)[0];
            let short3 = atr(8)[0];
            let long1 = atr(55)[0];
            let long2 = atr(89)[0];
            let long3 = atr(144)[0];
            
            let shortAvg = (short1 + short2 + short3) / 3;
            let longAvg = (long1 + long2 + long3) / 3;

            let combinedATR = (shortAvg + longAvg) / 2;
            
            if(!isNaN(combinedATR)){
              this.combineArr.push(combinedATR);
            }
            
            if (this.combineArr.length > length) {
              let lastValues = this.combineArr.slice(-length);
              let highestCombinedATR = lastValues[0];
              let lowestCombinedATR = lastValues[0];

              for (let i = 1; i < lastValues.length; i++) {
                if (lastValues[i] > highestCombinedATR) {
                  highestCombinedATR = lastValues[i];
                }
                if (lastValues[i] < lowestCombinedATR) {
                  lowestCombinedATR = lastValues[i];
                }
              }
              let rvm = (this.combineArr[this.combineArr.length - 1] - lowestCombinedATR) / Math.max(highestCombinedATR - lowestCombinedATR, 0.001) * 100;
              return rvm;
            }
        `
      };

    },
  }
}
</script>