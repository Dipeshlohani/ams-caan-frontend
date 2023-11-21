// ActivityForm.js
import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { TextField, Button, Grid, Paper } from '@mui/material'

const CREATE_ACTIVITY = gql`
  mutation CreateActivity($title: String!, $description: String!, $userId: String!) {
    createActivity(title: $title, description: $description, userId: $userId) {
      _id
      title
      description
      userId
    }
  }
`

const ActivityForm = ({ onAddActivity }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [userId, setUserId] = useState('<userId>') // You may need to get the user ID dynamically

  const [createActivity] = useMutation(CREATE_ACTIVITY)

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const { data } = await createActivity({
        variables: { title, description, userId }
      })

      // Reset form fields
      setTitle('')
      setDescription('')

      // Notify parent component about the new activity
      onAddActivity(data.createActivity)
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  return (
    <Grid container justifyContent='center' padding='30px'>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Title'
              variant='outlined'
              margin='normal'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label='Description'
              variant='outlined'
              multiline
              rows={4}
              margin='normal'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <Button type='submit' variant='contained' color='primary' style={{ marginTop: '10px' }}>
              Add Activity
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default ActivityForm
