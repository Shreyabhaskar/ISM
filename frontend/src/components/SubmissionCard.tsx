"use client";
import { FileText, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

export function SubmissionCard({ submission }: any) {
  const router = useRouter();
  
  const getTitle = () => {
    return Object.keys(submission?.data)[0];
  };

  const getNumberOfModules = () => {
    return Object.keys(submission?.data[getTitle()].Syllabus_content).length;
  }
  return (
    <div
      onClick={() =>
        router.push(`/dashboard/syllabus-summary?id=${submission._id}`)
      }
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 min-w-max" />
            <h3 className="text-lg font-semibold text-gray-900">
              {getTitle()}
            </h3>
          </div>
          <div className="mt-3 flex items-center gap-2 text-gray-600">
            <Layers className="h-4 w-4" />
            <span>{getNumberOfModules()} Modules</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Created At: {new Date(submission.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}
