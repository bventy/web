self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/api/:path*"
      },
      {
        "source": "/vercel-relay/s.js"
      },
      {
        "source": "/posth-relay/static/:path*"
      },
      {
        "source": "/posth-relay/s/:path*"
      },
      {
        "source": "/posth-relay/e/:path*"
      },
      {
        "source": "/posth-relay/decide"
      },
      {
        "source": "/posth-relay/:path*"
      },
      {
        "source": "/umami-relay/s.js"
      },
      {
        "source": "/umami-relay/api/send"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()