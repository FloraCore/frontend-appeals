import {request} from '@umijs/max';

export async function checkPunish(username: string) {
    return request<BaseResponse<LiteBans.PunishVO>>(`/litebans/check/punish`, {
        method: 'GET',
        params: {username},
    });
}

export async function getPunish(id: number) {
    return request<BaseResponse<LiteBans.PunishInfoVO>>(`/litebans/check/punish/id`, {
        method: 'GET',
        params: {id},
    });
}

export async function litebansExecute(params: LiteBans.LitebansExecuteRequest) {
    return request<BaseResponse<boolean>>('/litebans/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}