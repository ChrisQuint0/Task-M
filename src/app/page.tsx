// app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+ App Router

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]); // Add router to the dependency array

  return null; // This component doesn't need to render anything if it's just for redirect
}
