import React, { useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Title } from '../global'

const Chart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: ['#fff'],
        hoverBorderColor: ['#fff'],
        borderRadius: 30,
        cutout: '80%'
      }
    ]
  }

  const plugins = {
    legend: {
      display: 'hidden'
    }
  }

  return <Doughnut data={data} />
}

export default Chart
