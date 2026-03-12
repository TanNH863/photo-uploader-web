"use client";

import { useState, useEffect } from "react";
import { Upload, Button, Card, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UserModal from "@/components/UserModal";

interface Photo {
  id: number;
  url: string;
  comments: string[];
}

export default function PhotoUploadPage() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [user, setUser] = useState<{ userId: string; name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUpload = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const url = URL.createObjectURL(info.file.originFileObj);
      const newPhoto: Photo = {
        id: Date.now(),
        url,
        comments: [],
      };
      setPhoto(newPhoto);
    }
  };

  const handleAddComment = () => {
    if (photo && comment.trim() !== "") {
      setPhoto({
        ...photo,
        comments: [...photo.comments, comment],
      });
      setComment("");
    }
  };

  return (
    <>
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="max-w-2xl mx-auto p-6">
        {user && (
          <div className="mb-4 text-gray-700 font-medium">
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
              onClick={handleAddComment}
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
