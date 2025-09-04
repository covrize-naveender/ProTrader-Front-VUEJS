<template>
    <p-dialog :visible.sync="visible" :closable="true" @hide="onClose()" :modal="true" class="videoLink-modal"
        :showHeader="true" header="Videos">
        <div v-if="videoUrl.length > 0">

            <div v-for="(url, i) in videoUrl" :key="i" style="text-align: center;">

                <iframe width="100%" height="415" :src="url" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
                <p-divider v-if="i < (videoUrl.length - 1)" />
            </div>
        </div>
        <div v-else>
            <h3>No video links available.</h3>
        </div>
    </p-dialog>
</template>

<script>
import { getVideoList } from '../../services/videolink';

export default {
    name: 'FridayBroadcastModal',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            videoUrl: [],
            linkType: ["Friday Broadcast", "Wednesday Breakout"]
        }
    },
    methods: {
        onClose() {
            this.$emit('toggleModal', false)
        },
        getYouTubeVideoId(url) {
            const regex = /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

    },
    async mounted() {
        const res = await getVideoList()
        if (res.isError) {

        }
        else {
            let data = res.data.map((item) => {
                let code = this.getYouTubeVideoId(item.link);
                return {
                    ...item,
                    codeURL: code ? `https://www.youtube.com/embed/${code}` : null
                };
            });

            this.videoUrl = ["Friday Broadcast", "Wednesday Breakout"]
                .map((type) => {
                    let linkObj = data.find(x => x.linkType === type);
                    return linkObj?.codeURL; 
                })
                .filter(Boolean); 



        }
    }
}
</script>

<style lang="scss" scoped>
