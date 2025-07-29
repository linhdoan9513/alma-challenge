'use client'

import createCache from '@emotion/cache'

export default function createEmotionCache() {
  return createCache({ 
    key: 'css', 
    prepend: true,
    // Ensure consistent rendering between server and client
    stylisPlugins: []
  })
}
