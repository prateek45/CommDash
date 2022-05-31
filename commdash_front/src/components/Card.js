import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useStateValue } from '../StateProvider';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from '../axios'; 

const useStyles = makeStyles( (theme) => ({
  root: {
    marginTop:70,
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CardDisplay({ grpName, grpDescr, grpImage,admin, grpID = null }) {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);

  const descrOpen = () => {
    setOpen(true);
  };

  const addGroup = () => {
    axios.post(`/add/group?id=${user.id}`, {
        name: grpName,
        grp_id: grpID,
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div>
          <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={grpImage}
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                      {grpName}
                  </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={descrOpen}>
                Learn More
                </Button>
                <Button size="small" color="primary" onClick={addGroup}>
                Chat
                </Button>
            </CardActions>
        </Card>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">More about {grpName}</h2>
            <p id="transition-modal-description">{grpDescr}</p>
          </div>
        </Fade>
      </Modal>
      </div>
  );
}
