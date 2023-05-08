// dialogContext.tsx
import {createContext} from 'react';

export type DialogValueType = {
  title: String;
  message: String;
  onCloseDialog: () => void;
};

export type DialogContextType = {
  showDialog: (content: DialogValueType) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType>({
  showDialog: () => {},
  closeDialog: () => {},
});

export default DialogContext;
