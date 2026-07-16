package staticserver

import (
	"io/fs"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"testing/fstest"
)

func TestServesIndexAtRoot(t *testing.T) {
	t.Parallel()

	dist := fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<html>ok</html>")},
	}
	handler := New(dist)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if !strings.Contains(rec.Body.String(), "<html>ok</html>") {
		t.Fatalf("body = %q, want index.html contents", rec.Body.String())
	}
}

func TestServesExistingAsset(t *testing.T) {
	t.Parallel()

	dist := fstest.MapFS{
		"index.html":       &fstest.MapFile{Data: []byte("<html>ok</html>")},
		"assets/app.js":    &fstest.MapFile{Data: []byte("console.log(1)")},
		"assets/core.wasm": &fstest.MapFile{Data: []byte{0x00, 0x61, 0x73, 0x6d}},
	}
	handler := New(dist)

	req := httptest.NewRequest(http.MethodGet, "/assets/app.js", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if rec.Body.String() != "console.log(1)" {
		t.Fatalf("body = %q", rec.Body.String())
	}
}

func TestFallsBackToIndexForClientRoutes(t *testing.T) {
	t.Parallel()

	dist := fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<html>spa</html>")},
	}
	handler := New(dist)

	req := httptest.NewRequest(http.MethodGet, "/figure9/colormap", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if !strings.Contains(rec.Body.String(), "<html>spa</html>") {
		t.Fatalf("body = %q, want SPA index fallback", rec.Body.String())
	}
}

func TestMissingAssetReturnsNotFound(t *testing.T) {
	t.Parallel()

	dist := fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<html>ok</html>")},
	}
	handler := New(dist)

	req := httptest.NewRequest(http.MethodGet, "/assets/missing.js", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNotFound)
	}
}

func TestRejectsNonGetMethods(t *testing.T) {
	t.Parallel()

	dist := fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<html>ok</html>")},
	}
	handler := New(dist)

	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusMethodNotAllowed)
	}
}

func TestNewRequiresReadableFS(t *testing.T) {
	t.Parallel()

	var dist fs.FS = fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<html>ok</html>")},
	}
	if New(dist) == nil {
		t.Fatal("New returned nil handler")
	}
}
