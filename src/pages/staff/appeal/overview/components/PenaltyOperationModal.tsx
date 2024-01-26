import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from "@@/exports";
import {ProForm, ProFormDependency, ProFormSelect, ProFormText, WaterMark} from '@ant-design/pro-components';
import "@/assets/appeal.css"
import {litebansExecute} from "@/services/litebansService";

interface PenaltyOperationModalProps {
    appeal?: Appeal.Appeal;
    modalVisible: boolean;
    onCancel: () => void;
    onFinish: () => void;
}

/**
 * 更新数据模态框
 * @param props
 * @constructor
 */
const PenaltyOperationModal: React.FC<PropsWithChildren<PenaltyOperationModalProps>> = (props) => {
    const {
        appeal,
        modalVisible,
        onCancel,
        onFinish
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<Modal
        destroyOnClose
        title={"处罚操作：" + appeal?.userName}
        open={modalVisible}
        onCancel={() => onCancel()}
        footer={null}
        width={400}
    >
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <ProForm
                onFinish={async (values) => {
                    const hide = message.loading('正在处理');
                    try {
                        const params: LiteBans.LitebansExecuteRequest = {
                            userName: appeal?.userName,
                            type: values.type,
                            reason: values.reason,
                            date: values.date
                        }
                        await litebansExecute({...params})
                        message.success('处理成功');
                    } catch (e: any) {
                        message.error('处理失败，' + e.message);
                    } finally {
                        hide();
                        onFinish();
                    }
                }}
            >
                <ProFormSelect
                    name="type"
                    label="操作"
                    options={[
                        {
                            label: '封禁',
                            value: 1
                        },
                        {
                            label: '解除封禁',
                            value: 2
                        },
                    ]}
                    placeholder="请选择操作类型"
                    rules={[{
                        required: true,
                        message: '请选择操作类型！'
                    }]}
                />
                <ProFormDependency name={['type']}>
                    {({type}) =>
                        type === 1 ? (
                            <>
                                <ProFormText
                                    name="reason"
                                    label="原因"
                                    placeholder="请输入原因"
                                    rules={[{
                                        required: true,
                                        message: '请输入原因！'
                                    }]}
                                />
                                <ProFormText
                                    name="date"
                                    label="截止日期"
                                    placeholder="请输入日期"
                                    rules={[{
                                        required: true,
                                        message: '请输入日期！'
                                    }]}
                                />
                            </>
                        ) : null
                    }
                </ProFormDependency>
            </ProForm>
        </WaterMark>
    </Modal>);
};

export default PenaltyOperationModal;
