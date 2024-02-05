import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function LocationPicker({ onPickLocation }) {
  const [address, setAddress] = useState();
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();

  // Get address on map
  useEffect(() => {
    if (isFocused && route.params) {
      const reverseGeocode = async () => {
        const reverseGeocodedAddress = await reverseGeocodeAsync({
          latitude: route.params.pickedLat,
          longitude: route.params.pickedLng,
        });
        setAddress(reverseGeocodedAddress[0].formattedAddress);
      };
      reverseGeocode();
    }
  }, [route, isFocused]);

  useEffect(() => {
    if (address && route.params) {
      const pickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      onPickLocation({ ...pickedLocation, address: address });
    }
  }, [address, onPickLocation]);

  async function getLocationHandler() {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Please grant location permissions");
      return;
    }

    const location = await getCurrentPositionAsync();
    const reverseGeocodedAddress = await reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const curAddress = reverseGeocodedAddress[0].formattedAddress;
    onPickLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      address: curAddress,
    });
    setAddress(curAddress);
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (address) {
    locationPreview = <Text>{address}</Text>;
  }

  console.log(address);

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    // borderRadius: 4
  },
});
