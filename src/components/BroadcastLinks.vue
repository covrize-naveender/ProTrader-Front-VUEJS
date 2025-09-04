<template>
    <div>

        <div class="broadcast-container">
            <img src="/images/logo-login.png" alt="Protrader" />

            <form @submit.prevent="onSubmit" class="loginForm">

                <div class="p-mt-4 p-d-flex p-flex-column">
                    <p-message class="p-field" severity="info" :closable="false" v-if="!isAllowEdit">
                        Enter PIN to Add/Edit Friday Broadcast Link.
                    </p-message>

                    <div class="p-field">
                        <label for="passcode">PIN <span class="required">*</span></label><br />
                        <p-password :feedback="false" id="passcode" v-model="passcode" v-validate="'required'"
                            name="passcode" class="" placeholder="PIN" />
                        <span v-show="errors.has('passcode')" class="p-error">{{ errors.first('passcode') }}</span>
                        <span v-show="wrongCode" class="p-error">{{ wrongCode }}</span>
                    </div>

                    <div class="p-field">
                        <p-button label="Add/Edit Link" type="submit"
                            class="p-button-danger login-button p-button-raised p-button-lg" style="width: 100%;"
                            :disabled="passcode == ''" />
                    </div>
                </div>
            </form>
        </div>
        <div v-if="isAllowEdit" class="datatable-container">
            <p-message v-if="responseMessage.message.length > 0" class="p-field"
                :severity="responseMessage.isError ? 'error' : 'success'" :closable="true">
                {{ responseMessage.message }}
            </p-message>
            <p-datatable :value="videoLinks" responsiveLayout="scroll" v-if="videoLinks.length > 0" class="p-pt-4">
                <p-column field="linkType" header="Link Type">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.linkType }}</span>
                    </template>
                </p-column>
                <p-column field="link" header="Link">
                    <template #body="slotProps">

                        <div v-if="slotProps.data.isEdit" style="width: 400px;">
                            <p-inputText v-model="editableLink" id="link" name="link" class="editableText"
                                v-validate="'required|youtube'" />
                            <span v-show="errors.has('link')" class="p-error">{{ errors.first('link') }}</span>
                        </div>
                        <div v-else style="width: 400px;">

                            <div class="p-d-flex p-ai-center" style="gap: 0.5rem;" v-if="slotProps.data.link != ''">

                                <a :href="slotProps.data.link" target="_blank">
                                    <i class="pi pi-link" style="color: red"></i>
                                </a>
                                <span>{{ slotProps.data.link }}</span>
                            </div>
                            <div v-else>
                                No Link Added
                            </div>
                        </div>
                    </template>
                </p-column>
                <p-column field="id" header="Action">
                    <template #body="slotProps">
                        <div class="p-d-flex" style="gap: 0.5rem;" v-if="slotProps.data.id != null">
                            <p-button icon="pi pi-save" class="p-button-success p-button-outlined"
                                v-if="slotProps.data.isEdit" :disabled="editableLink == ''"
                                v-tooltip.bottom="'Save Link'"
                                @click="updateLink(slotProps.data.id, slotProps.data.linkType)" />

                            <p-button icon="pi pi-times" class="p-button-danger p-button-outlined"
                                v-if="slotProps.data.isEdit" v-tooltip.bottom="'Close'"
                                @click="cancleEdit(slotProps.data.id)" />

                            <p-button icon="pi pi-pen-to-square" class="p-button-secondary p-button-outlined"
                                v-if="!slotProps.data.isEdit" v-tooltip.bottom="'Edit Link'"
                                @click="setEditableRow(slotProps.data.linkType)" />

                            <p-button icon="pi pi-trash" class=" p-button-outlined" v-tooltip.bottom="'Delete Link'"
                                @click="deleteLinkFun(slotProps.data.id)" />

                        </div>
                        <div class="p-d-flex" style="gap: 0.5rem;" v-else>
                            <p-button icon="pi pi-save" class="p-button-success p-button-outlined"
                                v-if="slotProps.data.isEdit" :disabled="editableLink == ''"
                                v-tooltip.bottom="'Save Link'"
                                @click="updateLink(slotProps.data.id, slotProps.data.linkType)" />

                            <p-button icon="pi pi-times" class="p-button-danger p-button-outlined"
                                v-if="slotProps.data.isEdit" v-tooltip.bottom="'Close'"
                                @click="cancleEdit(slotProps.data.id)" />

                            <p-button icon="pi pi-plus" class="p-button-secondary p-button-outlined"
                                v-if="!slotProps.data.isEdit" v-tooltip.bottom="'Add Link'"
                                @click="setEditableRow(slotProps.data.linkType)" />
                        </div>
                    </template>
                </p-column>

            </p-datatable>
        </div>
    </div>

</template>

<script>
import { Validator } from "vee-validate";
import config from '../config'
import { deleteLink, getVideoList, saveLink } from '../services/videolink';

Validator.extend("required", {
    getMessage: field => `The ${field} is required`,
    validate: value => !!value,
});

Validator.extend("youtube", {
    getMessage: () => "Invalid YouTube URL - Use format: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID.",
    validate: value => /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w\-]+$/.test(value),
});

export default {
    name: 'BroadcastLinks',
    data() {
        return {
            passcode: '',
            configCode: config.LINK_PASSCODE,
            isAllowEdit: false,
            wrongCode: '',
            videoLinks: ["Friday Broadcast", "Wednesday Breakout"].map((item) => {
                return {
                    link: "",
                    linkType: item,
                    isEdit: false,
                    id: null
                }
            }),
            editableLink: '',
            responseMessage: {
                isError: false,
                message: ''
            }
        }
    },
    components: {
    },
    methods: {
        async onSubmit() {
            if (this.passcode == this.configCode) {
                this.wrongCode = '';
                const res = await getVideoList()
                if (res?.isError) {
                    this.wrongCode = 'Something went wrong';
                } else {
                    this.isAllowEdit = true;
                    if (res?.data) {
                        res.data.map((obj) => {
                            let linkIndex = this.videoLinks.findIndex(x => x.linkType == obj.linkType)
                            if (linkIndex != -1) {
                                this.videoLinks[linkIndex].id = obj.id
                                this.videoLinks[linkIndex].link = obj.link
                            }

                        })
                    }
                }

            } else {
                this.wrongCode = 'Invalid passcode';
            }
        },
        setEditableRow(linkType) {
            console.log(linkType, this.videoLinks);

            this.videoLinks = this.videoLinks.map(item => {
                if (item.linkType === linkType) {
                    item.isEdit = true;
                    this.editableLink = item.link;
                }
                else {
                    item.isEdit = false;
                }
                return item;
            })
        },
        cancleEdit() {
            this.videoLinks = this.videoLinks.map(item => {
                item.isEdit = false;
                return item;
            })
        },
        async updateLink(id, linkType) {
            const res = await saveLink({
                id,
                link: this.editableLink,
                linkType: linkType
            })
            if (res?.isError) {
                this.responseMessage.isError = true;
                this.responseMessage.message = res?.message;
            }
            else {
                this.responseMessage.isError = false;
                this.responseMessage.message = 'Link Saved Successfully!';
                this.videoLinks = this.videoLinks.map(item => {

                    if (item.linkType === res.data?.linkType) {
                        item.id == null ? item.id = res.data?.id : item.id;
                        item.link = res.data?.link || this.editableLink;
                        item.isEdit = false;
                    }
                    return item;
                })
            }
        },
        async deleteLinkFun(id) {
            const res = await deleteLink(id);
            if (res?.isError) {
                this.responseMessage.isError = true;
                this.responseMessage.message = res?.message;
            }
            else {
                this.responseMessage.isError = false;
                this.responseMessage.message = 'Link Deleted Successfully!';
                this.videoLinks = this.videoLinks.map((item) => {
                    if (item.id === id) {
                        item.isEdit = false
                        item.link = ""
                        item.id = null
                    }
                    return item
                })
            }
        }
    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.broadcast-container {
    margin-left: 30%;
    width: 40%;
    padding-top: 3%;
}

@media screen and (max-width: 1200px) {
    .broadcast-container {
        margin-left: 20%;
        width: 60%;
        padding-top: 3%;
    }
}

@media screen and (max-width: 700px) {
    .broadcast-container {
        margin-left: 10%;
        width: 80%;
        padding-top: 3%;
    }
}


.datatable-container {
    margin-left: 20%;
    width: 60%;
    padding-top: 1%;
}

@media screen and (max-width: 1200px) {
    .datatable-container {
        margin-left: 10%;
        width: 80%;
        padding-top: 2%;
    }
}

@media screen and (max-width: 700px) {
    .datatable-container {
        margin-left: 10%;
        width: 80%;
        padding-top: 3%;
    }
}

.editableText {
    width: 100%;
    padding: 0.7rem !important;
}
</style>