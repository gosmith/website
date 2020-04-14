/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import BarChart from './charts/_BarChart'
import { parseDate } from './_utils'

export default function UsAreaChartContainer() {
  const query = useStaticQuery(graphql`
    {
      allCovidUsDaily {
        nodes {
          date
          death
        }
      }
    }
  `)
  const data = useMemo(() => {
    const nodes = query.allCovidUsDaily.nodes
      .map(node => [
        {
          date: parseDate(node.date),
          label: 'Deaths',
          value: node.death,
        },
      ])
      .reduce((acc, val) => acc.concat(val), [])

    return nodes.sort((a, b) => {
      if (a.date > b.date) return 1
      if (a.date < b.date) return -1
      return 0
    })
  }, [query.allCovidUsDaily.nodes.length])
  return (
    <div>
      <h4>Total deaths in the US</h4>
      <div>
        <BarChart
          data={data}
          fill="#585BC1"
          height={400}
          marginBottom={40}
          marginLeft={80}
          marginRight={10}
          marginTop={10}
          xTicks={3}
          width={400}
          align="center"
          showTicks={5}
        />
      </div>
    </div>
  )
}
