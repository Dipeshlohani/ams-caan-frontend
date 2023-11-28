import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { TextField, Button, Grid, Paper, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $userId: String!, $activityId: String!) {
    createComment(content: $content, userId: $userId, activityId: $activityId) {
      _id
      content
      userId
      activityId
      createdAt
    }
  }
`

const GET_COMMENTS = gql`
  query CommentsByActivity($activityId: String!) {
    commentsByActivity(activityId: $activityId) {
      comments {
        _id
        userId
        activityId
        content
        createdAt
      }
      totalComments
    }
  }
`

const CommentForm = ({ onAddComment, activityId, userId, totalComments }) => {
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

      setContent('')

      onAddComment(commentData.createComment, totalComments + 1)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  if (loading) return <p>Loading comments...</p>
  if (error) return <p>Error loading comments: {error.message}</p>

  const { comments, totalComments: commentsCount } = data.commentsByActivity

  return (
    <Grid container justifyContent='center' padding='30px'>
      <Grid item xs={12} sm={8} md={6}>
        <div>
          {comments.map(comment => (
            <Paper key={comment._id} elevation={3} style={{ padding: '10px', margin: '10px 0' }}>
              <Typography>{comment.userId}</Typography>
              <Typography variant='body1' style={{ fontWeight: 'bold' }}>
                {comment.content}
              </Typography>
              <Typography style={{ fontSize: '0.7rem', color: '#777' }}>
                Posted {formatDistanceToNow(new Date(comment.createdAt))} ago
              </Typography>
            </Paper>
          ))}
        </div>
      </Grid>

      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
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
    </Grid>
  )
}

export default CommentForm
