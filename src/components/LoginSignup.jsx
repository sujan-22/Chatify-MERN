import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Flex, Upload } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useChatState } from "./context/ChatProvider";

const LoginSignup = () => {
  const { user, setUser } = useChatState();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (profilePic === undefined) {
      toast.warning("Please upload a profile picture", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "sujanrokad");
      fetch("https://api.cloudinary.com/v1_1/sujanrokad/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProfilePic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast.warning("Please upload a valid image", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if ((!email || !password) && !isLogin && !name) {
      toast.warning("Please add all fields", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }
    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/api/user/login",
          {
            email,
            password,
          }
        );
        toast.success("Login successful", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "dark",
          transition: Bounce,
        });
        if (!user) {
          setUser(response);
        }
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/chats");
      } else {
        const response = await axios.post("http://localhost:5000/api/user", {
          name,
          email,
          password,
          profilePic,
        });
        toast.success("Registration successful", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "dark",
          transition: Bounce,
        });

        localStorage.setItem("user", JSON.stringify(response));
        navigate("/chats");

        setEmail("");
        setName("");
        setPassword("");
        setProfilePic("");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
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
          background: "rgba(256, 256, 256, 0.5)",
        }}
      >
        <Form name="" initialValues={{ remember: true }} layout="vertical">
          <Flex vertical gap={12}>
            {!isLogin && (
              <Input
                placeholder="Name"
                name="name"
                variant="outlined"
                prefix={<UserOutlined />}
                style={{ background: "transparent", color: "white" }}
                rules={[{ required: true, message: "Please input your name!" }]}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              placeholder="Email"
              style={{ background: "transparent", color: "white" }}
              name="email"
              variant="outlined"
              prefix={<MailOutlined />}
              rules={[{ required: true, message: "Please input your email!" }]}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
                  listType="picture"
                  beforeUpload={(file) => postDetails(file)}
                  onChange={(info) => {
                    if (info.file.status === "removed") {
                      setLoading(false);
                    }
                  }}
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
            <Button ghost onClick={submitHandler} loading={loading}>
              {isLogin ? "Login" : "Signup"}
            </Button>
            {isLogin && (
              <Button
                ghost
                onClick={() => {
                  setEmail("user@mail.com");
                  setPassword("12345");
                }}
              >
                Get Guest User Credentials
              </Button>
            )}
            {isLogin ? (
              <>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Don't have an account?{" "}
                  <Button type="text" onClick={toggleForm}>
                    Signup
                  </Button>
                </span>
              </>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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

export default LoginSignup;
