import {PageContainer} from "@ant-design/pro-components";
import "@/assets/appeal.css"
import {listMarkdowns} from "@/services/markdownsService";
import React, {useEffect, useState} from "react";
import {Card, Space, Typography} from "antd";
import ReactMarkdown from "react-markdown";
import humanizeDuration from "humanize-duration";
import {getUserNameById} from "@/services/userService";

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

const IndexPage: React.FC = () => {
    const [normalMarkdown, setNormalMarkdown] = useState<Markdowns.Markdown[]>([]);

    const [topMarkdown, setTopMarkdown] = useState<Markdowns.Markdown[]>([]);
    const [topNames, setTopNames] = useState<string[]>([]);
    const [normalNames, setNormalNames] = useState<string[]>([]);
    const initData = async () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await initNormalData();
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await initTopData();
    };
    const initNormalData = async () => {
        const params: Markdowns.MarkdownQueryRequest = {
            type: 0,
            top: 0
        }
        const {data} = await listMarkdowns({...params})
        setNormalMarkdown(data);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await initNormalNames(data);
    };
    const initTopData = async () => {
        const params: Markdowns.MarkdownQueryRequest = {
            type: 0,
            top: 1
        }
        const {data} = await listMarkdowns({...params})
        setTopMarkdown(data);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await initTopNames(data);
    };
    const initTopNames = async (originalList: Markdowns.Markdown[]) => {
        const i: string[] = [];
        for (const element of originalList) {
            const {data} = await getUserNameById(element.creator ?? -1);
            i.push(data);
        }
        setTopNames(i);
    };
    const initNormalNames = async (originalList: Markdowns.Markdown[]) => {
        const i: string[] = [];
        for (const element of originalList) {
            const {data} = await getUserNameById(element.creator ?? -1);
            i.push(data);
        }
        setNormalNames(i);
    };
    useEffect(() => {
        initData();
    }, []);
    return (<div id="indexPage">
        <PageContainer>
            {topMarkdown.map((data: Markdowns.Markdown, index: number) => <>
                <Card key={"top." + index} title={data.title} bordered={false}
                      extra={(<Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                          #{data.id}
                      </Typography.Text>)}>
                    <ReactMarkdown>
                        {data.content ?? "null"}
                    </ReactMarkdown>
                    <div style={{textAlign: 'right'}}>
                        <Space direction="vertical">
                            <Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                                {topNames[index]}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                                {translateTimeCreated(new Date(data.updateTime as any as number))}
                            </Typography.Text>
                        </Space>
                    </div>
                </Card>
                <br/>
            </>)}
            {normalMarkdown.map((data: Markdowns.Markdown, index: number) => <>
                <Card key={"normal." + index} title={data.title} bordered={false}
                      extra={(<Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                          #{data.id}
                      </Typography.Text>)}>
                    <ReactMarkdown>
                        {data.content ?? "null"}
                    </ReactMarkdown>
                    <div style={{textAlign: 'right'}}>
                        <Space direction="vertical">
                            <Typography.Text type="secondary" style={{fontSize: 'smaller'}}>
                                {normalNames[index]}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                                {translateTimeCreated(new Date(data.updateTime as any as number))}
                            </Typography.Text>
                        </Space>
                    </div>
                </Card>
                <br/>
            </>)}
        </PageContainer>
    </div>);
};

export default IndexPage;
