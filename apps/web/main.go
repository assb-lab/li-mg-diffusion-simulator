package main

import (
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"

	"github.com/ks250206/li-mg-diffusion-simulator/apps/web/staticserver"
)

//go:embed all:dist
var embeddedDist embed.FS

func main() {
	host := flag.String("host", "127.0.0.1", "host")
	port := flag.String("port", "4173", "port")
	flag.Parse()

	dist, err := fs.Sub(embeddedDist, "dist")
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.Handle("/", staticserver.New(dist))

	addr := *host + ":" + *port
	log.Printf("Li-Mg Alloy Diffusion Simulator is running at http://%s/", addr)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
