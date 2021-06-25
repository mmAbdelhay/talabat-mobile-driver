import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { Text, View } from "react-native";

export default function WorkState(props) {
  const changeHandler = (value) => {
    props.workState(value);
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: "70%",
        backgroundColor: "#007cff",

        margin: "auto",
      }}
    >
    <Text>Select your workState :</Text>

    <RNPickerSelect
        onValueChange={changeHandler}
        items={[
          { label: "OffCall", value: "OffCall" },
          { label: "Break", value: "Break" },
          { label: "OnCall", value: "OnCall" },
        ]}
    />

    </View>
  );
}
