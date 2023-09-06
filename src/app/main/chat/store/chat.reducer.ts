import { Chat, ChatParent } from '../chat.model';
import * as ChatActions from './chat.actions';

export interface state {
  chatList: ChatParent[];
  chats: Chat[];
  expanded: boolean;
  isInActualChat: boolean;
  chatRecipientId: string;
  chatRecipientName: string;
  error: string;
}

const initialState = {
  chatList: [],
  chats: [],
  expanded: false,
  isInActualChat: false,
  chatRecipientId: null,
  chatRecipientName: null,
  error: null,
};

export function chatReducer(
  state: state = initialState,
  action: ChatActions.ChatActions
) {
  switch (action.type) {
    case ChatActions.LOAD_CHAT_LIST:
      return { ...state, chatList: action.payload.chatList };
    case ChatActions.ERROR_GETTING_LIST:
      return { ...state, error: action.error };
    case ChatActions.ERROR_SENDING_MESSSAGE:
      return { ...state, error: action.error };
    case ChatActions.ERROR_GETTING_ACTUAL_CHAT:
      return { ...state, error: action.error };
    case ChatActions.LOAD_ACTUAL_CHAT:
      return {
        ...state,
        chats: action.payload.actualChat,
        isInActualChat: true,
        expanded: true,
      };
    case ChatActions.OPEN_CHATUI:
      return { ...state, expanded: true };
    case ChatActions.MINIMIZE_CHAT:
      return { ...state, expanded: false };
    case ChatActions.GO_BACK:
      return { ...state, isInActualChat: false };
    case ChatActions.CONVERSATION_OPEN_INITIATED:
      return {
        ...state,

        chatRecipientName: action.payload.name,
        chatRecipientId: action.payload.id,
      };
    case ChatActions.UPDATE_CURRENT_CHAT:
      const newChat = action.payload.chat;
      return { ...state, chats: [...state.chats, newChat] };
    default:
      return state;
  }
}
