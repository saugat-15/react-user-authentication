import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Yup from "yup";
import { routes } from "../utils/routes";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Api from "../app/api";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
} from "react-map-gl";
import { signOut } from "firebase/auth";

function Signup() {
  const api = new Api();
  const { addToast } = useToasts();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    name: Yup.string().required("Required").min(3, "Too short"),
    password: Yup.string()
      .min(6)
      .matches(/(?=.*[0-9])/, "Password must contain a number.")
      .required("Required"),
  });
  const [latitude, setLatitude] = useState(-15.14);
  const [longitude, setLongitude] = useState(35.36);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      dob: "",
      location: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.regiser(values);
        addToast("Signup Successful.", {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(routes.login);
      } catch (error) {
        addToast(error.toString(), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    },
  });
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [viewport, setViewport] = useState({
    // initial viewport setup for map display
    latitude: latitude,
    longitude: longitude,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100vh",
  });


  const handleSignOut = async () => {
    signOut(auth);
    routeChange();
    addToast()
  }

  useEffect(() => {
    setViewport({
      latitude: latitude,
      longitude: longitude,
      zoom: 12,
      width: "100%",
      height: "100vh",
    });
  }, [latitude, longitude]);
  const [geoJson, setGeoJson] = useState();

  const handleLocationOnChange = async (e) => {
    const { value } = e.target;
    console.log("va", value);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoicmFodWxyYWpkYWhhbCIsImEiOiJjbDR4NTEydHkxbHVzM21tbHNnZXhlMWJiIn0.k-JmsWsELRPm0MAWsfhh2A`
      );
      const data = await response.json();
      setGeoJson(data);
      let temp = [];
      data.features.map((item) => {
        temp.push(item);
      });
      setSuggestions(temp);
      formik.values.location = value;
      console.log("data", temp);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleSuggestionsOnClick = (location) => {
    const lat = location.center[1];
    const long = location.center[0];

    formik.values.location = location.place_name;
    setLatitude(lat);
    setLongitude(long);
  };

  console.log("location", formik.values.location);

  const mapRef = React.useRef();

  return (
    <div className="w-full h-screen md:flex">
      <form
        className="xl:ml-60 flex flex-col gap-11 px-10 lg:w-1/3 border-2 py-6 rounded-md"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-5xl">Signup</h3>
        <Input
          name="name"
          label="Name"
          placeholder="John Doe"
          onChange={formik.handleChange}
          error={
            formik.touched.name && formik.errors.name ? formik.errors.name : ""
          }
        />
        <Input
          name="email"
          label="Email"
          placeholder="john@doe.com"
          onChange={formik.handleChange}
          type="email"
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""
          }
        />
        <Input
          name="password"
          label="Password"
          placeholder="********"
          onChange={formik.handleChange}
          type="password"
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
        />
        <Input
          name="dob"
          label="Date of Birth"
          onChange={formik.handleChange}
          type="date"
        />
        <div className="flex flex-col">
          <Input
            name="location"
            label="Location"
            placeholder="Melbourne, VIC"
            onChange={handleLocationOnChange}
            value={formik.values.location}
          />

          {suggestions?.map((item) => (
            <div key={item.id}
              onClick={() => handleSuggestionsOnClick(item)}
              className="cursor-pointer">
              {item.place_name}
            </div>
          ))}
        </div>

        <Button text="Signup" />

        <div className="flex items-center gap-0">
          <p>Already Have an Account?</p>
          <Button
            text="Login"
            type="text"
            customClass="w-auto"
            onClick={() => navigate(routes.login)}
          />
        </div>
      </form>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 3.5,
        }}
        style={{ width: "50%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoicmFodWxyYWpkYWhhbCIsImEiOiJjbDR4NTEydHkxbHVzM21tbHNnZXhlMWJiIn0.k-JmsWsELRPm0MAWsfhh2A"
        {...viewport}
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <img src="../public/logo192.png" alt="marker" />
        </Marker>
      </Map>
    </div>
  );
}

export default Signup;
