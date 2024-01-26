import React, {useRef} from "react";
import {useModel} from "@@/exports";
import {ActionType, PageContainer, ProColumns, ProTable, WaterMark} from "@ant-design/pro-components";
import {listBlackListByPage} from "@/services/appealService";
import ReactMarkdown from "react-markdown";

const BlackListPage: React.FC<unknown> = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<Appeal.AppealBlackListVO>[] = [{
        title: 'ID',
        dataIndex: 'id',
    }, {
        title: '用户名',
        dataIndex: 'name',
        search: false,
    }, {
        title: '处理人ID',
        dataIndex: 'assignee',
        hideInTable: true,
        search: false,
    }, {
        title: '处理人',
        dataIndex: 'assigneeName',
        search: false,
    }, {
        title: '原因',
        dataIndex: 'reason',
        search: false,
        render: (_, record) => [// eslint-disable-next-line react/jsx-key
            <ReactMarkdown>
                {record.reason ?? "null"}
            </ReactMarkdown>],
    }, {
        title: '时间',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        search: false,
    },];
    return (<WaterMark
        content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
        fontSize={12}
        fontColor={"rgba(0,0,0,0.005)"}
        gapY={80}
        rotate={-10}>
        <PageContainer>
            <ProTable<Appeal.AppealBlackListVO>
                headerTitle="黑名单列表"
                actionRef={actionRef}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                search={{
                    labelWidth: 'auto',
                }}
                request={async (params, sorter, filter) => {
                    const {
                        data,
                        code
                    } = await listBlackListByPage({
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
                columns={columns}
            />
        </PageContainer>
    </WaterMark>);
};

export default BlackListPage;