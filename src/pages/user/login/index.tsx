import {userLogin} from '@/services/userService';
import {Link} from '@@/exports';
import {KeyOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormText} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {message} from 'antd';
import {useSearchParams} from 'umi';
import "@/assets/appeal.css"

/**
 * 用户登录页面
 */
export default () => {
    const [searchParams] = useSearchParams();
    const {
        initialState,
        setInitialState
    } = useModel('@@initialState');

    /**
     * 用户登录
     * @param fields
     */
    const doUserLogin = async (fields: UserType.UserLoginRequest) => {
        const hide = message.loading('登录中');
        // @ts-ignore
        // todo 腾讯验证码 token
        const captcha1 = new TencentCaptcha('TENCENT CAPTCHA TOKEN', async function (res) {
            if (res.ret === 0) {
                //console.log(res.ticket)
                //console.log(res.randstr)
                try {
                    const res = await userLogin({...fields});
                    message.success('登录成功');
                    // 记录登录信息
                    setInitialState({
                        ...initialState,
                        loginUser: res.data,
                    } as InitialState);
                    let date = new Date();
                    date.setDate(date.getDate() + 7);
                    document.cookie = `loginToken=${res.data.token}; expires=${date.toUTCString()};`;
                    localStorage.setItem("loginToken", res.data.token ?? "");
                    // 重定向到之前页面
                    window.location.href = searchParams.get('redirect') ?? '/';
                } catch (e: any) {
                    message.error(e.message);
                } finally {
                    hide();
                }
            }
        });
        captcha1.show();
    };

    return (<div
        style={{
            height: '100vh',
            backgroundSize: '100% 100%',
            padding: '32px 0 24px',
        }}
    >
        <LoginForm<UserType.UserLoginRequest>
            title="STAFF 登录"
            subTitle="STAFF专用，普通用户请返回"
            onFinish={async (formData) => {
                await doUserLogin(formData);
            }}
        >
            <>
                <ProFormText
                    name="userName"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'请输入账号'}
                    rules={[{
                        required: true,
                        message: '请输入账号!',
                    },]}
                />
                <ProFormText.Password
                    name="userPassword"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'请输入密码'}
                    rules={[{
                        required: true,
                        message: '请输入密码！',
                    },]}
                />
                <ProFormText
                    name="code"
                    fieldProps={{
                        size: 'large',
                        prefix: <KeyOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'请输入2FA验证码'}
                    rules={[{
                        required: true,
                        message: '请输入2FA验证码!',
                    },]}
                />
                {/*<HCaptcha
                    sitekey="sitekey"
                    onVerify={handleHCaptchaVerify}
                    ref={captchaRef}
                />*/}
            </>
            <div
                style={{
                    marginBottom: 24,
                }}
            >
                <Link
                    to="/"
                    style={{
                        float: 'right',
                    }}
                >
                    返回主页
                </Link>
            </div>
        </LoginForm>
    </div>);
};
