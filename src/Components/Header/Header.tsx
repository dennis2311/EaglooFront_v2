import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import HomeIcon from "./Header__HomeIcon";
import MiddleComponents from "./Header__MiddleComponents";
import HeaderAuth from "./Header__Auth";
import { headerLessPages } from "../../Constants";

export default function Header() {
    if (headerLessPages.includes(useLocation().pathname)) return null;
    return (
        <Container>
            <HomeIcon />
            <MiddleComponents />
            <HeaderAuth />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    gap: 180px;
    @media (max-width: ${(props) => props.theme.tabletWidth}) {
        gap: 50px;
    }
    position: absolute;
    top: 0;
    width: 100%;
    height: ${(props) => props.theme.headerHeight};
    justify-content: space-between;
    align-items: center;
    padding: 0 80px;
    padding-bottom: 20px;
`;
