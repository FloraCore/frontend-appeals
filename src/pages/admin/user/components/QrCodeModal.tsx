import {Modal, QRCode, Skeleton} from 'antd';
import React, {PropsWithChildren} from 'react';
import Logo from "@/assets/logo.png";
import {useModel} from "@@/exports";
import {WaterMark} from '@ant-design/pro-components';
import "@/assets/appeal.css"

interface QrCodeModalProps {
    oldData: UserType.User;
    value?: string;
    modalVisible: boolean;
    onCancel: () => void;
    loading?: boolean;
}

/**
 * 更新数据模态框
 * @param props
 * @constructor
 */
const QrCodeModal: React.FC<PropsWithChildren<QrCodeModalProps>> = (props) => {
    const {
        oldData,
        value,
        modalVisible,
        onCancel,
        loading,
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<Modal
        destroyOnClose
        title={"2FA-二维码 (" + oldData.userName + ")"}
        open={modalVisible}
        onCancel={() => onCancel()}
        footer={null}
        width={250}
    >
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <Skeleton loading={loading} active paragraph={{rows: 6}}>
                <QRCode
                    errorLevel="M"
                    size={200}
                    value={value || ""}
                    icon={Logo}
                />
            </Skeleton>
        </WaterMark>
    </Modal>);
};

export default QrCodeModal;
