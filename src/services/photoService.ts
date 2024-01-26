import {request} from "@@/exports";

export async function getPhoto(uuid: string) {
    return request<BaseResponse<string>>(`/photo/get`, {
        method: 'GET',
        params: {uuid},
    });
}