import {request} from "@@/exports";

export async function addAppeal(params: Appeal.AppealAddRequest) {
    return request<BaseResponse<number>>('/appeal/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function addAppealAbnormal(params: Appeal.AppealAddRequest) {
    return request<BaseResponse<number>>('/appeal/abnormal/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function checkAppeal(params: Appeal.AppealCheckRequest) {
    return request<BaseResponse<Appeal.AppealVO>>('/appeal/checkVO', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function acceptAppeal(params: Appeal.AppealAcceptRequest) {
    return request<BaseResponse<boolean>>('/appeal/accept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function addBlacklist(params: Appeal.AppealBlacklistAddRequest) {
    return request<BaseResponse<boolean>>('/appeal/blacklist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function checkBlacklist(userName: string) {
    return request<BaseResponse<boolean>>(`/appeal/blacklist/check`, {
        method: 'GET',
        params: {userName},
    });
}

export async function checkAuditAppeal(params: Appeal.AppealAuditCheckRequest) {
    return request<BaseResponse<boolean>>('/appeal/check/audit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}


export async function auditAppeal(params: Appeal.AppealAuditRequest) {
    return request<BaseResponse<boolean>>('/appeal/audit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function checkAppealAbnormal(username: string) {
    return request<BaseResponse<boolean>>(`/appeal/check`, {
        method: 'GET',
        params: {username},
    });
}

export async function getAppealPunish(uuid: string) {
    return request<BaseResponse<Appeal.AppealPunishVO>>(`/appeal/check/VO/punish`, {
        method: 'GET',
        params: {uuid},
    });
}

export async function getAppealAbnormal(uuid: string) {
    return request<BaseResponse<Appeal.AppealAbnormalVO>>(`/appeal/check/VO/abnormal`, {
        method: 'GET',
        params: {uuid},
    });
}

export async function listAppealByPage(params: Appeal.AppealQueryRequest) {
    return request<BaseResponse<PageInfo<Appeal.Appeal>>>('/appeal/list/page', {
        method: 'GET',
        params,
    },);
}

export async function listReasonByPage(params: Appeal.ReasonListQueryRequest) {
    return request<BaseResponse<PageInfo<Appeal.ReasonList>>>('/appeal/reason/page', {
        method: 'GET',
        params,
    },);
}

export async function listBlackListByPage(params: Appeal.AppealBlacklistQueryRequest) {
    return request<BaseResponse<PageInfo<Appeal.ReasonList>>>('/appeal/blacklist/page', {
        method: 'GET',
        params,
    },);
}

export async function deleteReason(params: Appeal.ReasonDeleteRequest) {
    return request<BaseResponse<boolean>>(`/appeal/reason/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function addReason(params: Appeal.ReasonAddRequest) {
    return request<BaseResponse<boolean>>('/appeal/reason/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 更新用户
 */
export async function updateReason(params: Appeal.ReasonUpdateRequest) {
    return request<BaseResponse<boolean>>(`/appeal/reason/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}