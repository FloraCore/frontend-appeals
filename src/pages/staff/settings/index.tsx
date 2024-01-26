import {PageContainer, WaterMark} from "@ant-design/pro-components";
import {useModel} from '@umijs/max';
import {Button, Card, Col, Descriptions, Row, Space} from "antd";
import React from "react";
import humanizeDuration from "humanize-duration";
import "@/assets/appeal.css"

const humanizer = humanizeDuration.humanizer({
    language: "zh_CN",
    maxDecimalPoints: 0,
    delimiter: " ",
    largest: 1
});

const fillZero2 = (s: number) => {
    if (s < 10) {
        return `0${s}`;
    }
    return s;
};
const translateTimeCreated = (d: Date | undefined) => {
    if (!d) {
        return "";
    }
    const t = d.getTime();
    const offset = Date.now() - t;
    if (offset < 5 * 60 * 1000) {
        return "刚刚";
    }
    if (offset > 7 * 24 * 60 * 60 * 1000) {
        return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
    }
    const s = humanizer(offset) + "前";
    return s;
};

const SettingsPage: React.FC = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    return (<div id="settingsPage">
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <PageContainer>
                <Card title="基础信息">
                    <Descriptions bordered key="info">
                        <Descriptions.Item label="用户名" span={3}>{loginUser?.userName}</Descriptions.Item>
                        <Descriptions.Item label="邮箱" span={3}>{loginUser?.userEmail}</Descriptions.Item>
                        <Descriptions.Item label="创建时间" span={3}>
                            {translateTimeCreated(new Date(loginUser?.createTime as any as number))}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间" span={3}>
                            {translateTimeCreated(new Date(loginUser?.updateTime as any as number))}
                        </Descriptions.Item>
                    </Descriptions>
                    <br/>
                    <Space>
                        <Row>
                            <Col>
                                <Card bordered={false}>
                                    <Button block>
                                        修改头像
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card bordered={false}>
                                    <Button block>
                                        修改性别
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card bordered={false}>
                                    <Button block>
                                        修改密码
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card bordered={false}>
                                    <Button block>
                                        获取2FA二维码
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card bordered={false}>
                                    <Button block>
                                        是否接受邮件
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Space>
                </Card>
            </PageContainer>
        </WaterMark>
    </div>);
};

export default SettingsPage;
