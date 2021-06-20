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
        borderRadius: "25px",
        margin: "auto",
      }}
    >
      <Text>Select your workState :</Text>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNPickerSelect
          onValueChange={changeHandler}
          items={[
            { label: "OnCall", value: "OnCall" },
            { label: "OffCall", value: "OffCall" },
          ]}
        />
      </View>
    </View>
  );
}
