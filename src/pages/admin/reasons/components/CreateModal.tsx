import {ProColumns, ProTable, WaterMark} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"
import {addReason} from '@/services/appealService';

interface CreateModalProps {
    modalVisible: boolean;
    columns: ProColumns<Appeal.ReasonList>[];
    onSubmit: () => void;
    onCancel: () => void;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: Appeal.ReasonList) => {
    const hide = message.loading('正在添加');
    try {
        await addReason({...fields} as Appeal.ReasonAddRequest);
        hide();
        message.success('添加成功');
        return true;
    } catch (e: any) {
        hide();
        message.error(e.message);
        return false;
    }
};

/**
 * 创建数据模态框
 * @param props
 * @constructor
 */
const CreateModal: React.FC<PropsWithChildren<CreateModalProps>> = (props) => {
    const {
        modalVisible,
        columns,
        onSubmit,
        onCancel
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<Modal
        destroyOnClose
        title="新建"
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
                onSubmit={async (value) => {
                    const success = await handleAdd(value);
                    if (success) {
                        onSubmit?.();
                    }
                }}
                rowKey="id"
                type="form"
                columns={columns}
            />
        </WaterMark>
    </Modal>);
};

export default CreateModal;
