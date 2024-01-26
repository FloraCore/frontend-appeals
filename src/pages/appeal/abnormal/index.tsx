import {
    PageContainer,
    ProCard,
    ProFormInstance,
    ProFormText,
    ProFormTextArea,
    StepsForm
} from '@ant-design/pro-components';
import {Col, message, Modal, Row, Upload} from 'antd';
import React, {useRef, useState} from 'react';

import type {RcFile} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import {addAppealAbnormal, checkAppealAbnormal, checkBlacklist} from "@/services/appealService";
import "@/assets/appeal.css"

// https://ant.design/components/upload
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const AppealNormalPage: React.FC = () => {
    const formRef = useRef<ProFormInstance>();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [photos, setPhotos] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const appealAbnormalView = (<ProCard>
        <StepsForm<{
            name: string;
        }>
            formRef={formRef}
            onFinish={async () => {
                const hide = message.loading('正在提交...');
                try {
                    const appealReason = formRef.current?.getFieldsValue()["appeal-reason"];
                    const promises = photos.map(async (item: UploadFile) => item.originFileObj ? await getBase64(item.originFileObj) : "");
                    const p = await Promise.all(promises);
                    await checkBlacklist(username);
                    const params: Appeal.AppealAddRequest = {
                        userName: username,
                        userEmail: email,
                        appealReason: appealReason,
                        photos: p
                    }
                    const {data} = await addAppealAbnormal({...params})
                    hide();
                    message.success('提交成功');
                    Modal.success({
                        title: "申诉成功（账号异常申诉）",
                        content: (<div>
                            <p>{"玩家：" + username}</p>
                            <p>{"邮箱：" + email}</p>
                            <p>{"申诉ID：#" + data}</p>
                            <p>{"注意：请妥善保管您的申诉ID，此申诉ID仅显示一次。如果丢失，您将只能等待邮件通知而无法主动查询进度。"}</p>
                        </div>),
                    });
                    return Promise.resolve(true);
                } catch (e: any) {
                    hide();
                    message.error(e.message);
                }
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
                    description: '填入申诉基本信息',
                }}
                onFinish={async () => {
                    const hide = message.loading('确认中...');

                    // @ts-ignore
                    const captcha1 = new TencentCaptcha('190231925', async function (res) {
                        if (res.ret === 0) {
                            //console.log(res.ticket)
                            //console.log(res.randstr)
                            try {
                                const name = formRef.current?.getFieldValue("username");
                                await checkAppealAbnormal(name);
                                setUsername(name);
                                setEmail(formRef.current?.getFieldValue("email"));
                                message.success('确认成功！');
                                Modal.info({
                                    title: "玩家：" + name,
                                    content: (<div>
                                        <p>{"邮箱：" + formRef.current?.getFieldValue("email")}</p>
                                    </div>),
                                });
                                return true;
                            } catch (e: any) {
                                message.error(e.message);
                                return false;
                            } finally {
                                hide();
                            }
                        }
                    });
                    captcha1.show();
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
                    name="email"
                    label="邮箱"
                    width="lg"
                    placeholder="请输入邮箱"
                    rules={[{
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '邮箱格式不正确',
                    }, {required: true}]}
                />
            </StepsForm.StepForm>
            <StepsForm.StepForm<{
                name: string;
            }>
                name="appeal"
                title="申诉信息"
                stepProps={{
                    description: '完善申诉信息',
                }}
                onFinish={async () => {
                    // console.log(formRef.current?.getFieldsValue());
                    return true;
                }}
            >
                <ProFormTextArea name="appeal-reason"
                                 label="申诉理由"
                                 width="lg"
                                 placeholder="请输入申诉理由"
                                 rules={[{required: true}]}/>

                <Upload listType="picture-card"
                        fileList={photos}
                        onChange={({fileList: newFileList}) => setPhotos(newFileList)}
                        onPreview={handlePreview}
                        action={(file: RcFile) => getBase64(file)}
                >
                    上传
                </Upload>
                <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                    <img alt="preview" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </StepsForm.StepForm>
        </StepsForm>
    </ProCard>);
    return (<div id="appealAbnormalPage">
        <PageContainer>
            <Row gutter={[12, 12]}>
                <Col
                    xs={24}
                    xl={24}
                    order={1}
                >
                    {appealAbnormalView}
                </Col>
            </Row>
        </PageContainer>
    </div>);
};

export default AppealNormalPage;
