import {ActionType, PageContainer, ProColumns, ProFormTextArea, ProTable, WaterMark,} from '@ant-design/pro-components';
import {Button, Divider, message, Popconfirm, Space, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"
import {deleteMarkdown, listMarkdownsByPage} from "@/services/markdownsService";
import UpdateDrawer from './components/UpdateDrawer';
import {getUserNameById} from "@/services/userService";
import CreateDrawer from "@/pages/admin/markdowns/components/CreateDrawer";

/**
 * MarkDowns管理页面
 * @constructor
 */
const AdminMarkDownsPage: React.FC<unknown> = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const actionRef = useRef<ActionType>();
    const [markdown, setMarkdown] = useState<Markdowns.Markdown>({});
    const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
    const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [participants, setParticipants] = useState<string>();
    const [creator, setCreator] = useState<string>();

    const getParticipantsFromString = async (s: string | undefined) => {
        if (!s) {
            return [];
        }
        if (s === "[]") {
            return [];
        }
        let numArr: number[] = JSON.parse(s);
        let strArr: string[] = [];
        for (let i = 0; i < numArr.length; i++) {
            const {data} = await getUserNameById(numArr[i])
            strArr.push(data);
        }
        setParticipants(strArr.join(","));
    };

    const getCreatorName = async (id: number) => {
        if (id !== -1) {
            const {data} = await getUserNameById(id)
            setCreator(data);
        }
        setLoading(false);
    };
    /**
     *  删除MD
     * @param selectedRows
     */
    const doDelete = async (selectedRows: Markdowns.Markdown[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) {
            return true;
        }
        try {
            await deleteMarkdown({
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
    const columns: ProColumns<Markdowns.Markdown>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
        },
        {
            title: 'UUID',
            dataIndex: 'uuid',
            hideInForm: true,
            search: false,
            hideInTable: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            valueEnum: {
                0: {text: '主页公告'},
                1: {text: '规则'},
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '内容',
            dataIndex: 'content',
            hideInTable: true,
            renderFormItem: () => {
                return <ProFormTextArea
                    fieldProps={{autoSize: true}}/>;
            },
        },
        {
            title: '创建者',
            dataIndex: 'creator',
            hideInForm: true,
            search: false,
            hideInTable: true,
        },
        {
            title: '参与者',
            dataIndex: 'participant',
            hideInForm: true,
            search: false,
            hideInTable: true,
        },
        {
            title: '是否置顶',
            dataIndex: 'top',
            valueEnum: {
                0: {text: '否'},
                1: {text: '是'},
            },
        },
        {
            title: '是否启用',
            dataIndex: 'enabled',
            valueEnum: {
                0: {text: '否'},
                1: {text: '是'},
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
                            setMarkdown(record);
                            setLoading(true);
                            setUpdateDrawerVisible(true);
                            getParticipantsFromString(record.participant);
                            getCreatorName(record.creator as number);
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
                <ProTable<Markdowns.Markdown>
                    headerTitle="Markdowns管理"
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
                            onClick={() => setCreateDrawerVisible(true)}
                        >
                            新建
                        </Button>,
                    ]}
                    request={async (params, sorter, filter) => {
                        const {
                            data,
                            code
                        } = await listMarkdownsByPage({
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
            </PageContainer>
            <UpdateDrawer
                drawerVisible={updateDrawerVisible}
                markdown={markdown}
                columns={columns}
                participants={participants ?? "null"}
                creator={creator ?? "null"}
                onFinish={() => {
                    setUpdateDrawerVisible(false);
                    actionRef.current?.reload();
                }}
                onCancel={() => setUpdateDrawerVisible(false)}
                loading={loading}/>
            <CreateDrawer
                drawerVisible={createDrawerVisible}
                onFinish={() => {
                    setCreateDrawerVisible(false);
                    actionRef.current?.reload();
                }}
                onCancel={() => setCreateDrawerVisible(false)}/>
        </WaterMark>
    );
};

export default AdminMarkDownsPage;