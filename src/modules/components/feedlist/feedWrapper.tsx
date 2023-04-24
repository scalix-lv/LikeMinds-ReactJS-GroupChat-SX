import React, { useState } from "react";
import FeedContextProvider from "../../contexts/feedContext";
import Feeds from "./Feed";


export const FeedWrapper: React.FC = () => {
    return (
        <FeedContextProvider>
            <Feeds/>
        </FeedContextProvider>
    )
}
