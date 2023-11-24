import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { Button, Grid, Paper, gridClasses } from '@mui/material'

const REACTIONS_BY_ACTIVITY = gql`
  query ReactionsByActivity($activityId: String!) {
    reactionsByActivity(activityId: $activityId) {
      _id
      userId
      activityId
      type
    }
  }
`

const ReactionList = ({ activityId, userId }) => {
  const { loading, error, data, refetch } = useQuery(REACTIONS_BY_ACTIVITY, {
    variables: { activityId }
  })

  useEffect(() => {
    // Refetch reactions when activityId or userId changes
    if (activityId && userId) {
      refetch({ activityId }).catch(error => console.error('Error refetching reactions:', error))
    }
  }, [activityId, userId, refetch])

  if (loading) return <p>Loading reactions...</p>
  if (error) return <p>Error loading reactions: {error.message}</p>

  const reactions = data.reactionsByActivity
  return (
    <Grid>
      {/* Display reactions */}
      {reactions.length > 0 && (
        <div>
          <h3>Reactions</h3>
          {reactions.map(reaction => (
            <div key={reaction._id}>
              <p>User ID: {reaction.userId}</p>
              <p>{reaction.type}</p>
              {/* Add more reaction details as needed */}
            </div>
          ))}
        </div>
      )}
    </Grid>
  )
}

export default ReactionList
