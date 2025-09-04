<script>

import { Overlay } from 'trading-vue-js'

export default {
    name: 'BB',
    mixins: [Overlay],
    methods: {
        meta_info() {
            return {
                author: 'Shruti Patel',
                version: '1.0.0',
                desc: 'Bollinger Bands',
                preset: {
                    name: 'BB $length $stddev',
                    side: 'onchart',
                    settings: {
                        lineWidth: 1,
                        basicLineGroup: {
                            basicLineEnable: true,
                            basicColor: "#D75800",
                        },
                        upperLineGroup: {
                            upperLineEnable: true,
                            upperColor: "#2A9044",
                        },
                        lowerLineGroup: {
                            lowerLineEnable: true,
                            lowerColor: "#FF0039",
                        },
                        backgroundGroup: {
                            backgroundEnable: true,
                            backgroundColor: "#d7580026",
                        }
                    }
                }
            }
        },
        draw(ctx) {
            
            const { t2screen, $2screen } = this.$props.layout
            
            ctx.beginPath();
            
            // Trace the upper line
            ctx.fillStyle = this.backColor;
            for (const p of this.$props.data) {
                const x = t2screen(p[0]);
                const y = $2screen(p[1]);
                ctx.lineTo(x, y);
            }
            
            // Trace the lower line in reverse
            for (let i = this.$props.data.length - 1; i >= 0; i--) {
                const p = this.$props.data[i];
                const x = t2screen(p[0]);
                const y = $2screen(p[3]);
                ctx.lineTo(x, y);
            }
            
            // Close the path and fill
            ctx.closePath();
            if (this.backgroundEnable) {
                ctx.fill();
            }
            
            //Strocking line
            ctx.lineWidth = this.line_width
            //Upper line
            if (this.upperLineEnable) {
                ctx.beginPath()
                ctx.strokeStyle = this.upperColor
                for (const p of this.$props.data) {
                    const x = t2screen(p[0])
                    const y = $2screen(p[1])
                    ctx.lineTo(x, y)
                }
                ctx.stroke()
            }

            //Basic line
            if (this.basicLineEnable) {
                ctx.beginPath()
                ctx.strokeStyle = this.basicColor
                for (const p of this.$props.data) {
                    const x = t2screen(p[0])
                    const y = $2screen(p[2])
                    ctx.lineTo(x, y)
                }
                ctx.stroke()
            }
            
            //Lower line
            if (this.lowerLineEnable) {
                ctx.beginPath()
                ctx.strokeStyle = this.lowerColor
                for (const p of this.$props.data) {
                    const x = t2screen(p[0])
                    const y = $2screen(p[3])
                    ctx.lineTo(x, y)
                }
                ctx.stroke()
            }
        },
        use_for() { return ['BB'] },
        calc() {
            return {
                props: {
                    length: { def: 21, text: 'Length' },
                    stddev: { def: 2, text: 'StdDev' },
                },
                conf: { renderer: 'Channel' },
                update: `
                    let [m, h, l] = bb(close, length, stddev)
                    return [h[0], m[0], l[0]]
                `
            }
        },
    },
    computed: {
        sett() {
            return this.$props.settings
        },
        line_width() {
            return this.sett.lineWidth || 0.75
        },
        //basic Line setting
        basicLineEnable() {
            return this.sett.basicLineGroup.basicLineEnable
        },
        basicColor() {
            return this.sett.basicLineGroup.basicColor
        },

        //upper line settings
        upperLineEnable() {
            return this.sett.upperLineGroup.upperLineEnable
        },
        upperColor() {
            return this.sett.upperLineGroup.upperColor
        },

        //lower line settings
        lowerLineEnable() {
            return this.sett.lowerLineGroup.lowerLineEnable
        },
        lowerColor() {
            return this.sett.lowerLineGroup.lowerColor
        },

        //background settings
        backgroundEnable() {
            return this.sett.backgroundGroup.backgroundEnable
        },
        backColor() {
            return this.sett.backgroundGroup.backgroundColor
        },
    }
}
</script>