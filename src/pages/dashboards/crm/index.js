import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardActivity from 'src/views/ui/cards/basic/CardActivity'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

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

const GET_COMMENTS_BY_ACTIVITY = gql`
  query GetCommentsByActivity($activityId: ID!) {
    commentsByActivity(activityId: $activityId) {
      _id
      content
      userId
      activityId
    }
  }
`

const CRMDashboard = () => {
  const [activities, setActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [comments, setComments] = useState([])

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

  // Log selectedActivity and comments whenever they change
  useEffect(() => {
    console.log('Selected Activity:', selectedActivity)

    // Fetch comments for the selected activity
    if (selectedActivity) {
      client
        .query({
          query: GET_COMMENTS_BY_ACTIVITY,
          variables: { activityId: selectedActivity._id }
        })
        .then(result => {
          console.log('Fetched comments result:', result)
          console.log('Fetched comments data:', result.data)
          setComments(result.data.commentsByActivity)
        })
        .catch(error => console.error('Apollo Client Error:', error))
    }
  }, [selectedActivity])

  useEffect(() => {
    console.log('Comments:', comments)
  }, [comments])

  const handleAddActivity = newActivity => {
    setActivities(prevActivities => [...prevActivities, newActivity])
  }

  return (
    <ApexChartWrapper>
              <Grid item xs={12}>
          <ActivityForm onAddActivity={handleAddActivity} />
        </Grid>
      <Grid container spacing={6}>
        {/* Display activities */}
        {activities.map(activity => (
          <Grid key={activity._id} item xs={12}>
            <CardActivity
              activity={activity}
              onClick={() => {
                // Set the selected activity
                setSelectedActivity(activity)
              }}
            />
          </Grid>
        ))}

        {/* Display comments for the selected activity */}
        {selectedActivity && (
          <Grid item xs={12}>
            <div>
              <h3>Comments for {selectedActivity.title}</h3>
              {comments.map(comment => (
                <div key={comment._id}>
                  <p>{comment.content}</p>
                  {/* Add more comment details as needed */}
                </div>
              ))}
            </div>
          </Grid>
        )}

        {/* Add the form to add new activities */}

      </Grid>
    </ApexChartWrapper>
  )
}

export default CRMDashboard
