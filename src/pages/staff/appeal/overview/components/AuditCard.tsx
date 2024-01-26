import React, {useRef, useState} from "react";
import {useModel} from '@umijs/max';
import {ProForm, ProFormInstance, ProFormSelect, ProFormTextArea, WaterMark} from "@ant-design/pro-components";
import {Badge, Button, Descriptions, message, Skeleton} from "antd";
import {auditAppeal} from "@/services/appealService";
import "@/assets/appeal.css"
import ReasonListModal from "@/pages/staff/appeal/overview/components/ReasonListModal";
import PenaltyOperationModal from "@/pages/staff/appeal/overview/components/PenaltyOperationModal";

interface Props {
    appeal?: Appeal.Appeal;
    userEmail?: string;
    conclusion?: number;
    conclusionReason?: string;
    assignee?: string;
    onFinish?: () => void;
    loading?: boolean;
}

const AuditCard: React.FC<Props> = (props) => {
    const {
        appeal,
        userEmail,
        conclusion,
        conclusionReason,
        assignee,
        onFinish,
        loading,
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const formRef = useRef<ProFormInstance>();
    const [reasonListModalVisible, setReasonListModalVisible] = useState<boolean>(false);
    const [penaltyOperationModalVisible, setPenaltyOperationModalVisible] = useState<boolean>(false);

    return (<div id="detailCard">
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <Skeleton loading={loading} active paragraph={{rows: 6}}>
                <Descriptions title="申诉信息" bordered key="info">
                    <Descriptions.Item label="用户名" span={3}>{appeal?.userName}</Descriptions.Item>
                    <Descriptions.Item label="邮箱" span={3}>{userEmail}</Descriptions.Item>
                    <Descriptions.Item label="申诉ID" span={1.5}>#{appeal?.id}</Descriptions.Item>
                    <Descriptions.Item label="申诉类型"
                                       span={1.5}>{appeal?.appealType === "punish" ? "处罚申诉" : "异常申诉"}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态" span={3}>
                        <Badge
                            status={appeal?.state === 2 ? "success" : (appeal?.state === 1 ? "processing" : "default")}
                            text={appeal?.state === 2 ? "已处理" : (appeal?.state === 1 ? "受理中" : "未受理")}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="受理人" span={3}>{assignee}</Descriptions.Item>
                    {appeal?.state === 2 && (<>
                        <Descriptions.Item label="结论" span={3}>
                            <Badge status={conclusion === 0 ? "success" : (conclusion === 1 ? "error" : "default")}
                                   text={conclusion === 0 ? "通过" : (conclusion === 1 ? "不通过" : "无效")}/>
                        </Descriptions.Item>
                        <Descriptions.Item label="结论理由" span={3}>
                            {conclusionReason}
                        </Descriptions.Item>
                    </>)}
                </Descriptions>
                <br/>
                <ProForm
                    grid={true}
                    formRef={formRef}
                    params={{}}
                    submitter={{
                        render: (props, doms) => {
                            return [...doms, <Button
                                onClick={() => {
                                    setReasonListModalVisible(true);
                                }}
                                key="reasons"
                            >
                                推荐理由列表
                            </Button>, <Button
                                onClick={() => {
                                    setPenaltyOperationModalVisible(true);
                                }}
                                key="penalty_operation"
                            >
                                处罚操作
                            </Button>,];
                        },
                    }}
                    onFinish={async (values) => {
                        const hide = message.loading('正在提交');
                        try {
                            const {
                                conclusion_reason,
                                conclusion
                            } = values;
                            const params: Appeal.AppealAuditRequest = {
                                id: appeal?.id,
                                conclusion: conclusion,
                                conclusionReason: conclusion_reason
                            }
                            await auditAppeal({...params})
                            message.success('提交成功');
                            // @ts-ignore
                            onFinish();
                        } catch (e: any) {
                            message.error(e.message);
                        } finally {
                            hide();
                        }
                    }}
                >
                    <ProFormTextArea name="conclusion_reason"
                                     label="结论理由"
                                     placeholder="请输入结论理由"
                                     rules={[{required: true}]}/>
                    <ProFormSelect
                        label="结论"
                        name="conclusion"
                        options={[{
                            value: 0,
                            label: '通过',
                        }, {
                            value: 1,
                            label: '不通过',
                        }, {
                            value: 2,
                            label: '无效',
                        }]}
                        rules={[{required: true}]}
                    />
                </ProForm>
            </Skeleton>
            <ReasonListModal
                modalVisible={reasonListModalVisible}
                onCancel={() => setReasonListModalVisible(false)}
                onFinish={(reason, type) => {
                    setReasonListModalVisible(false)
                    formRef.current?.setFieldsValue({
                        conclusion_reason: reason,
                        conclusion: type
                    });
                }}
            />
            <PenaltyOperationModal
                appeal={appeal}
                modalVisible={penaltyOperationModalVisible}
                onCancel={() => setPenaltyOperationModalVisible(false)}
                onFinish={() => setPenaltyOperationModalVisible(false)}
            />
        </WaterMark>
    </div>);
}
export default AuditCard;