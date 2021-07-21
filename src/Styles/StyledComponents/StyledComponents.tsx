import React, { ReactElement } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const FadeIn = keyframes`
    from{
        opacity: 0
    }
    to {
        opacity: 1
    }
`;

export const SlideUp = keyframes`
    from{
        transform:translateY(1200px);
    }
    to {
transform:translateY(0px);
    }
`;

export const FullScreenContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const PageContainer = styled.div`
    display: flex;
    width: 80%;
    height: 100%;
`;

export const FullPageContainer = styled(PageContainer)`
    animation: ${FadeIn} 0.5s ease-out;
`;

export const SlideUpPageContainer = styled(PageContainer)`
    /* animation: ${SlideUp} 0.5s ease-out; */
    animation: ${FadeIn} 0.5s ease-out;
    ${(props) => `height: calc(100% - ${props.theme.headerHeight});`};
    background: white;
    padding: 35px;
    margin-top: ${(props) => props.theme.headerHeight};
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
`;

export const HeaderPageContainer = styled(PageContainer)`
    animation: ${FadeIn} 0.5s ease-out;
    margin-top: ${(props) => props.theme.headerHeight};
`;

export const StylelessButton = styled.button`
    border: none;
    outline: none;
    color: inherit;
    background-color: inherit;
    font-size: inherit;
    font-family: inherit;
    &:hover {
        cursor: pointer;
    }
`;

interface LinkProps {
    to: string;
    children?: string | ReactElement;
}

export function StylelessLink({ to, children }: LinkProps) {
    return (
        <Link style={{ color: "inherit", textDecoration: "none" }} to={to}>
            {children}
        </Link>
    );
}

export function toastLoginSuccessMessage(email: string) {
    toast(
        `<div>
            <span role="img" aria-label="smile-face">
                😀
            </span>
            &nbsp; 어서오세요 {email}님!
            <br />
            &emsp; 오늘도 이글루와 공부해 볼까요?
        </div>`,
        { pauseOnHover: false }
    );
}

export function toastErrorMessage(message: string) {
    toast.error(`😥 ${message}`);
}

export function servicePreparingMessage() {
    toast.warn("😥 서비스 준비 중입니다");
}
