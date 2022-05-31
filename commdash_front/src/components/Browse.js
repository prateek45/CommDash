import React, { useEffect,useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useStateValue } from '../StateProvider';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import axios from '../axios'; 
import Pusher from 'pusher-js';
import Cards from './Card.js'
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { green } from '@material-ui/core/colors';
import { Block } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

const pusher = new Pusher('d2e40102bb65c4ab886c', {
  cluster: 'ap4'
});

const useStyles = makeStyles( (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 68,
    marginBottom: 95,
  },
  cardRoot: {
    maxWidth: 230,
    maxHeight: 230,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "grey",
  },
  cardAction: {
    width: 100 + "%",
    display: Block,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '80%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    zIndex: '100',
    color: 'black',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    backgroundColor: 'aliceblue',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60%',
      '&:focus': {
        width: '100%',
      },
    },
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: "none"
  },
}));

export default function CardDisplay() {
  const classes = useStyles();
  const history = useHistory();

  const [{ user }] = useStateValue();
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [grpname, setGrpName] = useState(" ");
  const [grpDes, setGrpDesc] = useState(" ");
  const [grpImg, setGrpImg] = useState(" ");

  const createGroup = (e) => {
    e.preventDefault();
    setOpen(false);
    axios.post('/new/groups', {
      group : {
        Name: grpname,
        description: grpDes,
        admin: user.id,
        grpImage: grpImg
    }
  }).then((res) => {
    axios.post(`/add/group?id=${user.id}`, {
    
    name: grpname,
    grp_id: res.data._id
    
  })
    history.push(`/${user.id}`)
  })};

  const handleUploadClick = (event) => {
    var file = event.target.files[0];    
    setGrpImg(file);
  };


  const descrOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const  getGroups = () => {
    axios.get(`/get/groups`).then((res) => {
      setGroups(res.data)
    })
  }
  useEffect(() => {
    getGroups()

    //realtime processing
    const channel = pusher.subscribe('grps');
    channel.bind('newgrps', function(data) {
      getGroups()
    });

  }, [])

  return (
      <div className={classes.root}>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
        </div>
         <div className={classes.root}>
         
          <Grid container spacing={3}>
            <Grid item xs= {4}>
              <Card className={classes.cardRoot} onClick={descrOpen}>
                <CardActionArea className={classes.cardAction}>
                  <CardContent>
                    <AddIcon style={{ color: green[500], height: 100 + "%", width: "auto" }} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          {
             groups.map((grp) => (
              <Grid item xs= {4}>
                <Cards 
                grpName = {grp.group.Name}
                grpDescr = {grp.group.description}
                grpImage = {grp.group.grpImage}
                admin = {grp.group.admin}
                grpID = {grp._id}
                />
              </Grid>
             ))
           }
          </Grid>
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
              <form onSubmit = {createGroup}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      autoComplete="GrpName"
                      name="GroupName"
                      variant="outlined"
                      required
                      fullWidth
                      id="Group Name"
                      label="Group Name"
                      autoFocus
                      onChange={e => setGrpName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm = {6} >
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleUploadClick}
                    />
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" color="primary" component="span">
                        Upload Image
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="Description"
                      label="Group Description"
                      name="Group Description"
                      autoComplete="Group Description"
                      onChange={e => setGrpDesc(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Create Group
                </Button> 
              </form>

              </div>
            </Fade>
          </Modal>
          <div>

          </div>
        </div>
      </div>
  );
}
