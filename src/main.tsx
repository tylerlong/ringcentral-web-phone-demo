import 'antd/dist/antd.css';
import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Select, Card} from 'antd';
import localforage from 'localforage';
import RingCentral from '@rc-ex/core';
import WebPhone, {WebPhoneRegistrationData} from 'ringcentral-web-phone';

import incomingAudio from '../assets/incoming.ogg';
import outgoingAudio from '../assets/outgoing.ogg';
import {WebPhoneInvitation} from 'ringcentral-web-phone/lib/session';

class LoginForm {
  serverUrl!: string;
  clientId!: string;
  clientSecret!: string;
  username!: string;
  extension?: string;
  password!: string;
}

let rc: RingCentral;
let loginForm: LoginForm;
const remoteVideoElement = document.getElementById(
  'remote-video'
) as HTMLVideoElement;
const localVideoElement = document.getElementById(
  'local-video'
) as HTMLVideoElement;

const App = () => {
  const login = async (_loginForm: LoginForm) => {
    loginForm = _loginForm;
    await localforage.setItem('wp-login-form', loginForm);
    rc = new RingCentral({
      server: loginForm.serverUrl,
      clientId: loginForm.clientId,
      clientSecret: loginForm.clientSecret,
    });
    await rc.authorize({
      username: loginForm.username,
      extension: loginForm.extension,
      password: loginForm.password,
    });
    message.success('You have logged in!');
    setLoggedIn(true);
    await postLogin();
  };

  const logout = () => {
    setLoggedIn(false);
    if (rc !== undefined) {
      rc.revoke();
    }
    message.success('You have logged out!');
    window.location.reload(); // reload page to clear the state
  };

  const postLogin = async () => {
    const sipInfo = await rc
      .restapi()
      .clientInfo()
      .sipProvision()
      .post({
        sipInfo: [
          {
            transport: 'WSS',
          },
        ],
      });
    const webPhone = new WebPhone(sipInfo as WebPhoneRegistrationData, {
      enableDscp: true,
      clientId: loginForm.clientId,
      audioHelper: {
        enabled: true,
        incoming: incomingAudio,
        outgoing: outgoingAudio,
      },
      logLevel: 0,
      appName: 'NewWebPhoneDemo',
      appVersion: '0.1.0',
      media: {
        remote: remoteVideoElement,
        local: localVideoElement,
      },
      enableQos: true,
      enableMediaReportLogging: true,
    });
    webPhone.userAgent.on!('invite', onInvite);
    webPhone.userAgent.transport.on!('switchBackProxy', () => {
      webPhone.userAgent.transport.reconnect!();
    });
  };

  const onInvite = (session: WebPhoneInvitation) => {
    console.log(session);
    console.log('From', session.request.from.uri.user);
    console.log('To', session.request.to.uri.user);
    setSessions([...sessions, session]);
  };

  const [form] = Form.useForm();
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessions, setSessions] = useState<WebPhoneInvitation[]>([]);

  useEffect(() => {
    (async () => {
      const loginForm = await localforage.getItem('wp-login-form');
      form.setFieldsValue(loginForm);
    })();
  });

  return (
    <>
      <h1>RingCentral Web Phone Demo</h1>
      {loggedIn ? (
        <>
          <video id="remote-video" hidden></video>
          <video id="local-video" hidden muted></video>
          <Button onClick={logout}>Log out</Button>
          {sessions.map(session => (
            <Card
              style={{width: 300}}
              actions={[<Button>Answer</Button>]}
              key={session.id}
            >
              <Card.Meta
                title="Incoming call"
                description={`From ${session.request.from.uri.user}`}
              />
            </Card>
          ))}
        </>
      ) : (
        <Form
          name="basic"
          labelCol={{span: 8}}
          wrapperCol={{span: 8}}
          onFinish={login}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Server URL"
            name="serverUrl"
            rules={[{required: true, message: 'Please input the Server URL!'}]}
          >
            <Select>
              <Select.Option value="https://platform.ringcentral.com">
                https://platform.ringcentral.com
              </Select.Option>
              <Select.Option value="https://platform.devtest.ringcentral.com">
                https://platform.devtest.ringcentral.com
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Client Id"
            name="clientId"
            rules={[{required: true, message: 'Please input the Client Id!'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Client Secret"
            name="clientSecret"
            rules={[
              {required: true, message: 'Please input the Client Secret!'},
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: 'Please input the Username!'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Extension" name="extension">
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: 'Please input the Password!'}]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{offset: 8, span: 8}}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default App;
