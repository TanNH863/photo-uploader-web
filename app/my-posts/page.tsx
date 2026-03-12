"use client";

import { useEffect, useState } from "react";
import { Card, Spin, message, List } from "antd";

interface Comment {
  uuid: string;
  text: string;
  user: { uuid: string; name: string };
}

interface Image {
  uuid: string;
  image_url: string;
  userImages: { user: { uuid: string; name: string } }[];
  comments?: Comment[];
}

export default function MyPostsPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`);
        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await res.json();
        setImages(data);
      } catch (err: any) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">🖼️ My Uploaded Posts</h2>

      {images.length === 0 ? (
        <p className="text-gray-600">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {images.map((img) => (
            <Card
              key={img.uuid}
              className="shadow-md"
              title={
                <div className="font-semibold text-gray-800">
                  Uploaded By:{" "}
                  {img.userImages.map((ui) => ui.user.name).join(", ")}
                </div>
              }
              cover={
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.image_url}`}
                  alt="uploaded"
                  className="rounded-md"
                />
              }
            >
              {/* Comments Section */}
              {img.comments && img.comments.length > 0 ? (
                <List
                  size="small"
                  header={<b>Comments</b>}
                  dataSource={img.comments}
                  renderItem={(c) => (
                    <List.Item>
                      <span className="font-medium">{c.user.name}:</span>{" "}
                      {c.text}
                    </List.Item>
                  )}
                />
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
