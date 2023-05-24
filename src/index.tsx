import './index.css';

import LikeMinds from 'likeminds-chat-beta';

export const myClient = new LikeMinds({
  apiKey: process.env.CM_API_KEY!,
  xVersionCode: process.env.REACT_APP_LM_VERSION_CODE,
  xPlatformCode: process.env.REACT_APP_LM_PLATFORM_CODE
});
