'use client'

import * as React from 'react'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from './muiCache'

const clientSideEmotionCache = createEmotionCache()

export default function MuiRegistry({ children }: { children: React.ReactNode }) {
  return <CacheProvider value={clientSideEmotionCache}>{children}</CacheProvider>
}
