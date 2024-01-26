import {request} from "@@/exports";

/**
 * 获取ICP备案信息
 */
export async function getICPInformation() {
    return request<BaseResponse<string>>('/web/get/icp/information', {
        method: 'GET',
    });
}

/**
 * 获取ICP备案号
 */
export async function getICPCode() {
    return request<BaseResponse<string>>('/web/get/icp/code', {
        method: 'GET',
    });
}