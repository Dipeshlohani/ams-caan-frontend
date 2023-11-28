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
import { useQuery } from '@apollo/react-hooks' // Import useQuery
import { gql } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'

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
  top: '330px', // Adjust this value as needed
  left: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3]
}))

const CardActivity = ({ activity, selectedActivity, setComments }) => {
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

  const filteredComments = commentLoading ? [] : commentData?.commentsByActivity?.comments || []

  const handleAddComment = newComment => {
    setComments(prevComments => [...prevComments, newComment])
    setTotalComments(prevTotalComments => prevTotalComments + 1)
  }

  const handleAddReaction = newReaction => {
    console.log('New reaction:', newReaction)
  }

  const [commentFormVisible, setCommentFormVisible] = useState(false)
  const [reactionFormVisible, setReactionFormVisible] = useState(false)
  const [reactionListVisible, setReactionListVisible] = useState(false)
  const [totalComments, setTotalComments] = useState(activity.totalComments || 0)
  const [totalReactions, setTotalReactions] = useState(reactionData?.reactionsByActivity?.totalReactions || 0)

  const reactionListRef = useRef()

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
  }

  const handleClickOutsideReactionList = event => {
    if (reactionListRef.current && !reactionListRef.current.contains(event.target)) {
      setReactionListVisible(false)
    }
  }

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

  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, position: 'relative' }}>
          <Box sx={{paddingTop:'19px'}}>
          <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1, }} />
          </Box>
          <Box>
            {/* Display formatted creation date for the activity */}
            <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem', paddingTop: '0px' }}>
              {/* Check if activity.createdAt is a valid date string before formatting */}
              {activity.createdAt && !isNaN(new Date(activity.createdAt).getTime()) && (
                <>Posted {formatDistanceToNow(new Date(activity.createdAt))} ago</>
              )}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.primary', paddingTop: '0px' }}>
              {activity.userId}
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, paddingTop: '0px' }}>
              {activity.title}
            </Typography>
            <Typography variant='body1' sx={{ mb: 1.5 }}>
              {activity.description}
            </Typography>
          </Box>
          {reactionFormVisible && (
            <ReactionFormContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <ReactionForm onAddReaction={handleAddReaction} activityId={activity._id} userId='12345' />
            </ReactionFormContainer>
          )}
        </Box>

        <img
          src='/images/cards/Rectangle 45.png'
          alt={activity.userId}
          style={{
            margin: 0,
            width: '100%',
            height: '270px',
            marginBottom: '1.5rem',
            borderRadius: '25px',
            padding: '5px'
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', marginTop:'-20px', marginLeft:'14px' }}>
          <IconButton size='small' onClick={handleReactionButtonClick}>
            <FavoriteIcon
              sx={{ fontSize: 18, color: 'error.main' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </IconButton>
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

          <IconButton size='small'>
            <ShareIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2'>80</Typography>
        </Box>
        {commentFormVisible && (
          <div>
            <CommentForm onAddComment={handleAddComment} activityId={activity._id} userId='user1236785' />
          </div>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
          {reactionListVisible && <ReactionList activityId={activity._id} userId='12345' />}
        </Box>
      </StyledCardContent>
    </StyledCard>
  )
}

export default CardActivity
