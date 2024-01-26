import {Image, Skeleton} from "antd";
import React from "react";
import humanizeDuration from "humanize-duration";
import {useModel} from '@umijs/max';
import {WaterMark} from "@ant-design/pro-components";
import "@/assets/appeal.css"
import {differenceInMinutes} from "date-fns";
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

const getTime = (d: Date | undefined) => {
    if (!d) {
        return "";
    }
    return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
};

const getTimeDifference = (d1: Date | undefined, d2: Date | undefined) => {
    if (!d1 || !d2) {
        return "";
    }
    let m = differenceInMinutes(d1, d2);

    if (m < 0) {
        return "时间未同步，无法进行有效计算。";
    }
    if (m >= 60) {
        return "超过有效申诉时间";
    }
    return m + " 分钟";
};

interface Props {
    appeal?: Appeal.Appeal;
    userEmail?: string;
    appealReason?: string;
    photos?: string[];
    assignee?: string;
    processingTime?: Date;
    conclusion?: number;
    conclusionReason?: string;
    updateTime?: Date;
    punishInfo?: LiteBans.PunishInfoVO;
    loading?: boolean;
}

const DetailCard: React.FC<Props> = (props) => {
    const {
        appeal,
        userEmail,
        appealReason,
        photos = [],
        assignee,
        processingTime,
        conclusion = -1,
        conclusionReason,
        updateTime,
        punishInfo,
        loading,
    } = props;
    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    return (<div id="detailCard">
        <WaterMark
            content={loginUser?.userName + "(" + String(loginUser?.id) + ")"}
            fontSize={12}
            fontColor={"rgba(0,0,0,0.005)"}
            gapY={80}
            rotate={-10}>
            <Skeleton loading={loading} active paragraph={{rows: 6}}>
                <DetailInfo
                    userName={appeal?.userName}
                    userEmail={userEmail}
                    id={appeal?.id}
                    appealType={appeal?.appealType}
                    createTime={translateTimeCreated(new Date(appeal?.createTime as any as number))}
                    state={appeal?.state}
                />
                {appeal?.appealType === "punish" && (<>
                    <br/>
                    <DetailPunishInfo
                        punishType={punishInfo?.type}
                        punishReason={punishInfo?.reason}
                        punishID={punishInfo?.punishID}
                        staff={true}
                        bannedByName={punishInfo?.bannedByName === "Console" ? "控制台" : punishInfo?.bannedByName}
                        time={translateTimeCreated(new Date(punishInfo?.time ? punishInfo?.time : -1))}
                        until={(punishInfo?.until ? punishInfo?.until : -1) <= 0 ? "永久" : getTime(new Date((punishInfo?.until ? punishInfo?.until : -1)))}
                        tud={getTimeDifference(new Date(appeal?.createTime as any as number), new Date(punishInfo?.time ? punishInfo?.time : -1))}
                    />
                </>)}
                <br/>
                <DetailAppealReason
                    appealReason={appealReason}
                />
                {photos.map((dataUrl: string) => <>
                    <br/>
                    <Image width={100} src={dataUrl}/>
                    <br/>
                </>)}
                <br/>
                {appeal?.state !== 0 && (<DetailAdmissionInfo
                    assignee={assignee}
                    processingTime={translateTimeCreated(processingTime)}
                />)}
                <br/>
                {appeal?.state === 2 && (<DetailConclusionInfo
                    conclusion={conclusion}
                    conclusionReason={conclusionReason}
                    updateTime={translateTimeCreated(updateTime)}
                />)}
                <br/>
            </Skeleton>
        </WaterMark>
    </div>);
}
export default DetailCard;