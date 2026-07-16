package staticserver

import (
	"io/fs"
	"net/http"
	"path"
	"strings"
)

// New returns an HTTP handler that serves files from dist and falls back to
// index.html for client-side routes used by React Router.
func New(dist fs.FS) http.Handler {
	fileServer := http.FileServer(http.FS(dist))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		requestPath := path.Clean("/" + r.URL.Path)
		relPath := strings.TrimPrefix(requestPath, "/")
		if relPath == "" || relPath == "." {
			relPath = "index.html"
		}

		if _, err := fs.Stat(dist, relPath); err != nil {
			if looksLikeStaticAsset(relPath) {
				http.NotFound(w, r)
				return
			}

			r = r.Clone(r.Context())
			r.URL.Path = "/"
			fileServer.ServeHTTP(w, r)
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}

func looksLikeStaticAsset(relPath string) bool {
	base := path.Base(relPath)
	return strings.Contains(base, ".")
}
