import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'

const EditActivityCard = ({
  editModalOpen,
  handleEditModalClose,
  handleEditSave,
  handleImageUpload,
  editedActivity,
  setEditedActivity,
  handleDeleteImage
}) => {
  return (
    <Dialog open={editModalOpen} onClose={handleEditModalClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Activity</DialogTitle>
      <DialogContent>
        {/* Avatar and user information */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, position: 'relative' }}>
          <Box sx={{ paddingTop: '8px' }}>
            <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          </Box>
          <Box>
            {/* You can make user information editable if needed */}
            <Typography variant='body2' sx={{ color: 'text.primary', paddingTop: '10px', paddingBottom: '0px' }}>
              {editedActivity.userId}
            </Typography>
          </Box>
        </Box>

        {/* Title and description */}
        <TextField
          label='Title'
          fullWidth
          value={editedActivity.title}
          onChange={e => setEditedActivity({ ...editedActivity, title: e.target.value })}
          sx={{ margin: '10px', pr: '10px' }}
        />
        <TextField
          label='Description'
          fullWidth
          multiline
          value={editedActivity.description}
          onChange={e => setEditedActivity({ ...editedActivity, description: e.target.value })}
          sx={{ margin: '10px', pr: '10px' }}
        />

        {/* Images */}
        <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
          {editedActivity.imgUrls &&
            editedActivity.imgUrls.map((imgUrl, index) => (
              <div key={index} style={{ position: 'relative', marginRight: '1rem', minWidth: '100px' }}>
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${editedActivity.userId}-${index}`}
                  style={{
                    margin: 0,
                    width: '100%',
                    height: '270px',
                    marginRight: '1rem',
                    marginBottom: '0.5rem',
                    borderRadius: '25px',
                    padding: '5px'
                  }}
                />
                {/* Add a delete button for each image */}
                <IconButton
                  size='small'
                  style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'white' }}
                  onClick={() => handleDeleteImage(index)}
                >
                  <HighlightOffIcon />
                </IconButton>
              </div>
            ))}
          {/* Add a button to upload new images */}
          <input type='file' accept='image/*' onChange={handleImageUpload} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleEditModalClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleEditSave} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditActivityCard
