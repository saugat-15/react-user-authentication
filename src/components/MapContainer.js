import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFodWxyYWpkYWhhbCIsImEiOiJja2FjZjFleGMxZmxtMnptdDgzNzk3eXU3In0.0WUp5sKIkUHsfJLj662XTA";

const map = new mapboxgl.Map({
  container: "YOUR_CONTAINER_ELEMENT_ID",
  style: "mapbox://styles/mapbox/streets-v11",
});
