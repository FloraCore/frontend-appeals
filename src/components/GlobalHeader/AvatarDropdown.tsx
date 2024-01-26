import {userLogout} from '@/services/userService';
import {Link} from '@@/exports';
import {useModel} from '@umijs/max';
import {Avatar, Button, Dropdown, MenuProps, message} from 'antd';
import classNames from 'classnames';
import {stringify} from 'querystring';
import React from 'react';
import {history, useNavigate} from 'umi';
import styles from './index.less';

function getCookie(name: string) {
    let cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return cookiePair[1];
        }
    }
    return null;
}

/**
 * 头像下拉菜单
 */
const AvatarDropdown: React.FC = () => {
    const {
        initialState,
        setInitialState
    } = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const navigate = useNavigate();

    const onMenuClick = async (event: {
        key: React.Key; keyPath: React.Key[];
    }) => {
        const {key} = event;

        if (key === 'logout') {
            try {
                const token = getCookie("loginToken");
                await userLogout(token ?? "");
                message.success('已退出登录');
            } catch (e: any) {
                message.error('操作失败');
            }
            // @ts-ignore
            await setInitialState({
                ...initialState,
                loginUser: undefined
            });
            history.replace({
                pathname: '/user/login',
                search: stringify({
                    redirect: window.location.href,
                }),
            });
            return;
        } else if (key === "settings") {
            navigate('/staff/settings');
        }
    };
    const items: MenuProps['items'] = loginUser ? [{
        key: 'current',
        label: loginUser.userName ?? 'null',
        disabled: true,
    }, {
        key: 'settings',
        label: '设置',
    }, {
        type: 'divider',
    }, {
        key: 'logout',
        danger: true,
        label: '退出登录',
    },] : [];

    return loginUser ? (<Dropdown
        overlayClassName={classNames(styles.container)}
        menu={{
            items,
            onClick: onMenuClick
        }}
        trigger={['click']}
    >
        <div className={`${styles.action} ${styles.account}`}>
            <Avatar
                src={"https://minotar.net/avatar/" + loginUser.userName}/>
        </div>
    </Dropdown>) : (<>
        <Link to="/user/login">
            <Button type="primary" ghost style={{marginRight: 16}}>
                STAFF 登录
            </Button>
        </Link>
    </>);
};

export default AvatarDropdown;
