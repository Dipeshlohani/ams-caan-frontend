import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import {
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar
} from '@mui/material'
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate'
import CancelIcon from '@mui/icons-material/Cancel'
import AttachFileIcon from '@mui/icons-material/AttachFile'

const CREATE_ACTIVITY = gql`
  mutation CreateActivity(
    $title: String!
    $description: String!
    $userId: String!
    $imgUrls: [String!]!
    $files: [String!]!
  ) {
    createActivity(title: $title, description: $description, userId: $userId, imgUrls: $imgUrls, files: $files) {
      title
      description
      userId
      imgUrls
      _id
      files
    }
  }
`

const ActivityForm = ({ onAddActivity, onHideForm }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [userId, setUserId] = useState('Manish Shrestha')
  const [files, setFiles] = useState([]) // State to store the selected files
  const [uploadedFiles, setUploadedFiles] = useState([]) // State to store the uploaded file information
  const [imageFiles, setImageFiles] = useState([])

  const [createActivity] = useMutation(CREATE_ACTIVITY)

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files))
  }

  const handleImageFileChange = e => {
    setImageFiles(Array.from(e.target.files))
  }

  const handleCancelImageFile = file => {
    setImageFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  const handleCancelFile = file => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  const getFilePreview = file => URL.createObjectURL(file)

  const uploadFiles = async (files, endpoint, folderId) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await fetch(`http://localhost:3001/${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        folderId
      }
    })

    if (response.ok) {
      const result = await response.json()

      return result.map(res => res.path)
    } else {
      console.error(`${endpoint} upload failed`)

      return []
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const imageUrls = []
      const fileUrls = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadFiles(imageFiles, 'file', 'imageFolder')
      }
      if (files.length > 0) {
        fileUrls = await uploadFiles(files, 'file', 'fileFolder')
      }

      const { data } = await createActivity({
        variables: { title, description, userId, imgUrls: imageUrls, files: fileUrls }
      })

      // Reset form fields
      setTitle('')
      setDescription('')
      setFiles([])
      setImageFiles([])

      // Notify the parent component about the new activity
      onAddActivity(data.createActivity)

      // Hide the form
      // onHideForm()
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  return (
    <Grid container justifyContent='center' padding='0px'>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={4} style={{ padding: '20px', width: '600px' }}>
          <Typography variant='h6' sx={{ margin: '10px', float: 'center' }}>
            Create Activity
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Title and Description */}
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
              rows={2}
              margin='normal'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            {/* Image Upload Section */}
            <input
              id='upload-images'
              type='file'
              accept='image/*'
              onChange={handleImageFileChange}
              multiple
              style={{ display: 'none' }} // hide the input visually
            />
            <label htmlFor='upload-images'>
              <IconButton component='span'>
                <AddPhotoIcon />
              </IconButton>
            </label>
            {/* Display the list of selected image files with previews */}
            {imageFiles.length > 0 && (
              <FileList files={imageFiles} onCancel={handleCancelImageFile} getFilePreview={getFilePreview} />
            )}

            {/* File Upload Section */}
            {/* <Typography variant='h9' style={{ marginTop: '20px' }}>
              Upload Files
            </Typography> */}
            <input
              id='upload-files'
              type='file'
              accept='.pdf, .doc, .docx'
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }} // hide the input visually
            />
            <label htmlFor='upload-files'>
              <IconButton component='span'>
                <AttachFileIcon />
              </IconButton>
            </label>
            {/* Display the list of selected file files with previews */}
            {files.length > 0 && <FileList files={files} onCancel={handleCancelFile} getFilePreview={getFilePreview} />}

            {/* End of File Upload Section */}
            <Button type='submit' variant='contained' color='primary' style={{ marginTop: '10px', float: 'right' }}>
              Add Activity
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

// FileList component to display the list of selected files with previews
const FileList = ({ files, onCancel, getFilePreview }) => (
  <List style={{ marginTop: '10px' }}>
    {files.map((file, index) => (
      <ListItem key={index}>
        <Avatar alt={`Image ${index + 1}`} src={getFilePreview(file)} />
        <ListItemText primary={file.name} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => onCancel(file)} edge='end' aria-label='cancel'>
            <CancelIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
)

export default ActivityForm
