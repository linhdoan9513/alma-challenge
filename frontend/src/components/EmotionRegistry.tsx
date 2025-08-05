"use client";

import createEmotionCache from "@/lib/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import { ReactNode, useState } from "react";

export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
