// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'

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

const CardActivity = ({ activity }) => {
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
          style={{ margin: 0 , width: '70%',height:'160px', marginBottom: '1.5rem', borderRadius: '8px' }}
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
            1.2k
          </Typography>
          <IconButton size='small'>
            <ShareIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant='body2'>80</Typography>
        </Box>
      </StyledCardContent>
    </StyledCard>
  )
}

export default CardActivity
