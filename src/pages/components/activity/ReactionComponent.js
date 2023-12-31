import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { Button, Paper } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import WhatshotIcon from '@mui/icons-material/Whatshot'

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
      reactions {
        _id
        userId
        activityId
        type
      }
      totalReactions
    }
  }
`

const ReactionForm = ({ onAddReaction, activityId, userId }) => {
  const { loading, error, data, refetch } = useQuery(REACTIONS_BY_ACTIVITY, {
    variables: { activityId }
  })

  const [createReaction] = useMutation(CREATE_REACTION)
  const [deleteReaction] = useMutation(DELETE_REACTION)

  const reactionsData = data?.reactionsByActivity || { reactions: [] }

  const handleSubmit = async selectedType => {
    try {
      console.log('Handling reaction:', selectedType)

      // Check if the user has already reacted
      const userReaction = reactionsData.reactions.find(reaction => reaction.userId === userId)

      if (userReaction) {
        // User has already reacted, handle accordingly
        if (userReaction.type === selectedType) {
          // User clicked the same reaction type, so delete the existing reaction
          console.log('Deleting existing reaction:', userReaction)
          await deleteReaction({
            variables: { reactionId: userReaction._id },
            refetchQueries: [{ query: REACTIONS_BY_ACTIVITY, variables: { activityId } }]
          })
          console.log('Reaction deleted')
          return // Do not proceed to create a new reaction
        } else {
          // User clicked a different reaction type, so delete the existing reaction
          console.log('Deleting existing reaction:', userReaction)
          await deleteReaction({
            variables: { reactionId: userReaction._id },
            refetchQueries: [{ query: REACTIONS_BY_ACTIVITY, variables: { activityId } }]
          })
          console.log('Reaction deleted')
        }
      }

      // Create a new reaction
      console.log('Creating new reaction')
      const { data: reactionData } = await createReaction({
        variables: { userId, activityId, type: selectedType },
        refetchQueries: [{ query: REACTIONS_BY_ACTIVITY, variables: { activityId } }]
      })

      console.log('Create response:', reactionData)

      // Notify the parent component about the new reaction
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
  if (error) {
    console.error('Error loading reactions:', error.message)
    return <p>Error loading reactions: {error.message}</p>
  }

  const reactions = reactionsData.reactions

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Button onClick={() => handleSubmit('LIKE')} variant='contained' color='primary' style={{ marginRight: '10px' }}>
        <ThumbUpIcon />
      </Button>
      <Button
        onClick={() => handleSubmit('LOVE')}
        variant='contained'
        color='secondary'
        style={{ marginRight: '10px' }}
      >
        <FavoriteIcon />
      </Button>
      <Button onClick={() => handleSubmit('WOW')} variant='contained' color='info' style={{ marginRight: '10px' }}>
        <EmojiEmotionsIcon />
      </Button>
      <Button onClick={() => handleSubmit('ANGRY')} variant='contained' color='error'>
        <WhatshotIcon />
      </Button>
    </Paper>
  )
}

export default ReactionForm
