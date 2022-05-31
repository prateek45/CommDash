import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from './Chat'
import { useStateValue } from './StateProvider';
import Login from './Login';
import Browse from './components/Browse';
import SocialNetwork from './components/SocialNetwork.js';

function App() {
  const [{ user }] = useStateValue();

  return (
    <div className="app">
      <Router>
        {!user ? (
          <Login />
        ) : (
            <>
              <div className="app__body">
                <Sidebar />
                <Switch>
                  <Route path="/room/:type/:title/:roomId">
                    <Chat />
                  </Route>
                  <Route path= '/Announcements/:user_id'>
                    <h1 style={{marginTop: 18+ 'vh'}}>Welcome {user.name}</h1>
                  </Route>

                  <Route path="/Groups">
                    <Browse />
                  </Route>

                  <Route path="/People">
                    <SocialNetwork />
                  </Route>
                  
                </Switch>
              </div>
            </>
          )} 
      </Router>
    </div>
  );
}

export default App;
