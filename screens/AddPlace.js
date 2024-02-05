import { ScrollView } from "react-native";
import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    await insertPlace(place);
    navigation.navigate("AllPlaces");
  }

  return (
    <ScrollView>
      <PlaceForm onCreatePlace={createPlaceHandler} />
    </ScrollView>
  );
}

export default AddPlace;
