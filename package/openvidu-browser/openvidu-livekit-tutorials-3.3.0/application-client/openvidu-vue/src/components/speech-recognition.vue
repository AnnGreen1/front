<template></template>

<script setup>
import { XfVoiceDictation } from "@muguilin/xf-voice-dictation"
import { ref, onMounted } from "vue"
import { useConfigStore } from "@/store/config"
const configStore = useConfigStore()

const emit = defineEmits(["textStatusChange", "xfVoiceStart", "xfVoiceStop"])

let xfVoice = null
const text = ref("") // 识别结果
const isRecording = ref(false) // 是否正在录音

// 暴露给父组件的方法
const startRecognition = () => {
  console.log("开始语音转写")
  if (!isRecording.value) {
    isRecording.value = true
    emit("xfVoiceStart", { text: text.value })
    xfVoice?.start()
  }
}

const stopRecognition = () => {
  console.log("结束语音转写")
  if (isRecording.value) {
    isRecording.value = false
    xfVoice?.stop()
  }
}

onMounted(async () => {
  await Promise.all([configStore.getConfigKey("asst.iat.appId"), configStore.getConfigKey("asst.iat.APISecret"), configStore.getConfigKey("asst.iat.APIKey"), configStore.getConfigKey("asst.iat.wait")])

  // 实例化迅飞语音听写（流式版）WebAPI
  xfVoice = new XfVoiceDictation({
    APPID: configStore.config["asst.iat.appId"],
    APISecret: configStore.config["asst.iat.APISecret"],
    APIKey: configStore.config["asst.iat.APIKey"],

    onWillStatusChange: (oldStatus, newStatus) => {
      console.log("onWillStatusChange", newStatus)
      if (newStatus === "end") {
        emit("xfVoiceStop", {
          text: text.value,
          status: "end"
        })
        if (isRecording.value) {
          xfVoice?.start()
        }
      }
    },

    onTextChange: (val) => {
      console.log("onTextChange")
      text.value = val
      emit("textStatusChange", {
        text: text.value,
        status: "ing"
      })
    },

    onError: (error) => {
      console.error("语音识别错误onError:", error)
      emit("xfVoiceStop", {
        error,
        status: "error"
      })
    }
  })
})

// 暴露方法给父组件
defineExpose({
  startRecognition,
  stopRecognition
})
</script>
