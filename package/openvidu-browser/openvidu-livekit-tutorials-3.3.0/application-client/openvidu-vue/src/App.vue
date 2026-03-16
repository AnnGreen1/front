<script setup lang="ts">
import {
    LocalVideoTrack,
    ParticipantEvent,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
    TrackPublication
} from 'livekit-client';
import { onUnmounted, ref, type Ref } from 'vue';
import VideoComponent from './components/VideoComponent.vue';
import AudioComponent from './components/AudioComponent.vue';
import StreamingText from './components/StreamingText.vue';

type TrackInfo = {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
};

// When running OpenVidu locally, leave these variables empty
// For other deployment type, configure them with correct URLs depending on your deployment
// let APPLICATION_SERVER_URL = '';
// let LIVEKIT_URL = '';

// let APPLICATION_SERVER_URL = "http://192.168.16.154:8080/"
let APPLICATION_SERVER_URL = "http://192.168.16.110:6080/"
let LIVEKIT_URL = "wss://192-168-16-154.openvidu-local.dev:7443/"
configureUrls();

function configureUrls() {
    // If APPLICATION_SERVER_URL is not configured, use default value from OpenVidu Local deployment
    if (!APPLICATION_SERVER_URL) {
        if (window.location.hostname === 'localhost') {
            APPLICATION_SERVER_URL = 'http://localhost:6080/';
        } else {
            APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
        }
    }

    // If LIVEKIT_URL is not configured, use default value from OpenVidu Local deployment
    if (!LIVEKIT_URL) {
        if (window.location.hostname === 'localhost') {
            LIVEKIT_URL = 'ws://localhost:7880/';
        } else {
            LIVEKIT_URL = 'wss://' + window.location.hostname + ':7443/';
        }
    }
}

const room = ref<Room>();
const localTrack = ref<LocalVideoTrack>();
const remoteTracksMap: Ref<Map<string, TrackInfo>> = ref(new Map());

let participantName = ref('Participant' + Math.floor(Math.random() * 100));
let roomName = ref('Test Room');

async function joinRoom() {
    // Initialize a new Room object
    room.value = new Room();

    // Specify the actions when events take place in the room
    // On every new Track received...
    room.value.on(
        RoomEvent.TrackSubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            console.log('TrackSubscribed', _track, publication, participant)
            remoteTracksMap.value.set(publication.trackSid, {
                trackPublication: publication,
                participantIdentity: participant.identity
            });

            participant.on(ParticipantEvent.TrackMuted, (pub: TrackPublication) => {
                console.log('TrackMuted', pub);
                console.log(participant)
                console.log(participant.identity)
            })

            participant.on(ParticipantEvent.TrackUnmuted, (pub: TrackPublication) => {
                console.log('TrackUnmuted', pub);
                console.log(participant)
                console.log(participant.identity)
            })
        }
    );

    // On every Track destroyed...
    room.value.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        remoteTracksMap.value.delete(publication.trackSid);
    });


    room.value.on(RoomEvent.RoomMetadataChanged, (speakers: Participant[]) => {

        console.log('RoomEvent.RoomMetadataChanged  Speakers:', speakers);
        // Speakers contain all of the current active speakers
        // console.log('Active speakers:', speakers);
    });


    room.value.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        remoteTracksMap.value.delete(publication.trackSid);
    });


    // 监听数据接收事件
    room.value.on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {

        console.log('Received data from', payload, participant, kind, topic);


        try {
            // 将 Uint8Array 转换为字符串再解析为对象
            const text = new TextDecoder().decode(payload);
            const message = JSON.parse(text);

            // 检查是否有文件传输主题
            if (message.topic === 'my-topic' || message.topic === 'file-transfer') {
                console.log(`Received file data from ${participant.identity}:`, message);

                // 根据消息类型处理
                if (message.type === 'file-start') {
                    // 初始化文件接收记录
                    receivedFiles.set(message.fileId, {
                        filename: message.filename,
                        mimeType: message.mimeType,
                        size: message.size,
                        totalChunks: message.totalChunks,
                        chunks: new Array(message.totalChunks),
                        receivedChunks: 0
                    });
                    console.log(`Starting to receive file: ${message.filename} (${message.size} bytes in ${message.totalChunks} chunks)`);
                }
                else if (message.type === 'file-chunk') {
                    // 处理文件数据块
                    const fileRecord = receivedFiles.get(message.fileId);
                    if (fileRecord) {
                        fileRecord.chunks[message.chunkIndex] = new Uint8Array(message.chunk);
                        fileRecord.receivedChunks++;

                        console.log(`Received chunk ${message.chunkIndex + 1}/${message.totalChunks}`);

                        // 如果接收完所有块，组合成完整文件
                        if (message.isLast) {
                            // 组装完整文件
                            let totalSize = 0;
                            for (const chunk of fileRecord.chunks) {
                                if (chunk) totalSize += chunk.length;
                            }

                            const fullData = new Uint8Array(totalSize);
                            let offset = 0;

                            for (const chunk of fileRecord.chunks) {
                                if (chunk) {
                                    fullData.set(chunk, offset);
                                    offset += chunk.length;
                                }
                            }

                            // 创建文件对象
                            const file = new File([fullData], fileRecord.filename, {
                                type: fileRecord.mimeType
                            });

                            console.log(`Received complete file: ${fileRecord.filename}`, file);

                            // 触发文件接收完成事件或其他处理
                            onFileReceived(file, participant);

                            // 清理缓存
                            receivedFiles.delete(message.fileId);
                        }
                    }
                }
                else if (message.type === 'file-end') {
                    console.log(`Finished receiving file: ${message.filename}`);
                }
            }
        } catch (e) {
            console.error('Error parsing received data:', e);
        }
    });


    try {
        // Get a token from your application server with the room name and participant name
        const token = await getToken(roomName.value, participantName.value);

        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOTY3NzcyMTg1NDkxMzY5OTg1IiwiaXNzIjoiZGV2a2V5IiwibmFtZSI6IjE5Njc3NzIxODU0OTEzNjk5ODUiLCJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IjE5ODAxODAyMjY3NjY0NzkzNjIifSwic2lwIjp7fSwiZXhwIjoxNzYzMDIyOTk4LCJqdGkiOiIxOTY3NzcyMTg1NDkxMzY5OTg1In0.hhI5u1JkUSFCTogWy2EgV9GfIUi0aPrwbtvpn-XIYdQ'

        // Connect to the room with the LiveKit URL and the token
        await room.value.connect(LIVEKIT_URL, token);

        // Publish your camera and microphone
        await room.value.localParticipant.enableCameraAndMicrophone();
        localTrack.value = room.value.localParticipant.videoTrackPublications.values().next().value.videoTrack;

        // room.value.localParticipant.on(ParticipantEvent.TrackMuted, (pub: TrackPublication) => {
        //     console.log('TrackMuted', pub.track);
        // })

        // room.value.localParticipant.on(ParticipantEvent.TrackUnmuted, (pub: TrackPublication) => {
        //     console.log('TrackUnmuted', pub.track);
        // })

        setMicrophoneEnabled(false)

        // room.value.remoteParticipants[0].on(ParticipantEvent.TrackMuted, (pub: TrackPublication) => {
        //     console.log('TrackMuted', pub.track);
        // })
    } catch (error: any) {
        console.log('There was an error connecting to the room:', error.message);
        await leaveRoom();
    }

    // Add listener for beforeunload event to leave the room when the user closes the tab
    window.addEventListener('beforeunload', leaveRoom);



}

async function leaveRoom() {
    // Leave the room by calling 'disconnect' method over the Room object
    await room.value?.disconnect();

    // Empty all variables
    room.value = undefined;
    localTrack.value = undefined;
    remoteTracksMap.value.clear();

    window.removeEventListener('beforeunload', leaveRoom);
}

/** 自行处理逻辑发送大模型的分片文本 */
const sendTextAllAtOnce = async () => {
    // 在消息中包含主题信息
    const message = {
        topic: 'my-topic',
        text: 'Lorem ipsum dolor sit amet...'
    };

    // 将对象转换为 Uint8Array 发送
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(message));

    await room.value.localParticipant.publishData(data, {
        reliable: true
    });

    console.log(`Sent text message with topic: my-topic`);
};

const ALI_TTS_FORMAT = "mp3"
const ALI_TTS_SAMPLERATE = 16000
const sendAliTTSBlob = async (text) => {

    try {
        const url = '/ali-tts' + "/stream/v1/tts"

        const requestBody = {
            appkey: 'CVW7mjKfDxOSfhC7',
            token: 'f43e3549728345dfaf095ab97ddb31f2',
            text: text,
            format: ALI_TTS_FORMAT,
            sample_rate: ALI_TTS_SAMPLERATE,
            voice: 'zhiyue'
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "audio/*"
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.startsWith("audio/")) {
            const textResponse = await response.text()
            throw new Error(`请求失败: ${textResponse}`)
        }

        const audioBlob = await response.blob()

        await sendFileExample(audioBlob);

    } catch (err) {
        console.error("POST请求错误:", err)
    } finally {
    }
};

// 存储接收到的文件块
const receivedFiles = new Map();

// 发送文件函数（支持大文件分片）
const sendFile = async (fileBlob, options = {}) => {
    const chunkSize = 16384; // 16KB chunks
    const arrayBuffer = await fileBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const totalChunks = Math.ceil(uint8Array.length / chunkSize);
    const fileId = Date.now().toString(); // 简单的文件ID生成

    console.log(`Starting to send file: ${fileBlob.name} (${fileBlob.size} bytes) in ${totalChunks} chunks`);

    // 发送文件开始消息
    const startMessage = {
        type: 'file-start',
        topic: options.topic || 'file-transfer',
        fileId: fileId,
        filename: fileBlob.name,
        mimeType: fileBlob.type,
        size: fileBlob.size,
        totalChunks: totalChunks
    };

    const encoder = new TextEncoder();
    let data = encoder.encode(JSON.stringify(startMessage));
    await room.value.localParticipant.publishData(data, {
        reliable: true
    });

    // 分片发送文件数据
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, uint8Array.length);
        const chunk = uint8Array.slice(start, end);

        // 创建包含文件信息和数据块的负载
        const fileChunkData = {
            type: 'file-chunk',
            topic: options.topic || 'file-transfer',
            fileId: fileId,
            filename: fileBlob.name,
            mimeType: fileBlob.type,
            chunk: Array.from(chunk),
            chunkIndex: i,
            totalChunks: totalChunks,
            isLast: i === totalChunks - 1
        };

        // 将对象转换为 Uint8Array 发送
        data = encoder.encode(JSON.stringify(fileChunkData));
        await room.value.localParticipant.publishData(data, {
            reliable: true
        });

        // 报告进度
        if (options.onProgress) {
            options.onProgress((i + 1) / totalChunks);
        }

        console.log(`Sent chunk ${i + 1}/${totalChunks}`);
    }

    // 发送文件结束消息
    const endMessage = {
        type: 'file-end',
        topic: options.topic || 'file-transfer',
        fileId: fileId,
        filename: fileBlob.name
    };

    data = encoder.encode(JSON.stringify(endMessage));
    await room.value.localParticipant.publishData(data, {
        reliable: true
    });

    console.log(`Finished sending file: ${fileBlob.name}`);
};

// 替换原来的 sendFile 调用
// 文件接收完成的处理函数
const onFileReceived = (file, sender) => {
    console.log(`File received from ${sender.identity}:`, file);

    // 检查是否为音频文件
    if (file.type.startsWith('audio/')) {
        // 创建对象URL
        const audioUrl = URL.createObjectURL(file);

        // 创建Audio对象并播放
        const audio = new Audio(audioUrl);
        audio.play()
            .then(() => {
                console.log('Audio playback started');
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });

        // 监听播放结束事件
        audio.addEventListener('ended', () => {
            console.log('Audio playback finished');
            // 释放对象URL
            URL.revokeObjectURL(audioUrl);
        });

        // 监听播放错误
        audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            // 释放对象URL
            URL.revokeObjectURL(audioUrl);
        });
    } else {
        // 对于非音频文件，提供下载链接
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.textContent = `Download ${file.name}`;
        a.style.display = 'block';
        a.style.margin = '10px 0';
        document.body.appendChild(a);
    }
};

const sendFileExample = async (audioBlob) => {
    // 这里需要你提供一个实际的 audioBlob 对象
    // const audioBlob = ...;

    if (typeof audioBlob !== 'undefined') {
        await sendFile(audioBlob, {
            topic: 'my-topic',
            onProgress: (progress) => console.log('sending file, progress', Math.ceil(progress * 100))
        });
    } else {
        console.warn('audioBlob is not defined');
    }
};

let ttsWS = ''
const sendWsTTS = (text) => {
    // 实例化 WebSocket
    let llmWS = new WebSocket(`ws://localhost:8082`)
    // 当 WebSocket 创建成功时，触发 onopen 事件
    llmWS.onopen = () => {
        // console.log("llm_ws onopen...")
        llmWS.send(JSON.stringify({
            "type": "request_text",
            "content": text
        }))
    }
    llmWS.onerror = (e) => {
        llmWS.close()
        // console.log("llm_ws websocket出现连接、处理、接收、发送数据失败！")
    }
    llmWS.onclose = (e) => {
        // console.log("llm_ws websocket关闭连接！", e)
    }
    llmWS.onmessage = async (e) => {
        console.log("llm_ws websocket接收数据！", e.data)
    }
};

// 新增：播放TTS到会议室
const playTTSInRoom = async (text, voice = 'zhiyue') => {
    try {
        const response = await fetch('http://localhost:6082/play-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName: roomName.value,
                participantName: participantName.value,
                text: text,
                voice: voice
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to play TTS');
        }

        const result = await response.json();
        console.log('TTS播放已启动:', result.message);
    } catch (error) {
        console.error('播放TTS时出错:', error);
    }
};

// 新增：停止TTS播放
const stopTTSInRoom = async () => {
    try {
        const response = await fetch('http://localhost:6082/stop-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName: roomName.value
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to stop TTS');
        }

        const result = await response.json();
        console.log('TTS播放已停止:', result.message);
    } catch (error) {
        console.error('停止TTS时出错:', error);
    }
};

/** 生成32位随机字符串 */
function generateUUID() {
    let d = new Date().getTime()
    let d2 = (performance && performance.now && performance.now() * 1000) || 0
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 //random number between 0 and 16
        if (d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
}

/*** 生成 WebSocket 消息的头部信息 */
const getHeader = () => {
    const timestamp = Date.now() // 获取当前时间戳
    return {
        message_id: generateUUID(), // 消息ID，包含随机值以确保唯一性
        task_id: task_id, // 任务ID，包含时间戳和随机值以确保唯一性
        namespace: "FlowingSpeechSynthesizer", // 命名空间
        name: "", // 消息名称，初始化为空
        appkey: 'CVW7mjKfDxOSfhC7' // 应用密钥
    }
}

const setMicrophoneEnabled = async (enable) => {
    try {
        const currentEnable = room.value.localParticipant.isMicrophoneEnabled
        console.log("当前麦克风状态：", enable)

        await room.value.localParticipant.setMicrophoneEnabled(enable)

        console.log(`${enable ? "开启" : "静音"}麦克风成功`)
    } catch (error) {
        console.error(`麦克风切换失败:`, error)
    }
}


const streamTextTTS = async (voice = 'zhiyue') => {
    console.log("streamTextTTS...", voice)

    const url = `${import.meta.env.VITE_APP_WSTTS_URL}/ws/v1?token=` + 'f43e3549728345dfaf095ab97ddb31f2'
    // console.log("tts_ws url:", url)
    ttsWS = new WebSocket(url) // 初始化 WebSocket 连接
    ttsWS.binaryType = "arraybuffer"
    // 当 WebSocket 连接打开后发送 StartSynthesis 指令
    ttsWS.onopen = () => {
        // console.log("tts_ws onopen...")
        ttsWsReady = true
        if (ttsWS.readyState === WebSocket.OPEN) {
            // isTTSReady = true
            task_id = generateUUID()
            const header = getHeader() // 获取新的头部信息
            const params = {
                header: { ...header, name: "StartSynthesis" }, // 更新消息头部信息中的名称为 'StartSynthesis'
                payload: {
                    voice: voice, // 选择音色
                    format: "PCM", // 文件格式
                    sample_rate: 24000, // 采样率
                    volume: 100, // 音量
                    speech_rate: 0, // 语速
                    pitch_rate: 0, // 音调
                    enable_subtitle: true, // 是否启用字幕
                    platform: "javascript"
                }
            }
            ttsWS.send(JSON.stringify(params)) // 发送开始合成消息
        }
    }
    // 当 WebSocket 连接发生错误时触发
    ttsWS.onerror = (err) => {
        console.error(err)
        ttsWsReady = false
    }
    // 当 WebSocket 连接关闭时触发
    ttsWS.onclose = (err) => {
        console.info(err)
        ttsWsReady = false
        isSynthesisStarted = false
    }
    // 当 WebSocket 收到消息时触发
    ttsWS.onmessage = (event) => {
        const data = event.data
        // 如果收到的是二进制数据（Blob 类型）
        if (data instanceof ArrayBuffer) {
            player?.pushPCM(data)
        } else {
            // 如果收到的是文本消息
            const body = JSON.parse(data) // 解析 JSON 数据
            // 如果消息名称为 'SynthesisStarted' 指令 且状态为成功
            if (body.header.name === "SynthesisStarted" && body.header.status === 20000000) {
                isSynthesisStarted = true // 更新合成状态为已经开始
            }
            // 如果消息名称为 'SynthesisCompleted' 指令 且状态为成功
            if (body.header.name === "SynthesisCompleted" && body.header.status === 20000000) {
                ttsWS.close() // 关闭 WebSocket 连接
                ttsWS = null // 重置 WebSocket 实例
                isSynthesisStarted = false // 更新合成状态为未开始
            }
        }
    }
}



onUnmounted(() => {
    // On component unmount, leave the room
    leaveRoom();
});

/**
* --------------------------------------------
* GETTING A TOKEN FROM YOUR APPLICATION SERVER
* --------------------------------------------
* The method below request the creation of a token to
* your application server. This prevents the need to expose
* your LiveKit API key and secret to the client side.
*
* In this sample code, there is no user control at all. Anybody could
* access your application server endpoints. In a real production
* environment, your application server must identify the user to allow
* access to the endpoints.
*/
async function getToken(roomName: string, participantName: string) {
    const response = await fetch(APPLICATION_SERVER_URL + 'token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomName,
            participantName
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get token: ${error.errorMessage}`);
    }

    const data = await response.json();
    return data.token;
}
</script>

<template>
<div v-if="!room" id="join">
    <div id="join-dialog">
        <h2>Join a Video Room</h2>
        <form @submit.prevent="joinRoom">
            <div>
                <label for="participant-name">Participant</label>
                <input v-model="participantName" id="participant-name" class="form-control" type="text" required />
            </div>
            <div>
                <label for="room-name">Room</label>
                <input v-model="roomName" id="room-name" class="form-control" type="text" required />
            </div>
            <button class="btn btn-lg btn-success" type="submit" :disabled="!roomName || !participantName">
                Join!
            </button>
        </form>
    </div>
</div>
<div v-else id="room">
    <div id="room-header">
        <h2 id="room-title">{{ roomName }}</h2>

        <button class="btn btn-danger" id="leave-room-button" @click="leaveRoom">Leave Room</button>
    </div>
    <div id="layout-container">
        <VideoComponent v-if="localTrack" :track="localTrack" :participantIdentity="participantName" :local="true" />
        <template v-for="remoteTrack of remoteTracksMap.values()" :key="remoteTrack.trackPublication.trackSid">
            <VideoComponent v-if="remoteTrack.trackPublication.kind === 'video'"
                :track="remoteTrack.trackPublication.videoTrack!" :participantIdentity="remoteTrack.participantIdentity"
                :audio-muted="remoteTrack.trackPublication.audioTrack?.isMuted" />
            <AudioComponent v-else :track="remoteTrack.trackPublication.audioTrack!" />
            <!-- <AudioComponent v-else :track="remoteTrack.trackPublication.audioTrack!" hidden />             -->
        </template>
    </div>
    <div>
        <button @click=" setMicrophoneEnabled(false)"> setMicrophoneEnabled(false)</button>
        <button @click=" setMicrophoneEnabled(true)"> setMicrophoneEnabled(true)</button>
        <button @click="sendTextAllAtOnce">sendText(一次性发送)</button>
        <button
            @click="sendAliTTSBlob('若要流式传输任何类型的二进制数据，请使用 streamBytes 方法打开流编写器。完成数据发送后，必须显式关闭流。')">sendAliTTSBlob(阿里tts固定文本)</button>
        <button
            @click="sendWsTTS('若要流式传输任何类型的二进制数据，请使用 streamBytes 方法打开流编写器。完成数据发送后，必须显式关闭流。赛力斯9月29日晚间公告，公司全资子公司赛力斯汽车拟以支付现金的方式购买华为技术有限公司持有的深圳引望智能技术有限公司10%股权，交易金额为115亿元。截至公告披露日，双方《股权转让协议》约定的第三笔付款先决条件已满足，受让方已向转让方支付完毕《股权转让协议》约定的第三笔转让价款人民币34.5亿元，受让方已支付完毕本次交易的全部对价。去年7月，赛力斯发布公告称，公司拟与引望及其股东协商投资入股事宜。同年8月，赛力斯发布公告，赛力斯汽车以支付现金的方式购买引望10%股权，交易金额为115亿元。')">sendAliTTSBlob(阿里tts固定文本)</button>
        <!-- 新增TTS控制按钮 -->
        <div style="margin-top: 20px;">
            <h3>会议室TTS播放</h3>
            <textarea id="tts-text" placeholder="输入要播放的文本..." rows="3" cols="50"></textarea>
            <div>
                <button @click="playTTSInRoom(document.getElementById('tts-text').value)">播放TTS到会议室</button>
                <button @click="stopTTSInRoom">停止TTS播放</button>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
#join {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

#join-dialog {
    width: 70%;
    max-width: 900px;
    padding: 60px;
    border-radius: 6px;
    background-color: #f0f0f0;
}

#join-dialog h2 {
    color: #4d4d4d;
    font-size: 60px;
    font-weight: bold;
    text-align: center;
}

#join-dialog form {
    text-align: left;
}

#join-dialog label {
    display: block;
    margin-bottom: 10px;
    color: #0088aa;
    font-weight: bold;
    font-size: 20px;
}

.form-control {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    color: #0088aa;
    font-weight: bold;
}

.form-control:focus {
    color: #0088aa;
    border-color: #0088aa;
    -webkit-box-shadow:
        inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(0, 136, 170, 0.6);
    box-shadow:
        inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(0, 136, 170, 0.6);
}

#join-dialog button {
    display: block;
    margin: 20px auto 0;
}

.btn {
    font-weight: bold;
}

.btn-success {
    background-color: #06d362;
    border-color: #06d362;
}

.btn-success:hover {
    background-color: #1abd61;
    border-color: #1abd61;
}

#room {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    padding: 0 20px;
    margin-bottom: 20px;
}

#room-title {
    font-size: 2em;
    font-weight: bold;
    margin: 0;
}

#layout-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    height: 100%;
}

/* Media Queries */
@media screen and (max-width: 768px) {
    #join-dialog {
        width: 90%;
        padding: 30px;
    }

    #join-dialog h2 {
        font-size: 50px;
    }

    #layout-container {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}

@media screen and (max-width: 480px) {
    #join-dialog {
        width: 100%;
        padding: 20px;
    }

    #join-dialog h2 {
        font-size: 40px;
    }

    #layout-container {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
}
</style>
