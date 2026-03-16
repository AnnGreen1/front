import request from "../utils/http"
// import { Request, Response } from "@/model/api";
import {randqinghuaRequest,randqinghuaResponse } from "../model/commonapi"
/**
 * 随机土味情话
 * @param data 
 * @returns 
 */
export function randqinghua(data:randqinghuaRequest){
    return request<randqinghuaResponse>({
        url: `https://api.uomg.com/api/rand.qinghua`,
        method: "post",
        data
    })
}
