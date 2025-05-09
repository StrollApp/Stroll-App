import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { observer } from "mobx-react";
import BottomSheet from "@gorhom/bottom-sheet";

import userStateStore from "../store/UserStateStore";

const BottomSheetContainer = observer(props => {
  // variables
  const snapPoints = useMemo(() => [180], []);
  const [generatingRoute, setGeneratingRoute] = useState(false);

  // close button
  const closeButton = p => (
    <IconButton
      {...p}
      icon='close'
      size={25}
      onPress={() => {
        setGeneratingRoute(false);
        props.onDismiss();
      }}
    />
  );

  // renders
  return (
    <BottomSheet
      style={styles.sheet}
      index={-1}
      snapPoints={snapPoints}
      ref={props.sheetRef}
    >
      {
        <Card style={styles.container}>
          <Card.Content>
            <Card.Title
              title={`${
                userStateStore.destinationData === null
                  ? "Once you pick a destination,"
                  : userStateStore.destinationData.name
              }`}
              subtitle={`${
                userStateStore.destinationData === null
                  ? "this card will contain its information!"
                  : userStateStore.destinationData.address
              }`}
              right={closeButton}
            />
            <Card.Actions>
              {userStateStore.destinationStatus ===
                userStateStore.destinationStatusOptions.FOUND && (
                <Button
                  style={styles.mapWalkButton}
                  loading={generatingRoute}
                  disabled={generatingRoute}
                  onPress={async () => {
                    setGeneratingRoute(true);
                    await props.onGenerateWalk();
                    setGeneratingRoute(false);
                  }}
                >
                  Map My Walk
                </Button>
              )}
              {userStateStore.destinationStatus ===
                userStateStore.destinationStatusOptions.ROUTED && (
                <Button
                  style={styles.mapWalkButton}
                  onPress={props.onOpenRoute}
                >
                  Show Directions
                </Button>
              )}
            </Card.Actions>
          </Card.Content>
        </Card>
      }
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
