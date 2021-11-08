import React from "react";
import styled from "styled-components";
import HomeMessage from "./Home__Message";
import HomeEntry from "./Home__Entry";
import HomeBanner from "./Home__Banner";
import CustomRoomModal from "../../Components/CustomRoomModal";
import { HeaderPageContainer } from "../../Styles/StyledComponents/StyledComponents";

export default function Home() {
    return (
        <>
            <Container>
                <HomeBanner background_image={true}/>
                <HomeMessage />
                <HomeEntry />
            </Container>
            <CustomRoomModal />
        </>
    );
}

const Container = styled(HeaderPageContainer)`
    display: flex;
    flex-direction: column;
    position: relative;
`;
