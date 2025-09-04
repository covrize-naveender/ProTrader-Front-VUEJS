// Extension's controller

import { Utils } from 'trading-vue-js';
import Vue from 'vue';
import Splitter from './Splitter.vue';
import store from '../../store';

export default class Main {
    constructor(tv, dc, sett) {
        this.widgets = {};
        this.tv = tv;
        this.dc = dc;
        this.sett = sett;

        // Bind event listeners to maintain references
        this.onmousemove = this.onmousemove.bind(this);
        this.onmouseup = this.onmouseup.bind(this);
        this.onmouseleave = this.onmouseleave.bind(this);

        this.tv.$nextTick(() => {
            console.log("mouse events");

            this.tv.$el.addEventListener('mousemove', this.onmousemove);
            this.tv.$el.addEventListener('mouseup', this.onmouseup);
            this.tv.$el.addEventListener('mouseleave', this.onmouseleave);

            this.place_splitters();
            this.calc_heights();

            // Watch for changes in the grid count
            this.tv.$watch(
                () => this.dc.get('.').map(x => x.id),
                this.ongrids.bind(this)
            );
        });
    }

    // Listens to all tvjs events, creates new widgets
    update(e) {
        switch (e.event) {
            // Implement event-based updates if needed
        }
    }

    // Extension settings have changed
    onsettings(sett) {}

    ongrids() {
        this.tv.$nextTick(() => {
            this.remove_widgets();
            this.place_splitters();
        });
    }

    // Retrieve all widgets created by this controller
    getWidgets() {
        return this.tv.$refs.widgets?.$children?.filter(x => x.main === this) || [];
    }

    onmousemove(e) {
        this.getWidgets().forEach(s => s.hs_mousemove(e));
    }

    onmouseup(e) {
        this.getWidgets().forEach(s => s.hs_mouseup(e));
    }

    onmouseleave(e) {
        this.getWidgets().forEach(s => s.hs_mouseleave(e));
    }

    place_splitters() {
        if (!this.tv.$refs.chart || !this.tv.$refs.chart._layout) return;

        let grids = this.tv.$refs.chart._layout.grids;
        for (let i = 1; i < grids.length; i++) {
            let g1 = grids[i - 1];
            let g2 = grids[i];
            let id = `Splitter-${g1.id}-${g2.id}-${Utils.uuid2()}`;

            this.tv.$set(this.widgets, id, {
                id: id,
                cls: Splitter,
                data: { index: i, sett: this.sett }
            });
        }
    }

    calc_heights() {
        let grids = this.tv.$refs.chart?._layout?.grids || [];
        if (!grids.length) return;

        let hs = grids.map(g => g.height);
        let sum = hs.reduce((a, b) => a + b, 0);
        hs = hs.map(h => (sum ? h / sum : 0));

        this.grid_ovs().forEach((ov, i) => {
            if (!ov.grid) this.tv.$set(ov, 'grid', {});

            if (i === 0) {
                let index = this.tv.$refs.chart?.tv_id.split('-')[0] || 0;
                store.dispatch('setGridHeight', { index, value: hs[i] || 1 });
            }

            this.tv.$set(ov.grid, 'height', hs[i] || 1);
        });
    }

    // Grid defining overlays
    grid_ovs() {
        let list = [this.dc.data.chart];
        for (let ov of this.dc.data.offchart) {
            if (!ov.grid || ov.grid.id === undefined) {
                list.push(ov);
            }
        }
        return list;
    }

    remove_widgets() {
        console.log("Removing widgets:", Object.keys(this.widgets));

        Object.keys(this.widgets).forEach(id => {
            this.tv.$delete(this.widgets, id);
        });
    }

    destroy() {
        this.tv.$el.removeEventListener('mousemove', this.onmousemove);
        this.tv.$el.removeEventListener('mouseup', this.onmouseup);
        this.tv.$el.removeEventListener('mouseleave', this.onmouseleave);
    }
}
