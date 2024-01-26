import {ActionType, PageContainer, ProColumns, ProTable, WaterMark} from "@ant-design/pro-components";
import {useModel} from '@umijs/max';
import {
    acceptAppeal,
    checkAuditAppeal,
    checkBlacklist,
    getAppealAbnormal,
    getAppealPunish,
    listAppealByPage
} from "@/services/appealService";
import {Divider, Drawer, message, Space, Typography} from "antd";
import React, {useRef, useState} from "react";
import DetailCard from "@/pages/staff/appeal/overview/components/DetailCard";
import {getUserNameById} from "@/services/userService";
import {getPunish} from "@/services/litebansService";
import AuditCard from "@/pages/staff/appeal/overview/components/AuditCard";
import AddBlacklistModal from "@/pages/staff/appeal/overview/components/AddBlacklistModal";
import "@/assets/appeal.css"
import {getPhoto} from "@/services/photoService";

const getPhotosFromString = (s: string | undefined) => {
    if (!s) {
        return [];
    }
    if (s === "[]") {
        return [];
    }
    const arr = s.substring(1, s.length - 1).split(", ");
    return arr;
    //return JSON.parse(s.replace(/data\:/g, '"data:').replace("]", '"]').replace(/,( ?)"/g, '","'));
};

const OverviewPage: React.FC = () => {
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;
    const [appeal, setAppeal] = useState<Appeal.Appeal>({} as Appeal.Appeal,);
    const [openDetail, setOpenDetail] = useState(false);
    const [openAudit, setOpenAudit] = useState(false);
    const [userEmail, setUserEmail] = useState<string>();
    const [appealReason, setAppealReason] = useState<string>();
    const [photos, setPhotos] = useState<string[]>([]);
    const [assignee, setAssignee] = useState<string>();
    const [processingTime, setProcessingTime] = useState<Date>();
    const [conclusion, setConclusion] = useState<number>(-1);
    const [conclusionReason, setConclusionReason] = useState<string>();
    const [updateTime, setUpdateTime] = useState<Date>();
    const [punishInfo, setPunishInfo] = useState<LiteBans.PunishInfoVO>({} as LiteBans.PunishInfoVO,);
    const [addBlacklistModalVisible, setAddBlacklistModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const actionRef = useRef<ActionType>();
    const accept = async (record: Appeal.Appeal) => {
        const hide = message.loading('正在受理');
        try {
            const params: Appeal.AppealAcceptRequest = {
                appealID: record.id,
                userID: loginUser?.id
            }
            await acceptAppeal({...params})
            message.success('受理成功');
            actionRef.current?.reload();
        } catch (e: any) {
            message.error('受理失败，' + e.message);
            setOpenDetail(false);
        } finally {
            hide();
        }
    }

    const checkAudit = async (record: Appeal.Appeal) => {
        try {
            const params: Appeal.AppealAuditCheckRequest = {
                appealID: record.id,
                userID: loginUser?.id
            }
            await checkAuditAppeal({...params})
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            await initData(record);
        } catch (e: any) {
            message.error(e.message);
        }
    }

    const initData = async (record: Appeal.Appeal) => {
        try {
            if (record.appealType === "punish") {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                await punishData(record.uuid);
            } else {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                await abnormalData(record.uuid);
            }
            setLoading(false);
        } catch (e: any) {
            message.error('初始化失败，' + e.message);
            setOpenDetail(false);
            setOpenAudit(false);
        }
    };

    const abnormalData = async (uuid: string) => {
        const {data} = await getAppealAbnormal(uuid)
        setUserEmail(data?.userEmail)
        setAppealReason(data?.appealReason)
        // @ts-ignore
        setConclusion(data?.conclusion)
        setConclusionReason(data?.conclusionReason)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await getPhotoData(getPhotosFromString(data?.photos));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await getAssigneeName(data?.assignee ?? -1)
        const pt = new Date(data?.processingTime as any as number);
        setProcessingTime(pt)
        const ut = new Date(data?.updateTime as any as number);
        setUpdateTime(ut)
    };
    const punishData = async (uuid: string) => {
        const {data} = await getAppealPunish(uuid)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await punishInfoData(data?.punishInfo ?? -1)
        setUserEmail(data?.userEmail)
        setAppealReason(data?.appealReason)
        // @ts-ignore
        setConclusion(data?.conclusion)
        setConclusionReason(data?.conclusionReason)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await getPhotoData(getPhotosFromString(data?.photos));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await getAssigneeName(data?.assignee ?? -1)
        const pt = new Date(data?.processingTime as any as number);
        setProcessingTime(pt)
        const ut = new Date(data?.updateTime as any as number);
        setUpdateTime(ut)
    };
    const getPhotoData = async (originalList: string[]) => {
        const i: string[] = [];
        for (const element of originalList) {
            const {data} = await getPhoto(element);
            i.push(data);
        }
        setPhotos(i);
    };
    const punishInfoData = async (id: number) => {
        if (id !== -1) {
            const {data} = await getPunish(id)
            setPunishInfo(data);
        }
    };
    const getAssigneeName = async (id: number) => {
        if (id !== -1) {
            const {data} = await getUserNameById(id)
            setAssignee(data);
        }
    };
    const onDetailClose = () => {
        setOpenDetail(false);
    };

    const onAuditClose = () => {
        setOpenAudit(false);
    };

    const columns: ProColumns<Appeal.Appeal>[] = [{
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
    }, {
        title: '用户名',
        dataIndex: 'userName',
    }, {
        title: '申诉类型',
        dataIndex: 'appealType',
        valueEnum: {
            'punish': {text: '处罚申诉'},
            'abnormal': {text: '异常申诉'},
        }
    }, {
        title: '申诉时间',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        search: false
    }, {
        title: '受理状态',
        dataIndex: 'state',
        sorter: true,
        valueEnum: {
            0: {
                text: '未受理',
                status: 'default'
            },
            1: {
                text: '受理中',
                status: 'processing'
            },
            2: {
                text: '已处理',
                status: 'success'
            },
        },
    }, {
        title: '操作',
        width: 190,
        key: 'option',
        valueType: 'option', // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_, record) => [// eslint-disable-next-line react/jsx-key
            <Space split={<Divider type="vertical"/>}>
                <Typography.Link
                    onClick={() => {
                        setAppeal(record);
                        setLoading(true);
                        setOpenDetail(true);
                        initData(record);
                    }}>
                    详情
                </Typography.Link>
                <Typography.Link
                    onClick={async () => {
                        try {
                            await checkBlacklist(record.userName as string);
                            setAppeal(record);
                            setAddBlacklistModalVisible(true);
                        } catch (e: any) {
                            message.error(e.message);
                        }
                    }}>
                    拉黑
                </Typography.Link>
                {record.state === 0 ? <Typography.Link
                    onClick={() => {
                        accept(record);
                    }}>
                    受理
                </Typography.Link> : <Typography.Link
                    onClick={() => {
                        setAppeal(record);
                        setLoading(true);
                        checkAudit(record);
                        setOpenAudit(true);
                    }}>
                    操作
                </Typography.Link>}
            </Space>],
    },];
    return (<div id="overviewPage">
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <PageContainer>
                <ProTable<Appeal.Appeal>
                    actionRef={actionRef}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                    columns={columns}
                    dateFormatter="string"
                    headerTitle="申诉总览"
                    search={{
                        labelWidth: 'auto',
                    }}
                    request={async (params, sorter) => {
                        const searchParams: Appeal.AppealQueryRequest = {
                            ...params,
                        };
                        // eslint-disable-next-line guard-for-in
                        for (const key in sorter) {
                            searchParams.sortField = key;
                            searchParams.sortOrder = sorter[key] as any;
                        }
                        const {
                            data,
                            code
                        } = await listAppealByPage(searchParams);
                        return {
                            data: data?.records || [],
                            success: code === 0,
                            total: data.total,
                        } as any;
                    }}
                />
            </PageContainer>
            <Drawer
                contentWrapperStyle={{
                    width: '50%',
                    minWidth: 320
                }}
                closable={false}
                onClose={onDetailClose}
                open={openDetail}
            >
                <DetailCard appeal={appeal}
                            userEmail={userEmail}
                            appealReason={appealReason}
                            photos={photos}
                            assignee={assignee}
                            processingTime={processingTime}
                            conclusion={conclusion}
                            conclusionReason={conclusionReason}
                            updateTime={updateTime}
                            punishInfo={punishInfo}
                            loading={loading}/>
            </Drawer>
            <Drawer
                contentWrapperStyle={{
                    width: '60%',
                    minWidth: 350
                }}
                closable={false}
                onClose={onAuditClose}
                open={openAudit}
            >
                <AuditCard appeal={appeal}
                           userEmail={userEmail}
                           conclusion={conclusion}
                           conclusionReason={conclusionReason}
                           assignee={assignee}
                           onFinish={() => {
                               onAuditClose()
                               actionRef.current?.reload();
                           }}
                           loading={loading}/>
            </Drawer>
            <AddBlacklistModal
                appeal={appeal}
                modalVisible={addBlacklistModalVisible}
                onCancel={() => setAddBlacklistModalVisible(false)}
                onFinish={() => setAddBlacklistModalVisible(false)}
            />
        </WaterMark>
    </div>);
};

export default OverviewPage;
