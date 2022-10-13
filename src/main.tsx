import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import {Button, Form, Input, Select} from 'antd';
import localforage from 'localforage';

class LoginForm {
  serverUrl!: string;
  clientId!: string;
  clientSecret!: string;
  username!: string;
  extension?: string;
  password!: string;
}

const App = () => {
  const login = async (loginForm: LoginForm) => {
    await localforage.setItem('wp-login-form', loginForm);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const loginForm = await localforage.getItem('wp-login-form');
      form.setFieldsValue(loginForm);
    })();
  });

  return (
    <>
      <h1>RingCentral Web Phone Demo</h1>
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
          rules={[{required: true, message: 'Please input the Client Secret!'}]}
        >
          <Input />
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
    </>
  );
};

export default App;
