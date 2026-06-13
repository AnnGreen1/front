import { ref } from "vue";

// 这是一个组合式函数
let globalCounter = 0; // 【外部变量】：定义在函数之外，属于“全局单例”

export function useMyLogic(id) {
    // 【内部变量】：每次调用函数时，都会重新创建
    let privateState = ref(0); 
    let publicState = ref(0);

    function increment() {
        privateState.value++;
        publicState.value++;
        globalCounter++; // 修改外部变量
        console.log("globalCounter:", globalCounter);
    }

    // 【导出部分】
    return { publicState, increment };
}