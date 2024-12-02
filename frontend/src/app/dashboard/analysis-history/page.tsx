"use client";
import { ClipboardList } from "lucide-react";
import { SubmissionCard } from "@/components/SubmissionCard";
import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { apiBaseUrl } from "@/lib/baseUrl";

export default function SubmissionsList() {
  const [user, setUser] = useUser();
  const [analysisData, setAnalysisData] = useState(null);
  useEffect(() => {
    if (user) {
      axios.get(`${apiBaseUrl}/fetch-analysis/${user.id}`).then((res) => {
        setAnalysisData(res.data.analysis_data);
      });
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Analysis History
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analysisData &&
            analysisData.map((submission) => (
              <SubmissionCard key={submission._id} submission={submission} />
            ))}
        </div>
      </div>
    </div>
  );
}
