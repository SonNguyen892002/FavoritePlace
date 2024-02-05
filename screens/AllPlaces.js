import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import PlaceList from "../components/Places/PlaceList";
import { fetchPlaces } from "../util/database";

function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }

    if (isFocused) {
      loadPlaces();
      // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place]);
    }
  }, [isFocused]);

  return <PlaceList places={loadedPlaces} />;
}

export default AllPlaces;
