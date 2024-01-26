import {request} from '@umijs/max';

/**
 * 分页获取用户列表
 */
export async function listUserByPage(params: UserType.UserQueryRequest) {
    return request<BaseResponse<PageInfo<UserType.UserVO[]>>>('/user/list/page', {
        method: 'GET',
        params,
    });
}

/**
 * 创建用户
 */
export async function addUser(params: UserType.UserAddRequest) {
    return request<BaseResponse<number>>('/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function checkVerifyCode(params: UserType.CheckVerifyCodeRequest) {
    return request<BaseResponse<boolean>>('/settings/verify/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

export async function sendVerifyCode(id: number) {
    return request<BaseResponse<boolean>>('/settings/verify/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {id},
    });
}

/**
 * 根据 id 获取用户
 */
export async function getUserById(id: number) {
    return request<BaseResponse<UserType.UserVO>>(`/user/get`, {
        method: 'GET',
        params: {id},
    });
}

/**
 * 更新用户
 */
export async function updateUser(params: UserType.UserUpdateRequest) {
    return request<BaseResponse<boolean>>(`/user/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 删除用户
 */
export async function deleteUser(params: UserType.UserDeleteRequest) {
    return request<BaseResponse<boolean>>(`/user/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 用户注册
 */
export async function userRegister(params: UserType.UserRegisterRequest) {
    return request<BaseResponse<number>>('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 用户登录
 */
export async function userLogin(params: UserType.UserLoginRequest) {
    return request<BaseResponse<UserType.UserVO>>('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    });
}

/**
 * 用户登录
 */
export async function userLoginByToken(token: string) {
    return request<BaseResponse<UserType.UserVO>>('/user/login/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        params: {token},
    });
}

/**
 * 用户注销
 */
export async function userLogout(token: string) {
    return request<BaseResponse<boolean>>('/user/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        params: {token},
    });
}

/**
 * 获取当前登录用户
 */
export async function getLoginUser() {
    return request<BaseResponse<UserType.UserVO>>('/user/get/login', {
        method: 'GET',
    });
}

/**
 * 根据 id 获取用户名
 */
export async function getUserNameById(id: number) {
    return request<BaseResponse<string>>(`/user/get/name`, {
        method: 'GET',
        params: {id},
    });
}

/**
 * 获取用户2FA二维码值
 */
export async function get2FAValue(id: number) {
    return request<BaseResponse<string>>('/user/get/qrcode/2fa', {
        method: 'GET',
        params: {id},
    });
}