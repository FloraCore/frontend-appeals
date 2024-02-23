import {PageContainer, ProCard, ProFormInstance, ProFormText, StepsForm, WaterMark} from '@ant-design/pro-components';
import {Col, Image, message, Row} from 'antd';
import React, {useRef, useState} from 'react';
import {checkAppeal, getAppealAbnormal, getAppealPunish} from "@/services/appealService";
import {getPunish} from "@/services/litebansService";
import humanizeDuration from "humanize-duration";
import {getUserNameById} from "@/services/userService";
import "@/assets/appeal.css"
import {getPhoto} from "@/services/photoService";
import DetailInfo from "@/components/Detail/Info";
import DetailAppealReason from "@/components/Detail/AppealReason";
import DetailAdmissionInfo from "@/components/Detail/AdmissionInfo";
import DetailConclusionInfo from "@/components/Detail/ConclusionInfo";
import DetailPunishInfo from "@/components/Detail/PunishInfo";

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

const QueryPage: React.FC = () => {
    const formRef = useRef<ProFormInstance>();
    const [userName, setUserName] = useState<string>();
    const [userEmail, setUserEmail] = useState<string>();
    const [id, setID] = useState<number>();
    const [appealType, setAppealType] = useState<string>('punish');
    const [createTime, setCreateTime] = useState<Date>();
    const [processingTime, setProcessingTime] = useState<Date>();
    const [updateTime, setUpdateTime] = useState<Date>();
    const [punishType, setPunishType] = useState<string>();
    const [punishReason, setPunishReason] = useState<string>();
    const [punishID, setPunishID] = useState<number>(-1);
    const [state, setState] = useState<number>(-1);
    const [appealReason, setAppealReason] = useState<string>();
    const [assignee, setAssignee] = useState<string>();
    const [conclusion, setConclusion] = useState<number>(-1);
    const [conclusionReason, setConclusionReason] = useState<string>();
    const [photos, setPhotos] = useState<string[]>([]);

    const abnormalData = async (uuid: string) => {
        const {data} = await getAppealAbnormal(uuid)
        setUserEmail(data?.userEmail)
        setAppealReason(data?.appealReason)
        setConclusion(data?.conclusion ?? -1)
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
        setConclusion(data?.conclusion ?? -1)
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
    const punishInfoData = async (id: number) => {
        if (id !== -1) {
            const {data} = await getPunish(id)
            setPunishReason(data?.reason)
            setPunishType(data?.type)
            setPunishID(data?.punishID ?? -1)
        }
    };
    const getPhotoData = async (originalList: string[]) => {
        const i: string[] = [];
        for (const element of originalList) {
            const {data} = await getPhoto(element);
            i.push(data);
        }
        setPhotos(i);
    };
    const getAssigneeName = async (id: number) => {
        if (id !== -1) {
            const {data} = await getUserNameById(id)
            setAssignee(data);
        }
    };


    const queryView = (<ProCard>
        <StepsForm<{
            name: string;
        }>
            formRef={formRef}
            onFinish={async () => {
                message.success('查询完毕');
                return Promise.resolve(true);
            }}
            formProps={{
                validateMessages: {
                    required: '此项为必填项',
                },
            }}
        >
            <StepsForm.StepForm<{
                name: string;
            }>
                name="info"
                title="基础信息"
                stepProps={{
                    description: '填入提交申诉基本信息',
                }}
                onFinish={async () => {
                    const hide = message.loading('确认中...');
                    try {
                        const name = formRef.current?.getFieldValue("username");
                        const id = formRef.current?.getFieldValue("id");
                        const params: Appeal.AppealCheckRequest = {
                            userName: name,
                            id: id
                        }
                        const {data} = await checkAppeal({...params})
                        const appealType = data?.appealType ?? "punish";
                        const state = data?.state ?? -1;
                        const uuid = data?.uuid ?? "";
                        // TODO: 存在潜在的问题，需要进一步调查
                        const ct = new Date(data?.createTime as any as number);
                        setUserName(name);
                        setID(id);
                        // @ts-ignore
                        setCreateTime(ct);
                        setAppealType(appealType);
                        setState(state);
                        if (appealType === "punish") {
                            await punishData(uuid);
                        } else {
                            await abnormalData(uuid);
                        }
                        console.log(photos);
                        message.success('确认成功！');
                        return true;
                    } catch (e: any) {
                        message.error(e.message);
                        return false;
                    } finally {
                        hide();
                    }
                }}
            >
                <ProFormText
                    name="username"
                    label="用户名"
                    width="lg"
                    placeholder="请输入用户名"
                    rules={[{required: true}]}
                />
                <ProFormText
                    name="id"
                    label="申诉ID"
                    width="lg"
                    placeholder="请输入申诉ID"
                    rules={[{required: true}]}
                    fieldProps={{prefix: "#"}}
                />
                {/*<HCaptcha
                    sitekey="d56c8b17-e245-459b-b709-d3d4eb7a51a3"
                    onVerify={handleHCaptchaVerify}
                    ref={captchaRef}
                />*/}
            </StepsForm.StepForm>
            <StepsForm.StepForm<{
                name: string;
            }>
                name="appeal-info"
                title="申诉信息"
                stepProps={{
                    description: '查询到的申诉信息',
                }}
                onFinish={async () => {
                    return true;
                }}
            >
                <WaterMark
                    content={userName + "(" + String(id) + ")"}
                    fontSize={12}
                    fontColor={"rgba(0,0,0,0.005)"}
                    gapY={80}
                    rotate={-10}>
                    <DetailInfo
                        userName={userName}
                        userEmail={userEmail}
                        id={id}
                        appealType={appealType}
                        createTime={translateTimeCreated(createTime)}
                        state={state}
                    />
                    {appealType === "punish" && (<>
                        <br/>
                        <DetailPunishInfo
                            punishType={punishType}
                            punishReason={punishReason}
                            punishID={punishID}
                            staff={false}
                        />
                    </>)}
                    <br/>
                    <DetailAppealReason
                        appealReason={appealReason}
                    />
                    {photos.map((data: string) => <>
                        <br/>
                        <Image width={100} src={data}/>
                        <br/>
                    </>)}
                    <br/>
                    {state !== 0 && (<DetailAdmissionInfo
                        assignee={assignee}
                        processingTime={translateTimeCreated(processingTime)}
                    />)}
                    <br/>
                    {state === 2 && (<DetailConclusionInfo
                        conclusion={conclusion}
                        conclusionReason={conclusionReason}
                        updateTime={translateTimeCreated(updateTime)}
                    />)}
                    <br/>
                </WaterMark>
            </StepsForm.StepForm>
        </StepsForm>
    </ProCard>);
    return (<div id="queryPage">
        <PageContainer>
            <Row gutter={[12, 12]}>
                <Col
                    xs={24}
                    xl={24}
                    order={1}
                >
                    {queryView}
                </Col>
            </Row>
        </PageContainer>
    </div>);
};

export default QueryPage;
