import { useState } from "react";
import { uploadProfilePicture } from "../api/profile";

export function ProfilePictureUploader({
  currentPhoto,
  role,
  onUploaded,
}: {
  currentPhoto: string;
  role: "customer" | "company" | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    //preview before upload
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      setUploading(true);
      await uploadProfilePicture(role, file);
      onUploaded(preview || currentPhoto);
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <img
        src={preview || currentPhoto}
        className="w-24 h-24 rounded-full object-cover border"
      />
      <label className="cursor-pointer text-[#094233] hover:underline">
        {uploading ? "Uploading..." : "Change Photo"}
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
