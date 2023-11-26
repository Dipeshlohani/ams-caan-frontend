// CommentForm.js
import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { TextField, Button, Grid, Paper } from '@mui/material'

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $userId: String!, $activityId: String!) {
    createComment(content: $content, userId: $userId, activityId: $activityId) {
      _id
      content
      userId
      activityId
    }
  }
`

// Updated query to fetch comments
const GET_COMMENTS = gql`
  query CommentsByActivity($activityId: String!) {
    commentsByActivity(activityId: $activityId) {
      comments {
        _id
        userId
        activityId
        content
      }
      totalComments
    }
  }
`

const CommentForm = ({ onAddComment, activityId, userId }) => {
  const [content, setContent] = useState('')
  const { loading, error, data, refetch } = useQuery(GET_COMMENTS, {
    variables: { activityId }
  })

  const [createComment] = useMutation(CREATE_COMMENT)

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const { data: commentData } = await createComment({
        variables: { content, userId, activityId },
        refetchQueries: [{ query: GET_COMMENTS, variables: { activityId } }]
      })

      // Reset form field
      setContent('')

      // Notify parent component about the new comment
      onAddComment(commentData.createComment)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  if (loading) return <p>Loading comments...</p>
  if (error) return <p>Error loading comments: {error.message}</p>

  const { comments, totalComments } = data.commentsByActivity

  return (
    <Grid container justifyContent='center' padding='30px'>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Comment'
              variant='outlined'
              multiline
              rows={4}
              margin='normal'
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <Button type='submit' variant='contained' color='primary' style={{ marginTop: '10px' }}>
              Post Comment
            </Button>
          </form>
        </Paper>
      </Grid>

      {/* Display comments */}
      {comments.length > 0 && (
        <div>
          <h3>Comments ({totalComments})</h3>
          {comments.map(comment => (
            <div key={comment._id}>
              <p>User ID: {comment.userId}</p>
              <p>{comment.content}</p>
              {/* Add more comment details as needed */}
            </div>
          ))}
        </div>
      )}
    </Grid>
  )
}

export default CommentForm
