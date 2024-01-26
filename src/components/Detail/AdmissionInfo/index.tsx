import React from 'react';
import {Descriptions} from "antd";

interface Props {
    assignee?: string;
    processingTime?: string;
}

/**
 * 查询 基础信息
 */
const DetailAdmissionInfo: React.FC<Props> = (props) => {
    const {
        assignee,
        processingTime,
    } = props;
    return (<Descriptions title="受理信息" bordered key="admissionInfo">
        <Descriptions.Item label="受理人" span={3}>{assignee}</Descriptions.Item>
        <Descriptions.Item label="受理时间" span={3}>
            {processingTime}
        </Descriptions.Item>
    </Descriptions>);
};

export default DetailAdmissionInfo;
