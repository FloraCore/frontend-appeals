declare namespace Appeal {
    interface AppealAddRequest {
        userName?: string;
        userEmail?: string;
        appealReason: string;

        photos: string[];
    }

    interface AppealCheckRequest {
        userName?: string;
        id?: number;
    }

    interface AppealAcceptRequest {
        appealID?: number;
        userID?: number;
    }

    interface AppealBlacklistAddRequest {
        userName?: string;
        assignee: number;
        reason: string;
    }

    interface AppealAuditCheckRequest {
        appealID?: number;
        userID?: number;
    }

    interface AppealAuditRequest {
        id?: number;
        conclusion?: number;
        conclusionReason?: number;
    }

    interface Appeal {
        id?: number;
        userName?: string;
        appealType?: string;
        uuid?: string;
        createTime?: Date;
        state?: number;
    }

    interface AppealVO {
        id?: number;
        userName?: string;
        appealType?: string;
        uuid?: string;
        createTime?: Date;
        state?: number;
    }

    interface AppealPunishVO {
        id?: number;
        punishInfo?: number;
        uuid?: string;
        userName?: string;
        userEmail?: string;
        appealReason?: string;
        photos?: string;
        assignee?: number;
        processingTime?: Date;
        conclusion?: number;
        conclusionReason?: string;
        updateTime?: Date;
    }

    interface AppealAbnormalVO {
        id?: number;
        uuid?: string;
        userName?: string;
        userEmail?: string;
        appealReason?: string;
        photos?: string;
        assignee?: number;
        processingTime?: Date;
        conclusion?: number;
        conclusionReason?: string;
        updateTime?: Date;
    }

    interface AppealBlackListVO {
        id?: number;
        uuid?: string;
        name?: string;
        assignee?: number;
        assigneeName?: string;
        reason?: string;
        createTime?: Date;
    }

    interface ReasonList {
        id?: number;
        title?: string;
        reason?: string;
        type?: number;
        createTime?: Date;
        updateTime?: Date;
    }

    interface AppealQueryRequest extends PageRequest {
        id?: number;
        userName?: string;
        appealType?: string;
        state?: number;
    }

    interface ReasonListQueryRequest extends PageRequest {
        id?: number;
        title?: string;
        reason?: string;
        type?: number;
        createTime?: Date;
        updateTime?: Date;
    }

    interface AppealBlacklistQueryRequest extends PageRequest {
        id?: number;
        uuid?: string;
        name?: string;
        assignee?: number;
        assigneeName?: string;
        reason?: string;
        createTime?: Date;
    }

    /**
     * 理由删除请求
     */
    interface ReasonDeleteRequest {
        id: number;
    }

    interface ReasonAddRequest {
        title?: string;
        reason?: string;
        type?: number;
    }

    interface ReasonUpdateRequest {
        id?: number;
        title?: string;
        reason?: string;
        type?: number;
    }
}