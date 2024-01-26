import React from 'react';
import {Descriptions} from "antd";

interface Props {
    punishType?: string;
    punishReason?: string;
    punishID?: number;
    bannedByName?: string;
    time?: string;
    until?: string;
    tud?: string;
    staff?: boolean;
}

/**
 * 查询 基础信息
 */
const DetailPunishInfo: React.FC<Props> = (props) => {
    const {
        punishType,
        punishReason,
        punishID,
        bannedByName,
        time,
        until,
        tud,
        staff
    } = props;
    return (<Descriptions title="处罚信息" bordered key="punishInfo">
        <Descriptions.Item label="处罚类型" span={3}>
            {(punishType === "ban" ? "封禁" : (punishType === "mute" ? "禁言" : "未知"))}
        </Descriptions.Item>
        <Descriptions.Item label="处罚原因" span={3}>{punishReason}</Descriptions.Item>
        {staff && (<Descriptions.Item label="处罚人" span={3}>
            {bannedByName === "Console" ? "控制台" : bannedByName}
        </Descriptions.Item>)}
        <Descriptions.Item label="处罚ID：" span={3}>#{punishID}</Descriptions.Item>
        {staff && (<>
            <Descriptions.Item label="处罚时间：" span={3}>
                {time}
            </Descriptions.Item>
            <Descriptions.Item label="过期时间：" span={3}>
                {until}
            </Descriptions.Item>
            <Descriptions.Item label="申诉时间差：" span={3}>
                {tud}
            </Descriptions.Item>
        </>)}
    </Descriptions>);
};

export default DetailPunishInfo;
