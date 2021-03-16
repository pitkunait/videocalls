import React from 'react';

import IntroContent from "../../contentent/IntroContent.json";
import LeftContentBlock from "../../components/LeftContentBlock";
import Container from "../../components/Container";

const LandingPage = () => {
    return (
        <Container>
            <LeftContentBlock
                first="true"
                title={IntroContent.title}
                content={IntroContent.text}
                icon="developer.svg"
                id="intro"
            />
        </Container>
    );
};

export default LandingPage;
