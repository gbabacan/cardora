"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface AddPostModalProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PostFormData) => void;
}

export interface PostFormData {
  authorName: string;
  messageText: string;
  mediaType: "none" | "image" | "gif";
  mediaUrl?: string;
  mediaFile?: File;
}

export function AddPostModal({ boardId, isOpen, onClose, onSubmit }: AddPostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    authorName: "",
    messageText: "",
    mediaType: "none",
  });
  const [mediaTab, setMediaTab] = useState<"none" | "image" | "gif">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, mediaFile: file, mediaType: "image" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: API call to create post
      console.log("Creating post:", formData);

      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form
      setFormData({
        authorName: "",
        messageText: "",
        mediaType: "none",
      });
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Add Your Message</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter your name"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your message here..."
                value={formData.messageText}
                onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.messageText.length} characters
              </p>
            </div>

            {/* Media Tabs */}
            <div>
              <label className="block text-sm font-medium mb-2">Add Media (Optional)</label>
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={mediaTab === "none" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMediaTab("none");
                    setFormData({ ...formData, mediaType: "none", mediaUrl: undefined, mediaFile: undefined });
                    setImagePreview(null);
                  }}
                >
                  No Media
                </Button>
                <Button
                  type="button"
                  variant={mediaTab === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMediaTab("image")}
                >
                  📷 Photo
                </Button>
                <Button
                  type="button"
                  variant={mediaTab === "gif" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMediaTab("gif")}
                >
                  GIF
                </Button>
              </div>

              {/* Image Upload */}
              {mediaTab === "image" && (
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, mediaFile: undefined, mediaType: "none" });
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="text-gray-600">
                            <p className="mb-2">📸 Click to upload an image</p>
                            <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* GIF Search - Placeholder */}
              {mediaTab === "gif" && (
                <div className="border border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">🎬 GIF Search</p>
                  <p className="text-sm text-gray-500">
                    GIF integration will be implemented in the next phase
                  </p>
                  <Input
                    placeholder="Search for GIFs..."
                    disabled
                    className="mt-4"
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Message"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}