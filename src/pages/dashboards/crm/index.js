import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardActivity from 'src/views/ui/cards/basic/CardActivity'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CommentForm from '../../components/activity/CommentForm'
import { gql } from '@apollo/react-hooks'
import client from '../../../../apollo-client'
import ActivityForm from '../../components/activity/ActivityForm'
import { formatDistanceToNow } from 'date-fns'

const GET_ACTIVITIES = gql`
  {
    activities {
      _id
      title
      description
      userId
      createdAt
    }
  }
`

const CRMDashboard = () => {
  const [activities, setActivities] = useState([])
  const [comments, setComments] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)

  useEffect(() => {
    // Fetch activities
    client
      .query({ query: GET_ACTIVITIES })
      .then(result => {
        console.log('Fetched activities:', result.data.activities)
        setActivities(result.data.activities)
      })
      .catch(error => console.error('Apollo Client Error:', error))
  }, [])

  const handleAddActivity = newActivity => {
    // Add the new activity to the beginning of the array
    setActivities(prevActivities => [newActivity, ...prevActivities])
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* Always render the ActivityForm */}
        <Grid item xs={12}>
          <ActivityForm onAddActivity={handleAddActivity} />
        </Grid>

        {/* Display activities */}
        {activities.map(activity => (
          <Grid key={activity._id} item xs={12}>
            {console.log('Comments:', comments)}
            {console.log('Activity ID:', activity._id)}
            <CardActivity
              activity={activity}
              comments={comments}
              setComments={setComments}
              onClick={() => {
                setSelectedActivity(activity)
              }}
            />
          </Grid>
        ))}
      </Grid>
    </ApexChartWrapper>
  )
}

export default CRMDashboard
