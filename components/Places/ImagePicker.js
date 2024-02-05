import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState();

  // Pick image from device
  async function takeImageHandler() {
    try {
      // Get permission status
      await requestCameraPermissionsAsync();

      let imageResult = await launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      // Accessing the first item in the assets array from the imageResult.
      const imageContent = imageResult.assets[0];

      // Setting the image URI if the operation wasn't cancelled and a URI exists.
      if (!imageContent.canceled && imageContent.uri) {
        setPickedImage(imageContent.uri);
        onTakeImage(imageContent.uri);
      } else {
        console.log("Image picking was cancelled or no URI found");
      }
    } catch (error) {
      Alert.alert("Error", "Could not take an image.");
    }
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
