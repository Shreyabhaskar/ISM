"use client";

import PDFUploader from "@/components/pdf-uploader";

export default function Subjects() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"> Upload Syllabus</h1>
          <p className="text-lg text-gray-600">
            Upload and analyze your syllabus
          </p>
        </div>
        <PDFUploader />
      </div>
    </main>
  );
}
