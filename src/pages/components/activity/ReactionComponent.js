import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { Button, Grid, Paper } from '@mui/material'

const CREATE_REACTION = gql`
  mutation CreateReaction($userId: String!, $activityId: String!, $type: String!) {
    createReaction(userId: $userId, activityId: $activityId, type: $type) {
      _id
      userId
      activityId
      type
    }
  }
`

const DELETE_REACTION = gql`
  mutation DeleteReaction($reactionId: String!) {
    deleteReaction(reactionId: $reactionId)
  }
`

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

const ReactionForm = ({ onAddReaction, activityId, userId }) => {
  const { loading, error, data, refetch } = useQuery(REACTIONS_BY_ACTIVITY, {
    variables: { activityId }
  })

  const [createReaction] = useMutation(CREATE_REACTION)
  const [deleteReaction] = useMutation(DELETE_REACTION)

  const handleSubmit = async selectedType => {
    try {
      // Check if the user has already reacted
      const userReaction = data.reactionsByActivity.find(reaction => reaction.userId === userId)

      if (userReaction) {
        // User has already reacted, so delete the existing reaction
        console.log('Deleting existing reaction:', userReaction)
        await deleteReaction({
          variables: { reactionId: userReaction._id },
          refetchQueries: [{ query: REACTIONS_BY_ACTIVITY, variables: { activityId } }]
        })

        console.log('Reaction deleted')
      }

      // Create a new reaction
      console.log('Creating new reaction')
      const { data: reactionData } = await createReaction({
        variables: { userId, activityId, type: selectedType },
        refetchQueries: [{ query: REACTIONS_BY_ACTIVITY, variables: { activityId } }]
      })

      console.log('Create response:', reactionData)

      // Notify parent component about the new reaction
      onAddReaction(reactionData.createReaction)
      console.log(`${selectedType} added`)
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

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
    <Grid container justifyContent='center' padding='30px'>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Button
            onClick={() => handleSubmit('LIKE')}
            variant='contained'
            color='primary'
            style={{ marginRight: '10px' }}
          >
            Like
          </Button>
          <Button
            onClick={() => handleSubmit('LOVE')}
            variant='contained'
            color='secondary'
            style={{ marginRight: '10px' }}
          >
            Love
          </Button>
          <Button onClick={() => handleSubmit('WOW')} variant='contained' color='info' style={{ marginRight: '10px' }}>
            Wow
          </Button>
          <Button onClick={() => handleSubmit('ANGRY')} variant='contained' color='error'>
            Angry
          </Button>
        </Paper>
      </Grid>

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

export default ReactionForm
