import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'
import CommentForm from '../../../../pages/components/activity/CommentForm'
import ReactionForm from '../../../../pages/components/activity/ReactionComponent'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/ModeCommentOutlined'
import ShareIcon from '@mui/icons-material/Share'
import ReactionList from '../../../../pages/components/activity/ReactionList'

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '900px',
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
  top: '70px', // Adjust this value as needed
  left: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3]
}))

const ReactionListContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-20px', // Adjust this value to control the overlap
  left: '50%', // Center the Reaction List
  transform: 'translateX(-50%)', // Center the Reaction List
  zIndex: 1000, // Set a higher zIndex value
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '200px' // Adjust the width as needed
}))

const CardActivity = ({ activity, selectedActivity, comments, setComments }) => {
  const filteredComments = comments.filter(comment => comment.activityId === activity._id)
  const totalComments = filteredComments.length

  const handleAddComment = newComment => {
    setComments(prevComments => [...prevComments, newComment])
  }

  const handleAddReaction = newReaction => {
    console.log('New reaction:', newReaction)
  }

  const [commentFormVisible, setCommentFormVisible] = useState(false)
  const [reactionFormVisible, setReactionFormVisible] = useState(false)
  const [reactionListVisible, setReactionListVisible] = useState(false)

  const reactionListRef = useRef()

  const handleCommentButtonClick = () => {
    setCommentFormVisible(prevState => !prevState)
    setReactionFormVisible(false)
    setReactionListVisible(false)
  }

  const handleReactionButtonClick = () => {
    setReactionFormVisible(prevState => !prevState)
    setCommentFormVisible(false)
    // Toggle the visibility of the reaction list
    setReactionListVisible(prevState => !prevState)
  }

  const handleMouseEnter = () => {
    setReactionFormVisible(true)
  }

  const handleMouseLeave = () => {
    setReactionFormVisible(false)
  }

  const handleReactionNumberOnClick = () => {
    // Toggle the visibility of the reaction list
    setReactionListVisible(prevState => !prevState)
  }

  const handleClickOutsideReactionList = event => {
    if (reactionListRef.current && !reactionListRef.current.contains(event.target)) {
      setReactionListVisible(false)
    }
  }

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutsideReactionList)

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideReactionList)
    }
  }, [])

  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
          <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          <Box>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {activity.userId}
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
              {activity.title}
            </Typography>
          </Box>
          {reactionFormVisible && (
            <ReactionFormContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <ReactionForm onAddReaction={handleAddReaction} activityId={activity._id} userId='12345' />
            </ReactionFormContainer>
          )}

          {reactionListVisible && (
            <ReactionListContainer ref={reactionListRef}>
              {/* Render the ReactionList component here */}
              {/* Pass necessary props like activityId, userId, etc. */}
              <ReactionList activityId={activity._id} userId='12345' />
            </ReactionListContainer>
          )}
        </Box>
        <Typography variant='body1' sx={{ mb: 1.5 }}>
          {activity.description}
        </Typography>
        <img
          src='/images/avatars/4.png'
          alt={activity.userId}
          style={{ margin: 0, width: '70%', height: '160px', marginBottom: '1.5rem', borderRadius: '8px' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <IconButton size='small' onClick={handleReactionButtonClick}>
            <FavoriteIcon
              sx={{ fontSize: 18, color: 'error.main' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </IconButton>
          <Typography variant='body2' sx={{ mr: 2 }} onClick={handleReactionNumberOnClick}>
            1.2k
          </Typography>
          <IconButton size='small' onClick={handleCommentButtonClick}>
            <CommentIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2' sx={{ mr: 2 }}>
            {totalComments}
          </Typography>
          <IconButton size='small'>
            <ShareIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2'>80</Typography>
        </Box>
        {commentFormVisible && (
          <CommentForm onAddComment={handleAddComment} activityId={activity._id} userId='user1236785' />
        )}
        {filteredComments.length > 0 && (
          <div>
            <h3>Comments</h3>
            {filteredComments.map(comment => (
              <div key={comment._id}>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
          {/* ... (existing code) */}
          {reactionListVisible && (
            <ReactionListContainer ref={reactionListRef}>
              {/* Render the ReactionList component here */}
              {/* Pass necessary props like activityId, userId, etc. */}
              <ReactionList activityId={activity._id} userId='12345' />
            </ReactionListContainer>
          )}
        </Box>
      </StyledCardContent>
    </StyledCard>
  )
}

export default CardActivity
