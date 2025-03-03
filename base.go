package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func dumbCalc(num int) int {
	return num + 100
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "public/index.html")
}

func dropHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "public/drop.html")
}

func dropJsHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "public/drop.js")
}

func calcHandler(w http.ResponseWriter, r *http.Request) {
	// parse json
	var data struct {
		LinesLen   float64 `json:"linesLen"`
		NeedleLen  float64 `json:"needleLen"`
		FieldLenX  float64 `json:"fieldLenX"`
		FieldLenY  float64 `json:"fieldLenY"`
		Iterations int     `json:"iterations"`
	}

	// decode json
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		fmt.Println("there is an error. decode fault")
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// call our function with decoded json (data.Number)
	dropOutput := DoNeedleDrop(data.LinesLen, data.NeedleLen, data.FieldLenX, data.FieldLenY, data.Iterations)
	fmt.Println("dropOutput: ", dropOutput)

	// make response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(dropOutput); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/index", indexHandler)
	http.HandleFunc("/drop", dropHandler)
	http.HandleFunc("/drop.js", dropJsHandler)
	http.HandleFunc("/calculate", calcHandler)

	// to use https
	// log.Fatal(http.ListenAndServeTLS(":443", "server.crt", "server.key", nil))
	fmt.Println("Good luck! Server is running at :80")
	log.Fatal(http.ListenAndServe(":80", nil))
}
