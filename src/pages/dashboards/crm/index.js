import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardActivity from 'src/views/ui/cards/basic/CardActivity'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CommentForm from '../../components/activity/CommentForm'
import { gql } from '@apollo/react-hooks'
import client from '../../../../apollo-client'
import ActivityForm from '../../components/activity/ActivityForm'

const GET_ACTIVITIES = gql`
  {
    activities {
      _id
      title
      description
      userId
    }
  }
`

const CRMDashboard = () => {
  const [activities, setActivities] = useState([])
  const [comments, setComments] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null) // Add this line

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
    setActivities(prevActivities => [...prevActivities, newActivity])
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ActivityForm onAddActivity={handleAddActivity} />
        </Grid>

        {/* Display activities */}
        {activities.map(activity => (
          <Grid key={activity._id} item xs={12}>
            {/* Log comments and activity._id */}
            {console.log('Comments:', comments)}
            {console.log('Activity ID:', activity._id)}

            <CardActivity
              activity={activity}
              comments={comments}
              setComments={setComments} // Pass setComments function
              onClick={() => {
                // Set the selected activity
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
