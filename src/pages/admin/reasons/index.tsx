import {ActionType, PageContainer, ProColumns, ProFormTextArea, ProTable, WaterMark,} from '@ant-design/pro-components';
import {Button, Divider, message, Popconfirm, Space, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import "@/assets/appeal.css"
import {deleteReason, listReasonByPage} from "@/services/appealService";
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import {useModel} from '@umijs/max';

/**
 * 理由管理页面
 * @constructor
 */
const AdminReasonsPage: React.FC<unknown> = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const actionRef = useRef<ActionType>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<Appeal.ReasonList>({});
    const doDelete = async (selectedRows: Appeal.ReasonList[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) {
            return true;
        }
        try {
            await deleteReason({
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
    const columns: ProColumns<Appeal.ReasonList>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
        },
        {
            title: '标题',
            dataIndex: 'title',
            formItemProps: {
                rules: [{
                    required: true,
                    message: "标题不能为空"
                }
                ],
            },
        },
        {
            title: '理由',
            dataIndex: 'reason',
            hideInTable: true,
            search: false,
            formItemProps: {
                rules: [{
                    required: true,
                    message: "理由不能为空"
                }
                ],
            },
            renderFormItem: () => {
                return <ProFormTextArea
                    fieldProps={{autoSize: true}}/>;
            },
        }, {
            title: '结论',
            dataIndex: 'type',
            sorter: true,
            valueEnum: {
                0: {
                    text: '通过',
                    status: 'success'
                },
                1: {
                    text: '不通过',
                    status: 'error'
                },
                2: {
                    text: '无效',
                    status: 'default'
                },
            },
            formItemProps: {
                rules: [{
                    required: true,
                    message: "结论不能为空"
                }
                ],
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
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
                <ProTable<Appeal.ReasonList>
                    headerTitle="推荐理由管理"
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
                        } = await listReasonByPage({
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
            </PageContainer>
        </WaterMark>
    );
};

export default AdminReasonsPage;