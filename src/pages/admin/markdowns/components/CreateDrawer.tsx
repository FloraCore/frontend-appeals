import {ProForm, ProFormSelect, ProFormText, ProFormTextArea, WaterMark} from '@ant-design/pro-components';
import React, {PropsWithChildren, useState} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"
import {Card, Drawer, message, Space, Tabs, Typography} from 'antd';
import {addMarkdown} from "@/services/markdownsService";
import TabPane from 'antd/es/tabs/TabPane';
import ReactMarkdown from 'react-markdown';

interface CreateCardProps {
    drawerVisible: boolean;
    onFinish?: () => void;
    onCancel: () => void;
}

/**
 * 更新数据模态框
 */
const UpdateDrawer: React.FC<PropsWithChildren<CreateCardProps>> = (props) => {
    const {
        drawerVisible,
        onFinish,
        onCancel
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

    const handleValuesChange = (changedValues: { title: string; content: string; }) => {
        if (changedValues.title) {
            setTitle(changedValues.title);
        } else if (changedValues.content) {
            setContent(changedValues.content);
        }
    };

    return (<Drawer
        destroyOnClose
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
            <Tabs activeKey={activeKey} onChange={setActiveKey}>
                <TabPane tab="添加" key="1">
                    <ProForm
                        name="markdown-form"
                        form={form}
                        onValuesChange={handleValuesChange}
                        onFinish={async (value) => {
                            const hide = message.loading('正在添加');
                            try {
                                await addMarkdown({...value} as Markdowns.MarkdownAddRequest);
                                hide();
                                message.success('添加成功');
                            } catch (e: any) {
                                hide();
                                message.error(e.message);
                            } finally {
                                onFinish?.();
                                form.resetFields();
                            }
                        }}
                    >
                        <ProFormSelect
                            name="type"
                            label="类型"
                            valueEnum={{
                                0: '主页公告',
                                1: '规则',
                            }}
                            placeholder="请选择类型"
                            rules={[{required: true}]}
                        />
                        <ProFormText
                            name="title"
                            label="标题"
                            placeholder="请输入标题"
                            rules={[{required: true}]}
                        />
                        <ProFormTextArea name="content"
                                         label="内容"
                                         fieldProps={{autoSize: true}}
                                         placeholder="请输入内容"
                                         rules={[{required: true}]}/>
                        <ProFormSelect
                            name="top"
                            label="是否置顶"
                            valueEnum={{
                                0: '否',
                                1: '是',
                            }}
                            placeholder="请选择是否置顶"
                            rules={[{required: true}]}
                        />
                        <ProFormSelect
                            name="enabled"
                            label="是否启用"
                            valueEnum={{
                                0: '否',
                                1: '是',
                            }}
                            placeholder="请选择是否启用"
                            rules={[{required: true}]}
                        />
                    </ProForm>
                </TabPane>
                <TabPane tab="预览" key="2">
                    <Card title={title === '' ? "标题" : title} bordered={false}>
                        <ReactMarkdown>
                            {content === '' ? "内容" : content}
                        </ReactMarkdown>
                        <div style={{textAlign: 'right'}}>
                            <Space direction="vertical">
                                <Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                                    {loginUser?.userName}
                                </Typography.Text>
                            </Space>
                        </div>
                    </Card>
                </TabPane>
            </Tabs>
        </WaterMark>
    </Drawer>);
};

export default UpdateDrawer;
