import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { observer } from "mobx-react";

import BottomSheet from "@gorhom/bottom-sheet";

import userStateStore from "../store/UserStateStore";

const BottomSheetContainer = observer(props => {
  // variables
  const snapPoints = useMemo(() => ["20%"], []);

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log("handleSheetChanges", index);
  }, []);

  // close button
  const closeButton = p => (
    <IconButton {...p} icon='close' size={25} onPress={props.onDismiss} />
  );

  // renders
  return (
    <BottomSheet
      style={styles.sheet}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      ref={props.sheetRef}
    >
      {userStateStore.destinationData && (
        <Card style={styles.container}>
          <Card.Content>
            <Card.Title
              title={`${userStateStore.destinationData.name}`}
              subtitle={`${userStateStore.destinationData.address}`}
              right={closeButton}
            />
            <Card.Actions>
              {userStateStore.destinationStatus ===
                userStateStore.destinationStatusOptions.FOUND && (
                <Button
                  style={styles.mapWalkButton}
                  onPress={() => {
                    userStateStore.setDestinationStatus(
                      userStateStore.destinationStatusOptions.ROUTED
                    );
                  }}
                >
                  Map My Walk
                </Button>
              )}
              {userStateStore.destinationStatus ===
                userStateStore.destinationStatusOptions.ROUTED && (
                <Button style={styles.mapWalkButton}>Take Me There</Button>
              )}
            </Card.Actions>
          </Card.Content>
        </Card>
      )}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    width: "100%",
    elevation: 0
  },
  contentContainer: {
    flex: 1,
    alignItems: "center"
  }
});

export default BottomSheetContainer;
