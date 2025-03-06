package main

import (
	"fmt"
	"math"
	"math/rand/v2"
)

type dropResult struct {
	NeedleCoordsX float64 `json:"coordsX"`
	NeedleCoordsY float64 `json:"coordsY"`
	NeedleAngle   float64 `json:"angle"`
	NeedlePerp    float64 `json:"perp"`
	NeedlePerpHor float64 `json:"perpHor"`
	IsCrossed     bool    `json:"isCr"`
}

type Output struct {
	Crossings    int          `json:"crossings"`
	CrossingRate float64      `json:"crossingRate"`
	Drops        []dropResult `json:"drops"`
	Pi           float64      `json:"pi"`
}

func DoNeedleDrop(linesLen, needleLen, fieldX, fieldY float64, iterations int) Output {
	// linesLen - space between lines
	// needleLen - length of a needle

	type Coordinates struct {
		X float64
		Y float64
	}

	// the size of the field on which we will throw a needle
	// (e.g. 100x100)
	var field Coordinates
	field.X = fieldX
	field.Y = fieldY

	// the number of times when the needle crossed lines
	crossings := 0

	// it will store info about drops in all iterations
	var drops []dropResult

	for i := 0; i < iterations; i++ {

		// throw a needle, determine coordinates of the middle of the needle
		var needleCoords Coordinates
		needleCoords.X = float64(rand.Int32N(int32(field.X))) + rand.Float64()
		needleCoords.Y = float64(rand.Int32N(int32(field.Y))) + rand.Float64()
		//fmt.Println("needleCoords.Y: ", needleCoords.Y)

		// gen angle in radians 0 - pi/2 (0 to 90 degrees)
		needleAngle := rand.Float64() * (math.Pi / 2)
		//fmt.Println("needleAngle: ", needleAngle)

		// determine coordinates of the lines
		linesCount := int(field.X/linesLen) + 1
		linesCoords := make([]float64, linesCount)
		linesCoords[0] = 0
		for i := 1; i < linesCount; i++ {
			linesCoords[i] = linesCoords[i-1] + linesLen
		}

		// calculate lenght of pependicular of the line from middle of the needle
		// to end of the needle
		needlePerp := math.Cos(needleAngle) * (needleLen / 2)
		needlePerpHor := math.Sin(needleAngle) * (needleLen / 2)
		//fmt.Println("needlePerp: ", needlePerp)
		//fmt.Println("needlePerpHor: ", needlePerpHor)

		isCr := isCrossing(linesCoords, needlePerp, needleCoords.Y)
		if isCr {
			crossings++
		}
		//fmt.Println(isCr)
		//fmt.Println("")

		result := dropResult{
			NeedleCoordsX: needleCoords.X,
			NeedleCoordsY: needleCoords.Y,
			NeedleAngle:   needleAngle,
			NeedlePerp:    needlePerp,
			NeedlePerpHor: needlePerpHor,
			IsCrossed:     isCr,
		}
		drops = append(drops, result)
	}

	//fmt.Println("")
	fmt.Println("number of iterations: ", iterations)
	fmt.Println("times the needle crossed lines: ", crossings)
	winrate := float64(crossings) / float64(iterations)
	fmt.Println("line crossing rate: ", winrate)

	pi := (2 * needleLen) / (winrate * linesLen)
	// the closer to pi, the more accurate the result.
	fmt.Println("pi = ", pi)

	// structs to return
	output := Output{
		Crossings:    crossings,
		CrossingRate: winrate,
		Pi:           pi,
		Drops:        drops,
	}

	return output
}

func isCrossing(lines []float64, needlePerp, needleCoordsY float64) bool {
	for i := 1; i < len(lines); i++ {
		//fmt.Println("lines[i]:", lines[i], "needleCoordsY: ", needleCoordsY+needlePerp)
		if needleCoordsY < lines[i] {
			//fmt.Println("needleCoordsY < lines[i]")
			if needleCoordsY+needlePerp > lines[i] || needleCoordsY-needlePerp < lines[i-1] {
				return true
			} else {
				return false
			}
		}
	}
	return false
}
