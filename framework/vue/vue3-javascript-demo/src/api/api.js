import request from "@/utils/request";

// 随机土味情话
export const randqinghua = data => {
    data = data || {};
    return request({
        url: `https://api.uomg.com/api/rand.qinghua`,
        method: "post",
        data
    })
};


/**
 * ...
 * ...
 */