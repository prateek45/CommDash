import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import SidebarOption from "./SidebarOption"
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import axios from './axios'; 
import { useStateValue } from './StateProvider';
import Pusher from 'pusher-js';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GroupIcon from '@material-ui/icons/Group';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import TelegramIcon from '@material-ui/icons/Telegram';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const drawerWidth = 240;

const pusher = new Pusher('d2e40102bb65c4ab886c', {
    cluster: 'ap4'
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Sidebar() {
    const [chats, setChats] = useState([]);
    const [groups, setgroups] = useState([]);
    const [peoples, setpeoples] = useState([]);
    const [{user}] = useStateValue();
    const [open, setOpen] = useState(true);
    const [chanOpen, setChanOpen] = useState(true);
    const [peopOpen, setpeopOpen] = useState(true);
    const [grpOpen, setgrpOpen] = useState(true);

    const handleClick = () => {
      setChanOpen(!chanOpen);
    };

    const handlePeopClick = () => {
      setpeopOpen(!peopOpen);
    };
    const handleGrpClick = () => {
      setgrpOpen(!grpOpen);
    };

    const  getList = () => {
        axios.get(`/get/chatlist?id=${user.id}`).then((res) => {
          setChats(res.data)
        })
        axios.get(`/get/peoplelist?id=${user.id}`).then((res) => {
          setpeoples(res.data)
        })
        axios.get(`/get/grouplist?id=${user.id}`).then((res) => {
          setgroups(res.data)
        })
    }
    useEffect(() => {
       getList()

       //realtime processing
       const channel = pusher.subscribe('chats');
       const grpChannel = pusher.subscribe('grps');

       channel.bind('newChats', function(data) {
         getList()
       });

       grpChannel.bind('newgrps', function(data){
         getList()
       });

    }, [])
    const classes = useStyles();
    const theme = useTheme();

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerOpen = () => {
      setOpen(true);
    };

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                CommDash, Get Connected!
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
            paper: classes.drawerPaper,
            }}
        >

            <div className={classes.drawerHeader}>
                    <div><h1>Welcome {user.Fname} </h1></div>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>                
            <SidebarOption Icon={InsertCommentIcon} title="Announcements" type = "announcements" />

            <SidebarOption Icon={EventIcon} title="Events" type = "events" />

            <SidebarOption Icon={SupervisedUserCircleIcon} title="Groups"  />

            <SidebarOption Icon={GroupIcon} title="People"  />

            <Divider />  

            
            <ListItem button onClick={handleGrpClick}>
              <ListItemIcon>
                {grpOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary= "Groups" />
            </ListItem>
            <Collapse in={grpOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  groups.map(grp => (
                    <ListItem button className={classes.nested}>
                      <SidebarOption title={grp.name} id={grp.grp_id} type = "group"/>
                    </ListItem>
                  ))
                }
              </List>
            </Collapse>

            <ListItem button onClick={handlePeopClick}>
              <ListItemIcon>
                {peopOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary= "People" />
            </ListItem>
            <Collapse in={peopOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  peoples.map(pep => (
                    <ListItem button className={classes.nested}>
                      <SidebarOption title={pep.name} id={user.id} type = "people"/>
                    </ListItem>
                  ))
                }
              </List>
            </Collapse>


            <SidebarOption id={user.id} Icon={AddIcon} addChannelOption title="Add Channel" />
            
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <TelegramIcon />
              </ListItemIcon>
              <ListItemText primary="Your Channels" />
              {chanOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={chanOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  chats.map(chat => (
                    <ListItem button className={classes.nested}>
                      <SidebarOption title={chat.name} id={user.id} type = "chats"/>
                    </ListItem>
                  ))
                }
              </List>
            </Collapse>
            </List>
        </Drawer>
        <main
            className={clsx(classes.content, {
            [classes.contentShift]: open,
            })}
        >
            <div className={classes.drawerHeader} />
            
        </main>
        </div>
    );
}

