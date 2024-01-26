import {deleteUser, get2FAValue, listUserByPage} from '@/services/userService';
import {ActionType, PageContainer, ProColumns, ProTable, WaterMark,} from '@ant-design/pro-components';
import {Button, Divider, message, Popconfirm, Space, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import QrCodeModal from "./components/QrCodeModal";
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"

/**
 * 用户管理页面
 * @constructor
 */
const AdminUserPage: React.FC<unknown> = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const [value, setValue] = useState<string>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<UserType.User>({});
    const [loading, setLoading] = useState(false);
    const actionRef = useRef<ActionType>();
    const init2FAValue = async (record: UserType.User) => {
        try {
            const {data} = await get2FAValue(record?.id || -1)
            setValue(data);
            setLoading(false);
        } catch (e: any) {
            message.error('初始化失败，' + e.message);
            setQrCodeModalVisible(false)
        }
    };
    /**
     *  删除用户
     * @param selectedRows
     */
    const doDelete = async (selectedRows: UserType.User[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) {
            return true;
        }
        try {
            await deleteUser({
                id: selectedRows.find((row) => row.id)?.id || 0,
            });
            message.success('操作成功');
            actionRef.current?.reload();
        } catch (e: any) {
            message.error('操作失败，' + e.message);
        } finally {
            hide();
        }
    };
    /**
     * 表格列配置
     */
    const columns: ProColumns<UserType.User>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            formItemProps: {
                rules: [{
                    required: true,
                    message: "用户名不能为空"
                }
                ],
            },
        },
        {
            title: '邮箱',
            dataIndex: 'userEmail',
            search: false,
            formItemProps: {
                rules: [{
                    required: true,
                    message: "邮箱不能为空"
                }
                ],
            },
        },
        {
            title: '职位',
            dataIndex: 'userPosition',
            valueEnum: {
                'unknown': {text: '未知'},
                'helper': {text: '志愿者'},
                'mod': {text: '客服'},
                'admin': {text: '管理'},
                'executive': {text: '高管'},
                'development': {text: '开发'},
                'owner': {text: '服主'}
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "职位不能为空"
                }
                ],
            },
        },
        {
            title: '密码',
            dataIndex: 'userPassword',
            search: false,
            hideInTable: true,
            formItemProps: {
                rules: [{
                    required: true,
                    message: "密码不能为空"
                }
                ],
            },
        },
        {
            title: '2FA',
            dataIndex: 'userKey',
            hideInForm: true,
            search: false,
            hideInTable: true,
        },
        {
            title: '用户头像',
            dataIndex: 'userAvatar',
            valueType: 'image',
            hideInForm: true,
            search: false,
        },
        {
            title: '性别',
            dataIndex: 'userGender',
            search: false,
            valueEnum: {
                0: {text: '男'},
                1: {text: '女'},
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "性别不能为空"
                }
                ],
            },
        },
        {
            title: '用户权限',
            dataIndex: 'userRole',
            valueEnum: {
                'user': {text: '普通'},
                'admin': {text: '管理员'},
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "用户权限不能为空"
                }
                ],
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInForm: true,
            search: false,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            hideInForm: true,
            search: false,
        },
        {
            title: '是否接受邮件',
            dataIndex: 'acceptMail',
            valueEnum: {
                0: {text: '否'},
                1: {text: '是'},
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "是否接受邮件不能为空"
                }
                ],
            },
        },
        {
            title: '是否封禁',
            dataIndex: 'isBaned',
            valueEnum: {
                0: {text: '否'},
                1: {text: '是'},
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "是否封禁不能为空"
                }
                ],
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <Space split={<Divider type="vertical"/>}>
                    <Typography.Link
                        onClick={() => {
                            setUpdateData(record);
                            setUpdateModalVisible(true);
                        }}
                    >
                        编辑
                    </Typography.Link>
                    <Typography.Link
                        onClick={() => {
                            setUpdateData(record);
                            setLoading(true);
                            setQrCodeModalVisible(true);
                            init2FAValue(record);
                        }}
                    >
                        2FA
                    </Typography.Link>
                    <Popconfirm
                        title="您确定要删除么？"
                        onConfirm={() => doDelete([record])}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <PageContainer>
                <ProTable<UserType.User>
                    headerTitle="用户管理"
                    actionRef={actionRef}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                    search={{
                        labelWidth: 'auto',
                    }}
                    toolBarRender={() => [
                        <Button
                            key="1"
                            type="primary"
                            onClick={() => setCreateModalVisible(true)}
                        >
                            新建
                        </Button>,
                    ]}
                    request={async (params, sorter, filter) => {
                        const {
                            data,
                            code
                        } = await listUserByPage({
                            ...params,
                            // @ts-ignore
                            sorter,
                            filter,
                        });
                        return {
                            data: data?.records || [],
                            success: code === 0,
                            total: data.total,
                        } as any;
                    }}
                    columns={columns}
                />
                <CreateModal
                    modalVisible={createModalVisible}
                    columns={columns}
                    onSubmit={() => {
                        setCreateModalVisible(false);
                        actionRef.current?.reload();
                    }}
                    onCancel={() => setCreateModalVisible(false)}
                />
                <UpdateModal
                    oldData={updateData}
                    modalVisible={updateModalVisible}
                    columns={columns}
                    onSubmit={() => {
                        setUpdateModalVisible(false);
                        actionRef.current?.reload();
                    }}
                    onCancel={() => setUpdateModalVisible(false)}
                />
                <QrCodeModal
                    oldData={updateData}
                    value={value}
                    modalVisible={qrCodeModalVisible}
                    onCancel={() => setQrCodeModalVisible(false)}
                    loading={loading}
                />
            </PageContainer>
        </WaterMark>
    );
};

export default AdminUserPage;