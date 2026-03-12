"use client";

import { useState, useEffect } from "react";
import { Upload, Button, Card, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UserModal from "@/components/UserModal";
import MessageModal from "@/components/MessageModal";

interface Photo {
  id: number;
  url: string;
  comments: string[];
  file?: File
}

export default function PhotoUploadPage() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [user, setUser] = useState<{ userId: string; name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUpload = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj;
      const url = URL.createObjectURL(file);
      const newPhoto: Photo = {
        id: Date.now(),
        url,
        comments: [],
        file,
      };
      setPhoto(newPhoto);
    }
  };

  const handlePost = async () => {
    if (!photo || !user) {
      message.error("No photo or user available");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", photo.file as Blob);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/${user.userId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      message.success("Image uploaded successfully!");
      setIsMessageModalOpen(true);
      setPhoto(null);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <>
      <UserModal isOpen={!user ? true : false} onClose={() => setIsUserModalOpen(false)} />
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message="You have uploaded a photo!"
        subMessage="Click the button to view all uploaded posts."
      />
      <div className="max-w-2xl mx-auto p-6">
        {user && (
          <div className="mb-4 text-white font-medium">
            You are currently logged in as <span className="font-semibold">{user.name}</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-4">📸 Click the button below to upload your image.</h2>

        <Upload
          customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.("ok"), 0)}
          showUploadList={false}
          onChange={handleUpload}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>

        {photo && (
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">This is a preview of your post.</h2>
            <Card
              key={photo.id}
              className="shadow-md"
              cover={<img src={photo.url} alt="uploaded" className="rounded-md" />}
            >
              <List
                size="small"
                header={<b>Comments</b>}
                dataSource={photo.comments}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
            <Button
              type="primary"
              onClick={handlePost}
              className="w-full mt-3"
            >
              Post
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
