import React from 'react';
import {Badge, Descriptions, Typography} from "antd";

interface Props {
    userName?: string;
    userEmail?: string;
    id?: number;
    appealType?: string;
    createTime?: string;
    state?: number;
}

/**
 * 查询 基础信息
 */
const DetailInfo: React.FC<Props> = (props) => {
    const {
        userName,
        userEmail,
        id,
        appealType,
        createTime,
        state,
    } = props;
    return (<Descriptions title="基础信息" bordered key="info">
        <Descriptions.Item label="用户名" span={3}>
            <Typography.Text>
                {userName}
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="邮箱" span={3}>
            <Typography.Text>
                {userEmail}
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="申诉ID" span={1.5}>
            <Typography.Text>
                #{id}
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="申诉类型" span={1.5}>
            <Typography.Text>
                {appealType === "punish" ? "处罚申诉" : "异常申诉"}
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="申诉时间" span={3}>
            <Typography.Text>
                {createTime}
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="状态" span={3}>
            <Badge status={state === 2 ? "success" : (state === 1 ? "processing" : "default")}
                   text={state === 2 ? "已处理" : (state === 1 ? "受理中" : "未受理")}/>
        </Descriptions.Item>
    </Descriptions>);
};

export default DetailInfo;
