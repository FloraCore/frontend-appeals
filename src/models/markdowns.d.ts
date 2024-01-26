declare namespace Markdowns {
    interface Markdown {
        id?: number;
        uuid?: string;
        type?: number;
        title?: string;
        content?: string;
        creator?: number;
        participant?: string;
        top?: number;
        enabled?: number;
        createTime?: Date;
        updateTime?: Date;
    }

    interface MarkdownQueryRequest extends PageRequest {
        id?: number;
        type?: number;
        title?: string;
        top?: number;
        enabled?: number;
    }

    interface MarkdownUpdateRequest {
        id?: number;
        type?: number;
        title?: string;
        content?: string;
        top?: number;
        enabled?: number;
    }

    interface MarkdownAddRequest {
        type?: number;
        title?: string;
        content?: string;
        top?: number;
        enabled?: number;
    }

    /**
     * MD删除请求
     */
    interface MarkdownDeleteRequest {
        id: number;
    }
}