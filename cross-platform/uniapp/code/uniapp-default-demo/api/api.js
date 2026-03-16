import Request from "@/utils/request";

let request = Request.http

let BASE_URL = 'https://api.uomg.com'
// 随机土味情话
export const randqinghua = data => {
    data = data || {};
    return request({
        url: `${BASE_URL}/api/rand.qinghua`,
        method: "post",
        data
    })
};


/**
 * ...
 * ...
 */