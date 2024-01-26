import React from 'react';
import {Descriptions} from "antd";
import ReactMarkdown from "react-markdown";

interface Props {
    appealReason?: string;
}

/**
 * 查询 基础信息
 */
const DetailAppealReason: React.FC<Props> = (props) => {
    const {
        appealReason,
    } = props;
    return (<Descriptions title="申诉信息" bordered key="appealReason">
        <Descriptions.Item label="申诉理由" span={3}>
            <ReactMarkdown>
                {appealReason ?? "null"}
            </ReactMarkdown>
        </Descriptions.Item>
    </Descriptions>);
};

export default DetailAppealReason;
