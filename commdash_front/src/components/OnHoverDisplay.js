import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import axios from '../axios'; 
import { useStateValue } from '../StateProvider';
import grey from '@material-ui/core/colors/grey';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
    },
    node:{
        height: 30,
        width: 150,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: grey[900],
        borderRadius: 5,
        textAlign: 'center',
        background: grey[50],
    },
    button:{
        pointer: '',
        zIndex: 999,
        borderStyle: 'solid',
        borderColor: blue[500],
    },
    root: {
        maxWidth: 345,
      },
      media: {
        height: 140,
      },
  }));

function OnHoverDisplay({ data }) {
    const classes = useStyles();
    const [{ user }, dispatch] = useStateValue();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    const addPeople = () => {
        axios.post(`/add/people?id=${user.id}`, {
            id: data.keys,
            name: data.value['firstName'],
            relation: {name: 'Colleague'},
        })
      };

      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;

    return (
        <div className = {classes.node}>
            <Handle type="target" position={Position.Top} />
            <Typography aria-describedby={id} color="primary" onClick={handleClick}>
                {data.value['firstName']}
            </Typography>
            <Popover
                id={id}
                classes={{
                paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
            >
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={data.value['userImage']}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {data.value['firstName']} {data.value['lastName']}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h3">
                            Email: {data.value['email']}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h3">
                            Designation: {data.value['profession']}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button className = {classes.button}size="small" color="primary" onClick={addPeople}>
                        Chat
                        </Button>
                    </CardActions>
                </Card>
            </Popover>
            <Handle type="source" position={Position.Bottom} id="b" />
        </div>
    );
}

export default OnHoverDisplay;
