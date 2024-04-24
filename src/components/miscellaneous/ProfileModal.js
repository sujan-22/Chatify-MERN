import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import Modal from "@mui/material/Modal";
import { Image, Space } from "antd";

const style = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(255,255,255,0.8)",
  borderRadius: 2,
  p: 4,
  gap: 2,
};

export default function ProfileModal({ user, visible, onClose }) {
  return (
    <div>
      <Modal
        open={visible}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ zIndex: 1000 }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {user.data.name}
          </Typography>
          <Image
            style={{ zIndex: 1400, borderRadius: 10 }}
            width={200}
            src={user.data.profilePic}
            preview={{
              toolbarRender: (
                _,
                {
                  transform: { scale },
                  actions: {
                    onFlipY,
                    onFlipX,
                    onRotateLeft,
                    onRotateRight,
                    onZoomOut,
                    onZoomIn,
                  },
                }
              ) => (
                <Space size={12} className="toolbar-wrapper">
                  <SwapOutlined rotate={90} onClick={onFlipY} />
                  <SwapOutlined onClick={onFlipX} />
                  <RotateLeftOutlined onClick={onRotateLeft} />
                  <RotateRightOutlined onClick={onRotateRight} />
                  <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                  <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                </Space>
              ),
            }}
          />

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Email: {user.data.email}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
