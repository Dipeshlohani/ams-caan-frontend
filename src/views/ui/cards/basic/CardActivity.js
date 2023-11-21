// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'
import CommentForm from '../../../../pages/components/activity/CommentForm'
import ReactionForm from '../../../../pages/components/activity/ReactionComponent'
// ** Icons Imports
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/ModeCommentOutlined'
import ShareIcon from '@mui/icons-material/Share'

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

const CardActivity = ({ activity, selectedActivity, comments, setComments }) => {
  // Filter comments by activity ID
  const filteredComments = comments.filter(comment => comment.activityId === activity._id)

  // Calculate the total number of comments for this activity
  const totalComments = filteredComments.length

  // Function to handle comment submission
  const handleAddComment = newComment => {
    // Update the comments state using setComments
    setComments(prevComments => [...prevComments, newComment])
  }

  const handleAddReaction = newReaction => {
    // Handle the reaction as needed
    // You can update the state or perform any other actions
    console.log('New reaction:', newReaction)
  }

  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          <Box>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {activity.userId}
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
              {activity.title}
            </Typography>
          </Box>
        </Box>
        <Typography variant='body1' sx={{ mb: 1.5 }}>
          {activity.description}
        </Typography>
        {/* Add a place for the image here */}
        <img
          src='/images/avatars/4.png'
          alt={activity.userId}
          style={{ margin: 0, width: '70%', height: '160px', marginBottom: '1.5rem', borderRadius: '8px' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <IconButton size='small'>
            <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
          </IconButton>
          <Typography variant='body2' sx={{ mr: 2 }}>
            1.2k
          </Typography>
          <IconButton size='small'>
            <CommentIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2' sx={{ mr: 2 }}>
            {totalComments} {/* Display the total number of comments */}
          </Typography>
          <IconButton size='small'>
            <ShareIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2'>80</Typography>
        </Box>
        {/* Display ReactionsComponent */}
        <ReactionForm
          onAddReaction={handleAddReaction}
          activityId={activity._id}
          userId='user123' // Replace with the actual user ID or fetch it dynamically
        />

        {/* Display CommentForm */}
        <CommentForm
          onAddComment={handleAddComment}
          activityId={activity._id}
          userId='user123' // Replace with the actual user ID or fetch it dynamically
        />

        {/* Display comments */}
        {filteredComments.length > 0 && (
          <div>
            <h3>Comments</h3>
            {filteredComments.map(comment => (
              <div key={comment._id}>
                <p>{comment.content}</p>
                {/* Add more comment details as needed */}
              </div>
            ))}
          </div>
        )}
      </StyledCardContent>
    </StyledCard>
  )
}

export default CardActivity
