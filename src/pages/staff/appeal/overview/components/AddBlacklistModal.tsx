import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from "@@/exports";
import {ProForm, ProFormTextArea, WaterMark} from '@ant-design/pro-components';
import {addBlacklist} from "@/services/appealService";
import "@/assets/appeal.css"

interface AddBlacklistModalProps {
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
const AddBlacklistModal: React.FC<PropsWithChildren<AddBlacklistModalProps>> = (props) => {
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
        title={"拉黑：" + appeal?.userName}
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
            <ProForm<{
                reason: string;
            }>
                onFinish={async (values) => {
                    const hide = message.loading('正在拉黑');
                    try {
                        let id = loginUser?.id ?? -1;
                        const params: Appeal.AppealBlacklistAddRequest = {
                            userName: appeal?.userName,
                            assignee: id,
                            reason: values.reason
                        }
                        await addBlacklist({...params})
                        message.success('拉黑成功');
                    } catch (e: any) {
                        message.error('拉黑失败，' + e.message);
                    } finally {
                        hide();
                        onFinish();
                    }
                }}
            >
                <ProFormTextArea name="reason"
                                 label="拉黑理由"
                                 width="lg"
                                 placeholder="请输入拉黑理由"
                                 rules={[{required: true}]}/>
            </ProForm>
        </WaterMark>
    </Modal>);
};

export default AddBlacklistModal;
