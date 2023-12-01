import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { TextField, Button, Grid, Typography, Box, Avatar, Paper } from '@mui/material'
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
    <Grid container  padding='10px'>
      <Grid item xs={12} sm={8} md={6}>
        <div>
          {comments.map(comment => (
            <Paper
              key={comment._id}
              elevation={3}
              style={{ padding: '10px', margin: '10px 0', width: '547px',  }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt='User Avatar' src='/images/avatars/6.png' sx={{ width: 32, height: 32, mr: 1 }} />
                <div>
                  <Typography style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{comment.userId}</Typography>
                  <Typography variant='body1'>{comment.content}</Typography>
                  <Typography style={{ fontSize: '0.7rem', color: '#777' }}>
                    Posted {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </Typography>
                </div>
              </Box>
            </Paper>
          ))}
        </div>
        <div style={{ padding: '0 0px', marginTop: '10px', width: '547px',  maxHeight: '' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Comment'
              variant='outlined'
              multiline
              rows={1}
              margin='normal'
              value={content}
              onChange={e => setContent(e.target.value)}

            />
            <Button type='submit' variant='contained' color='primary' style={{ marginTop: '10px', maxHeight: '30px' }}>
              Post Comment
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

export default CommentForm
