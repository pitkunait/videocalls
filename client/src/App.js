import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';


import LandingPage from "./pages/LandingPage/LandingPage";
import Main from './pages/Main/Main';
import Room from './pages/Room/Room';
import Container from "./common/Container";

function App() {
    return (
        <BrowserRouter>
            <AppContainer>
                <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route exact path="/main" component={Main}/>
                    <Route exact path="/room/:roomId" component={Room}/>
                </Switch>
            </AppContainer>
        </BrowserRouter>
    );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: #2e1b68;
  background-color: #ebeef3;
  text-align: center;
`;

export default App;
