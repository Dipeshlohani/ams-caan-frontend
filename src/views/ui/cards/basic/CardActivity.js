import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '900px',
  margin: 'auto',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const CardActivity = ({ activity }) => {
  const [url, setUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    // Generate TinyURL when the component mounts
    generateTinyUrl();
  }, []);

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
  const handleOpenCopiedUrl = () => {
    router.push(`/dashboards/crm/`);
  };

  const handleShareButtonClick = () => {
    // Generate TinyURL and copy to clipboard
    generateTinyUrl();
    handleCopyButtonClick();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);

    if (copied) {
      handleOpenCopiedUrl();
    }
  };

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {activity?.description}
        </Typography>
        <IconButton size="small" onClick={generateTinyUrl}>
          <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
        </IconButton>
        <IconButton size="small" onClick={generateTinyUrl}>
          <CommentIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" onClick={handleShareButtonClick}>
          <ShareIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
            Link copied to clipboard!
          </MuiAlert>
        </Snackbar>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogActions>
            <Button onClick={generateTinyUrl}>Copy URL</Button>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </StyledCardContent>
    </StyledCard>
  );
};
export default CardActivity;
