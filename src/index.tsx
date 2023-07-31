import './index.css';
import LMChatClient from '@likeminds.community/chat-js';

export const myClient: LMChatClient = LMChatClient.setApiKey(process.env.CM_API_KEY!)
  .setPlatformCode(process.env.REACT_APP_LM_PLATFORM_CODE!)
  .setVersionCode(parseInt(process.env.REACT_APP_LM_VERSION_CODE!))
  .build();
