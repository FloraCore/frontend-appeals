import {request} from "@@/exports";

export async function listMarkdownsByPage(params: Markdowns.MarkdownQueryRequest) {
    return request<BaseResponse<PageInfo<Markdowns.Markdown>>>('/markdown/list/page', {
        method: 'GET',
        params,
    },);
}

/**
 * 更新MD
 */
export async function updateMarkdown(params: Markdowns.MarkdownUpdateRequest) {
    return request<BaseResponse<boolean>>(`/markdown/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 增加MD
 */
export async function addMarkdown(params: Markdowns.MarkdownAddRequest) {
    return request<BaseResponse<number>>('/markdown/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 删除MD
 */
export async function deleteMarkdown(params: Markdowns.MarkdownDeleteRequest) {
    return request<BaseResponse<boolean>>(`/markdown/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function listMarkdowns(params: Markdowns.MarkdownQueryRequest) {
    return request<BaseResponse<Markdowns.Markdown[]>>('/markdown/list', {
        method: 'GET',
        params,
    });
}