import React, { useState, useRef, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/ModeCommentOutlined'
import ShareIcon from '@mui/icons-material/Share'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import CommentForm from '../../components/activity/CommentForm'
import ReactionForm from '../../components/activity/ReactionComponent'
import ReactionList from '../../components/activity/ReactionList'
import { useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/router'

// Define your GraphQL query for a single activity
const GET_ACTIVITY = gql`
  query GetActivity($activityId: String!) {
    activity(id: $activityId) {
      _id
      userId
      title
      description
      createdAt
    }
  }
`

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

const ActivityDetailPage = () => {
  const router = useRouter()
  const { activityId } = router.query

  // Fetch activity details
  const {
    loading: activityLoading,
    error: activityError,
    data: activityData
  } = useQuery(GET_ACTIVITY, {
    variables: { activityId }
  })

  // Fetch comments
  const {
    loading: commentLoading,
    error: commentError,
    data: commentData
  } = useQuery(GET_COMMENTS, {
    variables: { activityId }
  })

  // Fetch reactions
  const {
    loading: reactionLoading,
    error: reactionError,
    data: reactionData
  } = useQuery(GET_REACTIONS, {
    variables: { activityId }
  })

  console.log('Activity ID:', activityId)
  console.log('Comment Data:', commentData)
  console.log('Reaction Data:', reactionData)

  const [commentFormVisible, setCommentFormVisible] = useState(false)
  const [reactionFormVisible, setReactionFormVisible] = useState(false)
  const [reactionListVisible, setReactionListVisible] = useState(false)
  if (activityLoading || commentLoading || reactionLoading) return <p>Loading...</p>
  if (activityError) return <p>Error: {activityError.message}</p>
  if (!activityData?.activity) return <p>Activity not found or loading...</p>
  if (!commentData?.commentsByActivity) return <p>Error loading comments</p>
  if (!reactionData?.reactionsByActivity) return <p>Error loading reactions</p>

  const activity = activityData.activity
  const comments = commentData?.commentsByActivity?.comments || []
  const totalComments = commentData?.commentsByActivity?.totalComments || 0
  const reactions = reactionData?.reactionsByActivity?.reactions || []
  const totalReactions = reactionData?.reactionsByActivity?.totalReactions || 0

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

  const handleAddReaction = newReaction => {
    console.log('New reaction:', newReaction)
  }

  const handleMouseEnter = () => {
    setReactionFormVisible(true)
  }

  const handleMouseLeave = () => {
    setReactionFormVisible(false)
  }

  return (
    <Card
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '16px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        width: '600px',
        margin: 'auto',
        '&:hover': {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 1.5,
            position: 'relative'
          }}
        >
          <Box sx={{ paddingTop: '8px' }}>
            <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          </Box>
          <Box>
            <Typography variant='body2' sx={{ color: 'text.primary', paddingTop: '10px', paddingBottom: '0px' }}>
              {activity.userId}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                position: 'absolute',
                marginTop: '-5px'
              }}
            >
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            marginTop: '-20px',
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
          <Typography variant='body2' sx={{ mr: 2, cursor: 'pointer' }} onClick={handleReactionButtonClick}>
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
        </Box>
        {commentFormVisible && (
          <CommentForm
            onAddComment={(newComment, newTotalComments) => {
              // You can perform any additional logic here if needed
              setTotalComments(newTotalComments)
            }}
            activityId={activity._id}
            userId='Manish Shrestha'
            totalComments={totalComments}
          />
        )}

        {reactionListVisible && <ReactionList activityId={activity._id} userId='Manish Shrestha' />}
      </CardContent>
    </Card>
  )
}

export default ActivityDetailPage
