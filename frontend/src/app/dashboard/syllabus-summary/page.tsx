"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Youtube,
  FileText,
  Code2,
  Plus,
  Star,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import StarToggle from "@/components/StarToggle";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { apiBaseUrl } from "@/lib/baseUrl";
export default function CourseSyllabus() {
  const searchParams = useSearchParams();
  const [aiExtractedData, setAiExtractedData] = useState(null);
  const id = searchParams.get("id");
  useEffect(() => {
    axios
      .post(`${apiBaseUrl}/get-summary`, {
        id: id,
      })
      .then((res) => {
        setAiExtractedData(res.data.data);
      });
  }, []);
  function convertToEmbedLink(videoUrl) {
    // Extract the video ID from the URL
    const urlParts = new URL(videoUrl);
    const videoId = urlParts.searchParams.get("v");

    // Construct the embeddable link
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return (
    <div className="bg-white text-white min-h-screen p-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {aiExtractedData &&
          Object.keys(aiExtractedData).map((key, index) => (
            <AccordionItem
              key={key}
              value={key}
              className="border border-LamaPurple rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 bg-LamaPurple hover:bg-LamaPurpleLight transition-colors">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-black text-xl font-semibold text-left">
                    {key}
                  </h3>
                  <span className="text-gray-400">0/5</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-white">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.keys(aiExtractedData[key].Syllabus_content).map(
                      (module, index) => (
                        <AccordionItem
                          key={module}
                          value={module}
                          className="border-LamaPurple mb-4"
                        >
                          <AccordionTrigger className="px-6 py-4 bg-LamaPurple hover:bg-LamaPurpleLight rounded-t-lg">
                            <div className="flex justify-between items-center w-full">
                              <h4 className="text-black font-medium text-left">
                                {module}
                              </h4>
                              <span className="text-gray-400">0/5</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-[#2a2a2a] text-gray-300">
                                    <th className="p-3 text-left">STATUS</th>
                                    <th className="p-3 text-left">TOPICS</th>
                                    <th className="p-3 text-center">ARTICLE</th>
                                    <th className="p-3 text-center">YOUTUBE</th>

                                    <th className="p-3 text-center">
                                      REVISION
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {aiExtractedData[key].Syllabus_content[
                                    module
                                  ].Topics.map((topic, index_) => (
                                    <tr
                                      key={index}
                                      className="border-t border-LamaPurple hover:bg-LamaPurpleLight transition-colors"
                                    >
                                      <td className="p-3">
                                        <Checkbox id="terms" />
                                      </td>
                                      <td className="p-3 text-black">
                                        {topic}
                                      </td>
                                      <td className="p-3 text-center">
                                        <FileText
                                          onClick={() => {
                                            window.open(
                                              aiExtractedData[key]
                                                .Syllabus_content[module].Links[
                                                topic
                                              ],
                                              "_blank"
                                            );
                                          }}
                                          className="h-5 w-5 text-gray-400 mx-auto cursor-pointer"
                                        />
                                      </td>
                                      <td className="p-3 text-center">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Youtube className="h-5 w-5 text-red-500 mx-auto cursor-pointer" />
                                          </DialogTrigger>
                                          <DialogContent className="min-w-[60rem]">
                                            <DialogHeader>
                                              <DialogTitle>
                                              
                                              </DialogTitle>
                                              <DialogDescription>
                                              
                                              </DialogDescription>
                                            </DialogHeader>
                                            <iframe
                                              width="100%"
                                              height="500"
                                              src={convertToEmbedLink(
                                                aiExtractedData[key]
                                                  .Syllabus_content[module]
                                                  .YouTube[index_].url
                                              )}
                                              title="YouTube video player"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                              allowFullScreen
                                            ></iframe>
                                          </DialogContent>
                                        </Dialog>
                                      </td>

                                      <td className="p-3 text-center">
                                        <StarToggle />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}
