import {ProColumns, ProForm, ProTable, WaterMark} from '@ant-design/pro-components';
import React, {PropsWithChildren, useState} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"
import {Card, Descriptions, Drawer, message, Skeleton, Space, Tabs, Typography} from 'antd';
import {updateMarkdown} from "@/services/markdownsService";
import TabPane from 'antd/es/tabs/TabPane';
import ReactMarkdown from 'react-markdown';
import humanizeDuration from "humanize-duration";

const humanizer = humanizeDuration.humanizer({
    language: "zh_CN",
    maxDecimalPoints: 0,
    delimiter: " ",
    largest: 1
});

const fillZero2 = (s: number) => {
    if (s < 10) {
        return `0${s}`;
    }
    return s;
};

interface UpdateCardProps {
    drawerVisible: boolean;
    markdown: Markdowns.Markdown;
    columns: ProColumns<Markdowns.Markdown>[];
    participants: string;
    creator: string;
    onFinish?: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const translateTimeCreated = (d: Date | undefined) => {
    if (!d) {
        return "";
    }
    const t = d.getTime();
    const offset = Date.now() - t;
    if (offset < 5 * 60 * 1000) {
        return "刚刚";
    }
    if (offset > 7 * 24 * 60 * 60 * 1000) {
        return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
    }
    const s = humanizer(offset) + "前";
    return s;
};

/**
 * 更新数据模态框
 */
const UpdateDrawer: React.FC<PropsWithChildren<UpdateCardProps>> = (props) => {
    const {
        drawerVisible,
        markdown,
        columns,
        participants,
        creator,
        onFinish,
        onCancel,
        loading
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const [form] = ProForm.useForm();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [activeKey, setActiveKey] = useState('1');

    const handleReset = () => {
        setActiveKey('1');
    };

    return (<Drawer
        destroyOnClose={true}
        contentWrapperStyle={{
            width: '70%',
            minWidth: 420
        }}
        closable={false}
        onClose={() => {
            form.resetFields();
            onCancel();
            handleReset();
        }}
        open={drawerVisible}
    >
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <Skeleton loading={loading} active paragraph={{rows: 8}}>
                <Tabs activeKey={activeKey} onChange={setActiveKey}>
                    <TabPane tab="编辑" key="1">
                        <Descriptions title="基础信息" bordered key="info">
                            <Descriptions.Item label="创建人" span={3}>{creator}</Descriptions.Item>
                            <Descriptions.Item label="参与者" span={3}>{participants}</Descriptions.Item>
                        </Descriptions>
                        <br/>
                        <ProTable<Markdowns.Markdown, Markdowns.Markdown>
                            rowKey="id"
                            type="form"
                            columns={columns}
                            form={{
                                initialValues: markdown,
                                onValuesChange: (changedValues) => {
                                    if (changedValues.title) {
                                        setTitle(changedValues.title);
                                    } else if (changedValues.content) {
                                        setContent(changedValues.content);
                                    }
                                },
                            }}
                            onSubmit={async (values) => {
                                const hide = message.loading('正在更新');
                                try {
                                    const id = markdown.id;
                                    await updateMarkdown({id, ...values} as Markdowns.MarkdownUpdateRequest);
                                    hide();
                                    message.success('更新成功');
                                } catch (e: any) {
                                    hide();
                                    message.error(e.message);
                                } finally {
                                    form.resetFields();
                                    onFinish?.();
                                }
                            }}
                        />
                    </TabPane>
                    <TabPane tab="预览" key="2">
                        <Card title={title === '' ? form.getFieldsValue()["title"] : title} bordered={false}>
                            <ReactMarkdown>
                                {content === '' ? form.getFieldsValue()["content"] : content}
                            </ReactMarkdown>
                            <div style={{textAlign: 'right'}}>
                                <Space direction="vertical">
                                    <Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                                        {creator}
                                    </Typography.Text>
                                    <Typography.Text type="secondary">
                                        {translateTimeCreated(new Date(markdown?.updateTime as any as number))}
                                    </Typography.Text>
                                </Space>
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            </Skeleton>
        </WaterMark>
    </Drawer>);
};

export default UpdateDrawer;
