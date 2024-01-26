declare namespace LiteBans {
    interface CheckBanRequest {
        userName: string;
    }

    interface PunishVO {
        id?: number;
        reason?: string;
        bannedByName?: string;
        type?: string;
    }

    interface PunishInfoVO {
        id?: number;
        punishID?: number;
        reason?: string;
        bannedByName?: string;
        type?: string;
        time?: number;
        until?: number;
    }

    interface LitebansExecuteRequest {
        userName?: string;
        type: number;
        reason?: string;
        date?: string;
    }
}