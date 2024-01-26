import {addUser} from '@/services/userService';
import {ProColumns, ProTable, WaterMark} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';
import {useModel} from '@umijs/max';
import "@/assets/appeal.css"

interface CreateModalProps {
    modalVisible: boolean;
    columns: ProColumns<UserType.User>[];
    onSubmit: () => void;
    onCancel: () => void;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: UserType.User) => {
    const hide = message.loading('正在添加');
    try {
        await addUser({...fields} as UserType.UserAddRequest);
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
            <ProTable<UserType.User, UserType.User>
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
