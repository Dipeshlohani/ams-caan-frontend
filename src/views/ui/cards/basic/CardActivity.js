import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import CommentForm from '../../../../pages/components/activity/CommentForm';
import ReactionForm from '../../../../pages/components/activity/ReactionComponent';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ReactionList from '../../../../pages/components/activity/ReactionList';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/router';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
`;

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
`;

const UPDATE_SHARE_COUNT = gql`
  mutation UpdateShareCount($activityId: String!) {
    updateShareCount(activityId: $activityId) {
      _id
    }
  }
`;

const GET_SHARE_COUNT = gql`
  query ShareCount($activityId: String!) {
    shareCount(activityId: $activityId)
  }
`;

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
  marginLeft: '0px',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '600px',
  margin: 'auto',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const ReactionFormContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  marginTop: '-55px',
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const CardActivity = ({ activity, selectedActivity, setComments }) => {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkBoxVisible, setLinkBoxVisible] = useState(false);
  const [url, setUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [updateShareCount] = useMutation(UPDATE_SHARE_COUNT, {
    onError: (error) => {
      console.error('Error updating share count:', error.message);
    },
  });

  const {
    loading: commentLoading,
    error: commentError,
    data: commentData,
  } = useQuery(GET_COMMENTS, {
    variables: { activityId: activity._id },
  });

  const {
    loading: reactionLoading,
    error: reactionError,
    data: reactionData,
  } = useQuery(GET_REACTIONS, {
    variables: { activityId: activity._id },
  });

  const {
    loading: shareCountLoading,
    error: shareCountError,
    data: shareCountData,
  } = useQuery(GET_SHARE_COUNT, {
    variables: { activityId: activity._id },
  });

  const totalShares = shareCountLoading ? 0 : shareCountData?.shareCount || 0;

  const filteredComments = commentLoading
    ? []
    : commentData?.commentsByActivity?.comments || [];

  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
    setTotalComments((prevTotalComments) => prevTotalComments + 1);
  };

  const handleAddReaction = (newReaction) => {
    console.log('New reaction:', newReaction);
  };

  const handleShareButtonClick = async () => {
    await generateTinyUrl();
    handleCopyButtonClick();
    await incrementShareCount();
  };

  const generateTinyUrl = async () => {
    if (!activity) {
      console.error('Error: Activity details not available.');
      return;
    }

    const activityId = activity._id;
    const currentUrl = `${window.location.origin}/dashboards/crm/${activityId}`;

    try {
      const response = await fetch(`http://tinyurl.com/api-create.php?url=${currentUrl}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      setUrl(data);
    } catch (error) {
      console.error('Error shortening URL:', error.message);
    }
  };

  const handleCopyButtonClick = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(
        () => {
          setLinkCopied(true);
          setSnackbarOpen(true);
        },
        (error) => {
          console.error('Error copying URL to clipboard:', error.message);
        }
      );
    }
  };

  const incrementShareCount = async () => {
    if (!activity) {
      console.error('Error: Activity details not available.');
      return;
    }

    try {
      const response = await fetch(`/api/activity/incrementShareCount/${activity._id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const shareCountData = await response.json();
      setShareCount(shareCountData.count);
    } catch (error) {
      console.error('Error incrementing share count:', error.message);
    }
  };

  const [commentFormVisible, setCommentFormVisible] = useState(false);
  const [reactionFormVisible, setReactionFormVisible] = useState(false);
  const [reactionListVisible, setReactionListVisible] = useState(false);
  const [totalComments, setTotalComments] = useState(activity.totalComments || 0);
  const [totalReactions, setTotalReactions] =
    useState(reactionData?.reactionsByActivity?.totalReactions || 0);

  const reactionListRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCommentButtonClick = () => {
    setCommentFormVisible((prevState) => !prevState);
    setReactionFormVisible(false);
    setReactionListVisible(false);
  };

  const handleReactionButtonClick = () => {
    setReactionFormVisible((prevState) => !prevState);
    setCommentFormVisible(false);
    setReactionListVisible((prevState) => !prevState);
  };

  const handleMouseEnter = () => {
    setReactionFormVisible(true);
  };

  const handleMouseLeave = () => {
    setReactionFormVisible(false);
  };

  const handleReactionNumberOnClick = () => {
    setReactionListVisible((prevState) => !prevState);
    setCommentFormVisible(false);
  };

  const handleClickOutsideReactionList = (event) => {
    if (
      reactionListRef.current &&
      !reactionListRef.current.contains(event.target)
    ) {
      setReactionListVisible(false);
    }
  };

  const handleClickOutsideLinkBox = (event) => {
    const linkBox = document.getElementById('linkBox');

    if (linkBox && !linkBox.contains(event.target)) {
      setLinkBoxVisible(false);
    }
  };

  useEffect(() => {
    if (!commentLoading && commentData) {
      setTotalComments(commentData.commentsByActivity.totalComments);
    }
  }, [commentLoading, commentData]);

  useEffect(() => {
    if (!reactionLoading && reactionData) {
      setTotalReactions(reactionData.reactionsByActivity.totalReactions);
    }
  }, [reactionLoading, reactionData]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideReactionList);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideReactionList);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideLinkBox);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideLinkBox);
    };
  }, []);

  return (
    <StyledCard className={isDarkMode ? { filter: 'brightness(0.8)' } : {}}>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, position: 'relative' }}>
          <Box sx={{ paddingTop: '8px' }}>
            <Avatar alt='User Avatar' src='/images/avatars/4.png' sx={{ width: 32, height: 32, mr: 1 }} />
          </Box>
          <Box>
            <Typography variant='body2' sx={{ color: 'text.primary', paddingTop: '10px', paddingBottom: '0px' }}>
              {activity.userId}
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: 'text.secondary', fontSize: '0.7rem', position: 'absolute', marginTop: '-5px' }}
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

          <Typography
            variant='body2'
            sx={{
              mr: 2,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
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

        <Snackbar open={linkCopied} autoHideDuration={5000} onClose={() => setLinkCopied(false)}>
          <MuiAlert elevation={6} variant='filled' onClose={() => setLinkCopied(false)} severity='success'>
            Link copied to clipboard!
          </MuiAlert>
        </Snackbar>
        {commentFormVisible && <CommentForm onAddComment={handleAddComment} activityId={activity._id} userId='Manish Shrestha' />}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
          {reactionListVisible && <ReactionList activityId={activity._id} userId='Manish Shrestha' />}
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};
export default CardActivity;
