import React, { useState } from "react";
import FeedContextProvider from "../feedContext";
import Feeds from "./feed";


export const FeedWrapper: React.FC = () => {
    return (
        <FeedContextProvider>
            <Feeds/>
        </FeedContextProvider>
    )
}
