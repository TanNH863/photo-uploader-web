"use client";

import { Modal, Button } from "antd";
import { useRouter } from "next/navigation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  subMessage?: string;
}

export default function MessageModal({ isOpen, onClose, message, subMessage }: UserModalProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-6">
      <Modal
        title="Upload successful!"
        open={isOpen}
        onOk={() => {
          router.push("/my-posts");
        }}
        okText="View"
        cancelText="Close"
        onCancel={onClose}
      >
        <div className="space-y-4">
          <p>{message}</p>
          {subMessage && <p className="text-sm text-gray-500">{subMessage}</p>}
        </div>
      </Modal>
    </div>
  );
}
