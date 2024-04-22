import React, { useState } from "react";
import { Form, Input, Button, Card, Flex, Upload } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Card
        title={isLogin ? "LOGIN" : "SIGNUP"}
        style={{
          width: 400,
          background: "rgba(256, 256, 256, 0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Form
          name=""
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Flex vertical gap={12}>
            {!isLogin && (
              <Input
                placeholder="Name"
                name="name"
                variant="outlined"
                prefix={<UserOutlined />}
                style={{ background: "transparent", color: "white" }}
                rules={[{ required: true, message: "Please input your name!" }]}
              />
            )}
            <Input
              placeholder="Email"
              style={{ background: "transparent", color: "white" }}
              name="email"
              variant="outlined"
              prefix={<MailOutlined />}
              rules={[{ required: true, message: "Please input your email!" }]}
            />
            <Input.Password
              placeholder="Password"
              name="password"
              variant="outlined"
              style={{ background: "transparent", color: "white" }}
              prefix={<LockOutlined />}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            />
            {!isLogin && (
              <>
                <Input.Password
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  variant="outlined"
                  prefix={<LockOutlined />}
                  style={{ background: "transparent", color: "white" }}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords do not match!"
                        );
                      },
                    }),
                  ]}
                />

                <Upload
                  name="profilePicture"
                  action="/upload.do"
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button
                    style={{ background: "transparent", color: "white" }}
                    icon={<UploadOutlined />}
                  >
                    Upload your picture
                  </Button>
                </Upload>
              </>
            )}
            <Button ghost htmlType="submit">
              {isLogin ? "Login" : "Signup"}
            </Button>
            {isLogin ? (
              <span style={{ display: "flex", alignItems: "center" }}>
                Don't have an account?{" "}
                <Button type="text" onClick={toggleForm}>
                  Signup
                </Button>
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center" }}>
                Already have an account?{" "}
                <Button type="text" onClick={toggleForm}>
                  Login
                </Button>
              </span>
            )}
          </Flex>
        </Form>
      </Card>
    </div>
  );
};

export default HomePage;
