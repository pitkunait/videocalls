import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage';
import Main from './pages/Main/Main';
import Room from './pages/Room/Room';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route exact path="/main" component={Main}/>
                <Route exact path="/room/:roomId" component={Room}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
