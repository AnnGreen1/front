<template>
    <div>

    </div>
</template>

<script>
export default {
    mounted() {
        // 订阅 diskInfo
        this.$electron.ipcRenderer.on("diskInfo", (event, data) => {
            if (data.error) {
                console.error("Error:", data.error);
            } else {
                console.log(data.drives);
            }
        });

        // 触发 diskInfo
        this.$electron.ipcRenderer.send("getDiskInfo");
    }
}
</script>

<style lang="scss" scoped></style>