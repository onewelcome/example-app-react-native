// DialogProvider.tsx
import React, {useState} from 'react';
import DialogContext, {
  DialogContextType,
  DialogValueType,
} from './dialogContext';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

type DialogProviderProps = {
  children: React.ReactNode;
};

const DialogProvider: React.FC<DialogProviderProps> = ({children}) => {
  const [dialogContent, setDialogContent] = useState<DialogValueType | null>(
    null,
  );

  const showDialog: DialogContextType['showDialog'] = content => {
    setDialogContent(content);
  };

  const closeDialog: DialogContextType['closeDialog'] = () => {
    setDialogContent(null);
  };

  const dialog = dialogContent && (
    <Dialog visible={!!dialogContent}>
      <Dialog.Title>Could not start the SDK</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{dialogContent.message}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            dialogContent.onCloseDialog();
            closeDialog();
          }}>
          Try again
        </Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <DialogContext.Provider value={{showDialog, closeDialog}}>
      {dialog && <Portal>{dialog}</Portal>}
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
