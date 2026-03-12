"use client";

import { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { v4 as uuidv4 } from 'uuid';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    if (!username.trim()) {
      message.error("Username cannot be empty");
      return;
    }

    try {
      const id = uuidv4();

      localStorage.setItem("user", JSON.stringify({ userId: id, name: username }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, name: username }),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      const data = await res.json();
      message.success(`User ${data.name} created successfully`);
      onClose();
      setUsername("");
      window.location.reload();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <Modal
        title="We should call you by your username, right?"
        open={isOpen}
        onCancel={onClose}
        footer={null}
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            type="primary"
            className="w-full mt-2"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
