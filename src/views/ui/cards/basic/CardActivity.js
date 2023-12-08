import React, { useState, useRef, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { styled } from '@mui/system'
import CommentForm from '../../../../pages/components/activity/CommentForm'
import ReactionForm from '../../../../pages/components/activity/ReactionComponent'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/ModeCommentOutlined'
import ShareIcon from '@mui/icons-material/Share'
import ReactionList from '../../../../pages/components/activity/ReactionList'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/router'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Define your GraphQL query for comments
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

// Define your GraphQL query for reactions
const GET_REACTIONS = gql`
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

const UPDATE_SHARE_COUNT = gql`
  mutation UpdateShareCount($activityId: String!) {
    updateShareCount(activityId: $activityId) {
      _id
    }
  }
`

const GET_SHARE_COUNT = gql`
  query ShareCount($activityId: String!) {
    shareCount(activityId: $activityId)
  }
`

const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($activityId: String!, $title: String!, $description: String!) {
    updateActivity(activityId: $activityId, title: $title, description: $description) {
      _id
    }
  }
`

const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($activityId: String!) {
    deleteActivity(activityId: $activityId) {
      _id
    }
  }
`

const PaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'absolute',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '90px',
  marginLeft: '0px'
}))

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '600px',
  margin: 'auto',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}))

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2)
  }
}))

const ReactionFormContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  marginTop: '-55px',
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3]
}))

const CardActivity = ({ activity, selectedActivity, setComments, onUpdateActivityList }) => {
  const router = useRouter()
  const [linkCopied, setLinkCopied] = useState(false) // State to track if link is copied
  const [linkBoxVisible, setLinkBoxVisible] = useState(false) // State to track if link box is visible
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editedActivity, setEditedActivity] = useState({ ...activity })
  const [commentFormVisible, setCommentFormVisible] = useState(false)
  const [reactionFormVisible, setReactionFormVisible] = useState(false)
  const [reactionListVisible, setReactionListVisible] = useState(false)
  const [totalComments, setTotalComments] = useState(activity.totalComments || 0)
  const [totalReactions, setTotalReactions] = useState(reactionData?.reactionsByActivity?.totalReactions || 0)

  const handleMenuOpen = event => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    setEditModalOpen(true)
  }

  const handleDeleteClick = async () => {
    const { data } = await deleteActivity({
      variables: {
        activityId: activity._id
      }
    })
    onUpdateActivityList(activity._id, 'delete', data.updateActivity)
    handleMenuClose()
  }

  const handleEditModalClose = () => {
    setEditModalOpen(false)
  }

  const handleEditSave = async () => {
    try {
      // Call the updateActivity mutation
      const { data } = await updateActivity({
        variables: {
          activityId: editedActivity._id,
          title: editedActivity.title,
          description: editedActivity.description
        }
      })
      onUpdateActivityList(editedActivity._id, 'edit', editedActivity)
    } catch (error) {
      // The onError callback will handle errors
      console.error('Error updating activity:', error.message)
    }

    console.log('Saving edited activity:', editedActivity)

    // Save logic here...
    handleEditModalClose() // Close the modal after saving
  }

  // Use useMutation hook to define updateShareCount function
  const [updateShareCount] = useMutation(UPDATE_SHARE_COUNT, {
    onError: error => {
      console.error('Error updating share count:', error.message)
    }
  })

  const [updateActivity] = useMutation(UPDATE_ACTIVITY)
  const [deleteActivity] = useMutation(DELETE_ACTIVITY)

  const {
    loading: commentLoading,
    error: commentError,
    data: commentData
  } = useQuery(GET_COMMENTS, {
    variables: { activityId: activity._id }
  })

  const {
    loading: reactionLoading,
    error: reactionError,
    data: reactionData
  } = useQuery(GET_REACTIONS, {
    variables: { activityId: activity._id }
  })

  // Use useQuery hook to fetch share count
  const {
    loading: shareCountLoading,
    error: shareCountError,
    data: shareCountData
  } = useQuery(GET_SHARE_COUNT, {
    variables: { activityId: activity._id }
  })

  console.log('shareCountLoading:', shareCountLoading)
  console.log('shareCountError:', shareCountError)
  console.log('shareCountData:', shareCountData)

  const totalShares = shareCountLoading ? 0 : shareCountData?.shareCount || 0
  const filteredComments = commentLoading ? [] : commentData?.commentsByActivity?.comments || []

  const handleAddComment = newComment => {
    setComments(prevComments => [...prevComments, newComment])
    setTotalComments(prevTotalComments => prevTotalComments + 1)
  }

  const handleAddReaction = newReaction => {
    console.log('New reaction:', newReaction)
  }

  const handleShareButtonClick = () => {
    // Show the link box
    setLinkBoxVisible(true)

    setIsDarkMode(true)

    // Hide the link box after a short delay (e.g., 3 seconds)
    setTimeout(() => {
      setLinkBoxVisible(true)
      setLinkCopied(false)

      setIsDarkMode(false)
    }, 3000)
  }

  const handleCopyButtonClick = () => {
    const activityId = activity._id
    const shareableLink = `${window.location.origin}/dashboards/crm/${activityId}`

    const input = document.createElement('input')
    input.value = shareableLink
    document.body.appendChild(input)
    input.select()

    try {
      document.execCommand('copy')
      setLinkCopied(true)
    } catch (err) {
      console.error('Unable to copy link to clipboard', err)
    } finally {
      document.body.removeChild(input)
    }

    // Call the updateShareCount mutation
    updateShareCount({
      variables: { activityId }
    })
  }

  const reactionListRef = useRef()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleCommentButtonClick = () => {
    setCommentFormVisible(prevState => !prevState)
    setReactionFormVisible(false)
    setReactionListVisible(false)
  }

  const handleReactionButtonClick = () => {
    setReactionFormVisible(prevState => !prevState)
    setCommentFormVisible(false)
    setReactionListVisible(prevState => !prevState)
  }

  const handleMouseEnter = () => {
    setReactionFormVisible(true)
  }

  const handleMouseLeave = () => {
    setReactionFormVisible(false)
  }

  const handleReactionNumberOnClick = () => {
    setReactionListVisible(prevState => !prevState)
    setCommentFormVisible(false)
  }

  const handleClickOutsideReactionList = event => {
    if (reactionListRef.current && !reactionListRef.current.contains(event.target)) {
      setReactionListVisible(false)
    }
  }

  const handleClickOutsideLinkBox = event => {
    const linkBox = document.getElementById('linkBox')

    // Check if the click is outside the link box
    if (linkBox && !linkBox.contains(event.target)) {
      setLinkBoxVisible(false)
    }
  }

  console.log('shareCountData:', shareCountData)

  useEffect(() => {
    if (!commentLoading && commentData) {
      setTotalComments(commentData.commentsByActivity.totalComments)
    }
  }, [commentLoading, commentData])

  useEffect(() => {
    if (!reactionLoading && reactionData) {
      setTotalReactions(reactionData.reactionsByActivity.totalReactions)
    }
  }, [reactionLoading, reactionData])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideReactionList)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideReactionList)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideLinkBox)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideLinkBox)
    }
  }, [])
  console.log(activity, '=')

  return (
    <StyledCard className={isDarkMode ? { filter: 'brightness(0.8)' } : {}}>
      <StyledCardContent>
        <IconButton onClick={handleMenuOpen} sx={{ float: 'right' }}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
        {/* Edit Popup */}
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
                ))}
            </Box>

            {/* Reactions, Comments, and Share Count */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                marginTop: '10px',
                marginLeft: '14px'
              }}
            ></Box>
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

        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, position: 'relative' }}>
          <Box sx={{ paddingTop: '8px' }}>
            <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          </Box>
          <Box>
            <Typography variant='body2' sx={{ color: 'text.primary', paddingTop: '10px', paddingBottom: '0px' }}>
              {activity.userId}
            </Typography>
            {/* Display formatted creation date for the activity */}
            <Typography
              variant='caption'
              sx={{ color: 'text.secondary', fontSize: '0.7rem', position: 'absolute', marginTop: '-5px' }}
            >
              {/* Check if activity.createdAt is a valid date string before formatting */}
              {activity.createdAt && !isNaN(new Date(activity.createdAt).getTime()) && (
                <>Posted {formatDistanceToNow(new Date(activity.createdAt))} ago</>
              )}
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, paddingTop: '20px' }}>
              {activity.title}
            </Typography>
            <Typography variant='body1' sx={{ mb: 1.5, width: '505px' }}>
              {activity.description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
          {activity.imgUrls &&
            activity.imgUrls.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`${activity.userId}-${index}`}
                style={{
                  margin: 0,
                  width: '100%',
                  height: '270px',
                  marginRight: '1rem', // Adjust the spacing between images
                  marginBottom: '0.5rem',
                  borderRadius: '25px',
                  padding: '5px'
                }}
              />
            ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            marginTop: '10px',
            marginLeft: '14px'
          }}
        >
          <IconButton size='small' onClick={handleReactionButtonClick}>
            <FavoriteIcon
              sx={{ fontSize: 18, color: 'error.main' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </IconButton>
          {reactionFormVisible && (
            <ReactionFormContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <ReactionForm onAddReaction={handleAddReaction} activityId={activity._id} userId='Manish Shrestha' />
            </ReactionFormContainer>
          )}

          <Typography
            variant='body2'
            sx={{
              mr: 2,
              cursor: 'pointer', // Change the cursor to a pointer
              '&:hover': {
                textDecoration: 'underline' // Add underline on hover
              }
            }}
            onClick={handleReactionNumberOnClick}
          >
            {totalReactions}
          </Typography>
          <IconButton size='small' onClick={handleCommentButtonClick}>
            <CommentIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2' sx={{ mr: 2 }}>
            {totalComments}
          </Typography>

          <IconButton size='small' onClick={handleShareButtonClick}>
            <ShareIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* PaperBox for link display and copy button */}
          {linkBoxVisible && (
            <PaperBox id='linkBox'>
              <Typography variant='body2'>{`${window.location.origin}/dashboards/crm/${activity._id}`}</Typography>
              <IconButton size='small' onClick={handleCopyButtonClick}>
                <FileCopyOutlinedIcon />
              </IconButton>
            </PaperBox>
          )}

          <Typography variant='body2'>{activity.shareCount}</Typography>
        </Box>
        {/* Snackbar for link copied message */}
        <Snackbar open={linkCopied} autoHideDuration={5000} onClose={() => setLinkCopied(false)}>
          <MuiAlert elevation={6} variant='filled' onClose={() => setLinkCopied(false)} severity='success'>
            Link copied to clipboard!
          </MuiAlert>
        </Snackbar>
        {commentFormVisible && (
          <div>
            <CommentForm onAddComment={handleAddComment} activityId={activity._id} userId='Manish Shrestha' />
          </div>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
          {reactionListVisible && <ReactionList activityId={activity._id} userId='Manish Shrestha' />}
        </Box>
      </StyledCardContent>
    </StyledCard>
  )
}

export default CardActivity
