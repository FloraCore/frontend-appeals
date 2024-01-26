import React from 'react';
import {Badge, Descriptions, Typography} from "antd";
import ReactMarkdown from "react-markdown";

interface Props {
    conclusion?: number;
    conclusionReason?: string;
    updateTime?: string;
}

/**
 * 查询 基础信息
 */
const DetailConclusionInfo: React.FC<Props> = (props) => {
    const {
        conclusion,
        conclusionReason,
        updateTime,
    } = props;
    return (<Descriptions title="结论" bordered key="conclusionInfo">
        <Descriptions.Item label="结论" span={3}>
            <Badge status={conclusion === 0 ? "success" : (conclusion === 1 ? "error" : "default")}
                   text={conclusion === 0 ? "通过" : (conclusion === 1 ? "不通过" : "无效")}/>
        </Descriptions.Item>
        <Descriptions.Item label="结论理由" span={3}>
            <Typography.Text>
                <ReactMarkdown>
                    {conclusionReason ?? "null"}
                </ReactMarkdown>
            </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="更新时间" span={3}>
            <Typography.Text>
                {updateTime}
            </Typography.Text>
        </Descriptions.Item>
    </Descriptions>);
};

export default DetailConclusionInfo;
