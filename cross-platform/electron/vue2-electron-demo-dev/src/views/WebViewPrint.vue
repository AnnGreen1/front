<template>
    <div>
        <!-- <h1> webview print test</h1> -->
        <webview :src="printUrl" ref="printWebview" webpreferences="contextIsolation=no" style="height: 900px"
            nodeintegrationinsubframes></webview>
        <button @click="print">打印测试</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // printUrl: "./print.html"
            // printUrl: "https://www.electronjs.org/zh/"
            printfUrl:"http://localhost:8080/about"
        }
    },
    methods: {
        print() {
            const webview = this.$refs.printWebview;
            webview
                .print({
                    silent: false, //静默打印
                    printBackground: true,
                    // deviceName: this.printerName, //打印机名称
                    margin: {
                        marginType: "custom",
                        left: 0,
                        right: 0
                    },
                    collate: true,
                    scaleFactor: 0.1,
                    dpi: {
                        horizontal: 1080,
                        vertical: 1080
                    },
                    pageSize: "A4"
                })
                .then((res) => {
                    console.log("res", res);
                })
                .catch((err) => {
                    console.log("err", err);
                });
        }
    }
}
</script>

<style lang="scss" scoped></style>