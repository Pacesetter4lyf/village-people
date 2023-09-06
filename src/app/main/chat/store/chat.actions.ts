import { Action } from '@ngrx/store';
import { Chat, ChatParent } from '../chat.model';

export const GET_CHAT_LIST = '[chat] Get Chat List';
export const LOAD_CHAT_LIST = '[chat] Load List';
export const ERROR_GETTING_LIST = '[chat] Error Getting List';
export const GET_ACTUAL_CHAT = '[chat] Get Actual Chat';
export const LOAD_ACTUAL_CHAT = '[chat] Load Actual Chat';
export const ERROR_GETTING_ACTUAL_CHAT = '[chat] Error Getting Actual Chat';
export const OPEN_CHATUI = '[chat] Open ChatUi';
export const MINIMIZE_CHAT = '[chat] Minimize';
export const GO_BACK = '[chat] Go Back';
export const SEND_MESSAGE = '[chat] Send Message';
export const CONVERSATION_OPEN_INITIATED = '[chat] Conversation Open Initiated';
export const UPDATE_CURRENT_CHAT = '[chat] Update Current Chat';
export const ERROR_SENDING_MESSSAGE = '[chat] Error Sending Message';

export class GetChatList implements Action {
  readonly type = GET_CHAT_LIST;
  constructor() {}
}

export class LoadChatList implements Action {
  readonly type = LOAD_CHAT_LIST;
  constructor(public payload: { chatList: ChatParent[] }) {}
}

export class OpenChatUi implements Action {
  readonly type = OPEN_CHATUI;
  constructor() {}
}
export class ErrorGettingList implements Action {
  readonly type = ERROR_GETTING_LIST;
  constructor(public error: string) {}
}
export class ErrorSendingMessage implements Action {
  readonly type = ERROR_SENDING_MESSSAGE;
  constructor(public error: string) {}
}

export class GetActualChat implements Action {
  readonly type = GET_ACTUAL_CHAT;
  constructor(public payload: { id: string }) {}
}

export class LoadActualChat implements Action {
  readonly type = LOAD_ACTUAL_CHAT;
  constructor(public payload: { actualChat: Chat[] }) {}
}
export class ErrorGettingActualChat implements Action {
  readonly type = ERROR_GETTING_ACTUAL_CHAT;
  constructor(public error: string) {}
}
export class MinimizeChat implements Action {
  readonly type = MINIMIZE_CHAT;
  constructor() {}
}
export class GoBack implements Action {
  readonly type = GO_BACK;
  constructor() {}
}
export class ConversationOpenInitiated implements Action {
  readonly type = CONVERSATION_OPEN_INITIATED;
  constructor(public payload: { name: string; id: string }) {}
}
export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;
  constructor(public payload: { to: string; message: string }) {}
}
export class UpdateCurrentChat implements Action {
  readonly type = UPDATE_CURRENT_CHAT;
  constructor(public payload: { chat: Chat }) {}
}
export type ChatActions =
  | GetChatList
  | OpenChatUi
  | LoadChatList
  | ErrorGettingList
  | GetActualChat
  | LoadActualChat
  | ErrorGettingActualChat
  | MinimizeChat
  | GoBack
  | SendMessage
  | ConversationOpenInitiated
  | UpdateCurrentChat
  | ErrorSendingMessage;
