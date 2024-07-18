'use client';

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ExamDetailComponent from "../../../components/ExamDetail";

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded && !userId) {
  //     router.push("/sign-in");
  //   }
  // }, [isLoaded, userId, router]);

  // if (!isLoaded || !userId) {
  //   return <div className="flex justify-center items-center h-screen">
  //     <div className="text-[#E0E0E0]">Loading exam details...</div>
  //     <svg className="animate-spin h-5 w-5 ml-3 text-white" viewBox="0 0 24 24">
  //       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
  //     </svg>
  //   </div>;
  // }

  return <ExamDetailComponent examId={params.id} />;
}