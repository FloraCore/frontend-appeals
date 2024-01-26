import {ProColumns, ProTable, WaterMark} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"
import {updateReason} from '@/services/appealService';

interface UpdateModalProps {
    oldData: Appeal.ReasonList;
    modalVisible: boolean;
    columns: ProColumns<Appeal.ReasonList>[];
    onSubmit: () => void;
    onCancel: () => void;
}

/**
 * 更新数据模态框
 */
const handleUpdate = async (fields: Appeal.ReasonList) => {
    const hide = message.loading('正在更新');
    try {
        await updateReason({
            id: fields.id ?? 0,
            ...fields,
        } as Appeal.ReasonUpdateRequest);
        hide();
        message.success('更新成功');
        return true;
    } catch (e: any) {
        hide();
        message.error(e.message);
        return false;
    }
};

/**
 * 更新数据模态框
 */
const UpdateModal: React.FC<PropsWithChildren<UpdateModalProps>> = (props) => {
    const {
        oldData,
        columns,
        modalVisible,
        onSubmit,
        onCancel
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<Modal
        destroyOnClose
        title="编辑"
        open={modalVisible}
        onCancel={() => onCancel()}
        footer={null}
    >
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <ProTable<Appeal.ReasonList, Appeal.ReasonList>
                rowKey="id"
                type="form"
                columns={columns}
                form={{
                    initialValues: oldData,
                }}
                onSubmit={async (values) => {
                    const success = await handleUpdate({
                        ...values,
                        id: oldData.id,
                    });
                    if (success) {
                        onSubmit?.();
                    }
                }}
            />
        </WaterMark>
    </Modal>);
};

export default UpdateModal;
