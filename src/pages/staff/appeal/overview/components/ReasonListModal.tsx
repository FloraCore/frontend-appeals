import {Modal, Space, Tag} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from "@@/exports";
import "@/assets/appeal.css"
import {ProList, WaterMark} from '@ant-design/pro-components';
import {listReasonByPage} from "@/services/appealService";

interface ReasonListCardProps {
    modalVisible: boolean;
    onCancel: () => void;
    onFinish: (reason: string, type: number) => void;
}

type ReasonList = {
    id?: number;
    title?: string;
    reason?: string;
    type?: number;
    createTime?: Date;
    updateTime?: Date;
};

/**
 * 更新数据模态框
 * @param props
 * @constructor
 */
const ReasonListModal: React.FC<PropsWithChildren<ReasonListCardProps>> = (props) => {
    const {
        modalVisible,
        onCancel,
        onFinish
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<Modal
        destroyOnClose
        title={"推荐理由列表 [BETA]"}
        open={modalVisible}
        onCancel={() => onCancel()}
        footer={null}
        width={600}
    >
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <ProList<ReasonList>
                ghost={false}
                pagination={{
                    defaultPageSize: 4,
                    showSizeChanger: false,
                }}
                showActions="hover"
                search={{
                    filterType: 'light',
                }}
                rowSelection={{}}
                grid={{
                    gutter: 16,
                    column: 2
                }}
                onItem={(record: any) => {
                    return {
                        onClick: () => {
                            console.log(record);
                            onFinish(record?.reason, record?.type)
                        },
                    };
                }}
                metas={{
                    title: {
                        dataIndex: 'title',
                        search: false,
                    },
                    subTitle: {
                        dataIndex: 'type',
                        render: (type) => {
                            return (<Space size={0}>
                                {type === 0 ? <Tag color="#5BD8A6">通过</Tag> : type === 1 ?
                                    <Tag color="red">不通过</Tag> : <Tag color="#708090">无效</Tag>}
                            </Space>);
                        },
                        search: false,
                    },
                    content: {
                        dataIndex: 'reason',
                        search: false,
                    },
                    status: {
                        dataIndex: 'type',
                        // 自己扩展的字段，主要用于筛选，不在列表中显示
                        title: '结论类型',
                        valueType: 'select',
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
                    },
                }}
                request={async (params, sorter, filter) => {
                    const {
                        data,
                        code
                    } = await listReasonByPage({
                        ...params, // @ts-ignore
                        sorter,
                        filter,
                    });
                    return {
                        data: data?.records || [],
                        success: code === 0,
                        total: data.total,
                    } as any;
                }}
            />
        </WaterMark>
    </Modal>);
};

export default ReasonListModal;
