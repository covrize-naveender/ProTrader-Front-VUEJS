<template>
    <span class="h-splitter" @mousedown="hs_mousedown" :style="hs_style">
    </span>
</template>
<script>

import Utils from './utils.js'

export default {
    name: 'Splitter',
    props: ['id', 'main', 'dc', 'tv', 'data'],
    data() {
        return {
            offset: 0, // Store grid2 offset reactively
            MIN_HEIGHT: this.data.sett.min_height || 20
        };
    },
    mounted() {
        this.updateOffset();
    },
    methods: {
        updateOffset() {
            let grids = this.tv.$refs.chart?._layout?.grids || [];
            let g2 = grids[this.data.index];

            if (g2) {
                this.offset = g2.offset; // Update reactive property
            }
        },
        hs_mousedown(e) {
            let grids = this.tv.$refs.chart?._layout?.grids || [];
            let g1 = grids[this.data.index - 1];
            let g2 = grids[this.data.index];

            if (!g1 || !g2) return;

            this.drag = {
                type: 'hs',
                y: e.clientY,
                h1: g1.height,
                h2: g2.height,
                index: this.data.index
            };

            Utils.add_style('disable-user-select', `body * {
                user-select: none;
            }
            .trading-vue-chart {
                pointer-events: none;
            }`);
        },
        hs_mousemove(e) {
            if (this.drag) {
                let grids = this.tv.$refs.chart?._layout?.grids || [];
                let g1 = grids[this.drag.index - 1];
                let g2 = grids[this.drag.index];

                if (!g1 || !g2) return;

                let off = e.clientY - this.drag.y;
                let new_h1 = this.drag.h1 + off;
                let new_h2 = this.drag.h2 - off;

                if (new_h1 > this.MIN_HEIGHT && new_h2 > this.MIN_HEIGHT) {
                    g1.height = new_h1;
                    g2.height = new_h2;
                    this.updateOffset(); // Update offset after change
                }

                this.main.calc_heights();
            }
        },
        hs_mouseup() {
            this.drag = null;
            Utils.rem_style('disable-user-select');
        },
        hs_mouseleave(e) {
            this.drag = null
            Utils.rem_style('disable-user-select')
        }
    },
    computed: {
        hs_style() {
            return {
                top: this.offset + 'px'
            };
        }
    }
};

</script>
<style scoped>
.h-splitter {
    position: absolute;
    left: 0;
    height: 5px;
    margin-top: -2px;
    width: 100%;
    z-index: 1;
    opacity: 0;
    pointer-events: all;
}

.h-splitter:hover {
    cursor: row-resize;
    opacity: 1;
}
</style>
