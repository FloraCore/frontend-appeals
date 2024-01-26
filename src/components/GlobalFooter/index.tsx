// noinspection JSIgnoredPromiseFromCall

import {GithubOutlined, GlobalOutlined,} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import './index.less';
import {getICPCode, getICPInformation} from "@/services/webService";

/**
 * 全局 Footer
 */
const GlobalFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [icpInformation, setIcpInformation] = useState<string>("ICP备案号");
    const [icpCode, setIcpCode] = useState<string>("");

    const initIcpInformation = async () => {
        const {data} = await getICPInformation()
        setIcpInformation(data);
    };

    const initIcpCode = async () => {
        const {data} = await getICPCode()
        setIcpCode(data);
    };

    useEffect(() => {
        initIcpInformation();
        initIcpCode();
    }, []);

    // noinspection HtmlRequiredAltAttribute
    return (
        <DefaultFooter
            className="default-footer"
            copyright={`${currentYear} Inf NetWork`}
            links={[
                {
                    key: 'xLikeWATCHDOG',
                    title: (
                        <>
                            <GithubOutlined/> xLikeWATCHDOG
                        </>
                    ),
                    href: 'https://github.com/xLikeWATCHDOG',
                    blankTarget: true,
                },
                {
                    key: 'ICP-备案信息',
                    title: (
                        <>
                            <GlobalOutlined/> {icpInformation}
                        </>
                    ),
                    href: 'https://beian.miit.gov.cn/',
                    blankTarget: true,
                },
            ]}
        />
    );
};

export default GlobalFooter;
