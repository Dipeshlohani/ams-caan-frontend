import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const LIST_ACTIVITIES = gql`
  query {
    activities {
      _id
      title
      description
    }
  }
`

function ActivityList() {
  const { loading, error, data } = useQuery(LIST_ACTIVITIES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const activities = data.activities

  return (
    <div>
      <h1>Activity List</h1>
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityList
