"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileIcon,
  Loader2Icon,
  UploadCloudIcon,
  XIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { LocalStorageHandler } from "@/lib/localStorageHandler";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function PDFUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const [user, setUser] = useUser();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];

      if (uploadedFile.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a PDF file smaller than 5MB.",
        });
        return;
      }

      if (uploadedFile.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file.",
        });
        return;
      }

      setFile(uploadedFile);
      toast({
        title: "File added successfully",
        description: `${uploadedFile.name} is ready to upload.`,
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const removeFile = () => {
    if (isUploading) return;
    setFile(null);
    setUploadProgress(0);
    toast({
      title: "File removed",
      description: "The PDF file has been removed.",
    });
  };

  const simulateProgress = () => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(Math.min(progress, 100));
      }, 500);
    });
  };

  const handleSubmit = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    toast({
      title: "Upload started",
      description: "Your file is being uploaded...",
    });

    try {
      // Simulate upload progress

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.id);
      const response = await axios.post(
        "http://127.0.0.1:5000/analyze-summary",
        formData
      );
      LocalStorageHandler.save("processedData", response.data.data);
      router.push(`/dashboard/syllabus-summary?id=${response.data.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          "There was an error uploading your file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/5"
            : isUploading
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloudIcon
            className={`h-12 w-12 mb-4 ${
              isUploading ? "text-gray-300" : "text-gray-400"
            }`}
          />
          <p className="text-lg font-medium text-gray-900 mb-1">
            {isDragActive
              ? "Drop your PDF here"
              : isUploading
              ? "Upload in progress..."
              : "Drag & drop your PDF here"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {!isUploading && "or click to select a file"}
          </p>
          <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
        </div>
      </div>

      {file && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className={`text-gray-400 hover:text-gray-500 ${
                isUploading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isUploading}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            </div>
          )} */}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!file || isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadProgress === 100 ? (
            <>
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Uploaded
            </>
          ) : (
            "Upload PDF"
          )}
        </Button>
      </div>
    </div>
  );
}
