/**
 * 用户类型定义
 */
declare namespace UserType {
    /**
     * 实体
     */
    interface User {
        id?: number;
        userName?: string;
        userEmail?: string;
        userAvatar?: string;
        userGender?: number;
        userPosition?: string;
        userRole?: string;
        userPassword?: string;
        userKey?: string;
        createTime?: Date;
        updateTime?: Date;
        isBaned?: number;
        acceptMail?: number;
    }

    /**
     * 用户类型
     */
    interface UserVO {
        id?: number;
        userName?: string;
        userEmail?: string;
        userAvatar?: string;
        userGender?: number;
        userPosition?: string;
        userRole?: string;
        userPassword?: string;
        userKey?: string;
        createTime?: Date;
        updateTime?: Date;
        isBaned?: number;
        acceptMail?: number;
        token?: string;
    }

    /**
     * 用户注册请求
     */
    interface UserRegisterRequest {
        userName: string;
        userEmail: string;
        userPassword: string;
        checkPassword: string;
    }

    /**
     * 用户登录请求
     */
    interface UserLoginRequest {
        userName: string;
        userPassword: string;
        code: number;
    }

    /**
     * 用户创建请求
     */
    interface UserAddRequest {
        userName: string;
        userEmail: string;
        userAvatar?: string;
        userGender?: number;
        userPosition?: string;
        userRole: string;
        userPassword: string;
        isBaned?: number;
        acceptMail?: number;
    }


    interface CheckVerifyCodeRequest {
        id?: number;
        code?: string;
    }

    /**
     * 用户删除请求
     */
    interface UserDeleteRequest {
        id: number;
    }

    /**
     * 用户更新请求
     */
    interface UserUpdateRequest {
        id: number;
        userName?: string;
        userPassword: string;
        userEmail?: string;
        userAvatar?: string;
        userGender?: number;
        userPosition?: string;
        userRole?: string;
        isBaned?: number;
        acceptMail?: number;
    }

    /**
     * 用户查询请求
     */
    interface UserQueryRequest extends PageRequest {
        id?: number;
        userName?: string;
        userEmail?: string;
        userAvatar?: string;
        userGender?: number;
        userPosition?: string;
        userRole?: string;
        createTime?: Date;
        updateTime?: Date;
    }
}
