/* eslint-disable no-unused-vars */
import { range } from 'd3-array'
import React, { useEffect, useRef } from 'react'

import chartsStyle from './charts.module.scss'

export default ({
  colorDeathRaceKnown = '#585bc1',
  colorDeathBlackKnown = '#ffad4a',
  deathsPerDot = 10,
  deathsRaceKnown = 57319,
  deathsBlackKnown = 14539,
  dotRadius = 3,
  dotPadding = 3,
}) => {
  const canvasEl = useRef(null)
  const dotDiameter = dotRadius * 2
  const gridUnit = dotDiameter + dotPadding
  const width = 600
  const populationPercentageBlack = 0.13
  const populationProportinateDeathsBlack =
    populationPercentageBlack * (deathsRaceKnown / deathsPerDot)
  const numberOfColumns = Math.floor(width / (dotDiameter + dotPadding))

  const totalDots = deathsRaceKnown / deathsPerDot
  const data = range(0, totalDots)
  const totalRows = Math.floor(totalDots / numberOfColumns) + 2
  const dotIndexRepresentingProportinateDeathsBlackStart =
    totalDots - populationProportinateDeathsBlack
  const dotPositionRepresentingProportinateDeathsBlackStart = {
    column:
      (dotIndexRepresentingProportinateDeathsBlackStart % numberOfColumns) + 1,
    row:
      Math.floor(
        dotIndexRepresentingProportinateDeathsBlackStart / numberOfColumns,
      ) + 1,
  }

  const deathsBlackKnownPercentage = deathsBlackKnown / deathsRaceKnown
  const dotIndexRepresentingDeathsBlackStart =
    totalDots - deathsBlackKnown / deathsPerDot
  const dotPositionRepresentingDeathsBlackStart = {
    column: (dotIndexRepresentingDeathsBlackStart % numberOfColumns) + 1,
    row: Math.floor(dotIndexRepresentingDeathsBlackStart / numberOfColumns) + 1,
  }

  useEffect(() => {
    const canvas = canvasEl.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    data.forEach(i => {
      const column = (i % numberOfColumns) + 1
      const row = Math.floor(i / numberOfColumns) + 1
      const representsKnownBlackDeath =
        i > totalDots - deathsBlackKnown / deathsPerDot
      ctx.fillStyle = colorDeathRaceKnown
      if (representsKnownBlackDeath) {
        ctx.fillStyle = colorDeathBlackKnown
      }
      ctx.beginPath()
      ctx.arc(
        column * (dotDiameter + dotPadding),
        row * (dotDiameter + dotPadding),
        dotRadius,
        0,
        Math.PI * 2,
        true,
      )
      ctx.fill()
    })
  })

  const ticks = range(0, 101, 5).map(d => ({
    label: `${d}%`,
    percentFromTop: 1 - d / 100,
    main: [50, 75, 100].includes(d),
    value: d,
  }))

  return (
    <div>
      <p>
        Each dot <span /> represents {deathsPerDot} people who have died and for
        whom racial data is reported.
      </p>
      <div style={{ position: 'relative' }}>
        <canvas
          className={chartsStyle.canvas}
          ref={canvasEl}
          height={totalRows * gridUnit}
          width={width}
        />
        {ticks
          .filter(d => {
            const avoidPercentage = Math.floor(deathsBlackKnownPercentage * 100)
            return (
              d.value !== avoidPercentage &&
              (d.value + 5 > avoidPercentage || d.value - 5 < avoidPercentage)
            )
          })
          .map(d => (
            <div
              data-labeled-tick={`${d.main}`}
              className={chartsStyle.canvasTick}
              style={{
                top: totalRows * d.percentFromTop * gridUnit,
              }}
            >
              <span>{d.label}</span>
            </div>
          ))}

        <div
          data-labeled-tick="true"
          className={chartsStyle.canvasTick}
          style={{
            top: dotPositionRepresentingDeathsBlackStart.row * gridUnit,
          }}
        >
          <span>{Math.floor(deathsBlackKnownPercentage * 100)}%</span>
          <p>The deaths of Black people due to COVID-19</p>
        </div>
        <div
          data-labeled-tick="true"
          className={chartsStyle.canvasTick}
          style={{
            top:
              (dotPositionRepresentingProportinateDeathsBlackStart.row - 1) *
              gridUnit,
          }}
        >
          <span>{populationPercentageBlack * 100}%</span>
          <p>Percent of the US that is Black</p>
        </div>
      </div>
    </div>
  )
}