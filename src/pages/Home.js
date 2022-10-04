import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../app/firebase";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Yup from "yup";
import { useToasts } from "react-toast-notifications";
import Api from "../app/api";
import { signOut } from "firebase/auth";

import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  // establish initial values
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [snapId, setSnapId] = useState(0);

  // using useEffect to avoid unnecessary rerenders
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  //fetching user details

  const fetchUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      onSnapshot(query(collection(db, "users")), (snapshot) => {
        snapshot.docs.map((doc) => setSnapId(doc.id));
      });

      const data = doc.docs[0]?.data();
      console.log("da", data);
      setCurrentUser(data?.payload);
    } catch (error) {
      console.error(error);
    }
  };

  // using addToast for displaying success and error popups
  const { addToast } = useToasts();
  const [editModal, setEditModal] = useState(false);
  // validating user form fields
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
    name: Yup.string().min(3, "Too short"),
    password: Yup.string()
      .min(6)
      .matches(/(?=.*[0-9])/, "Password must contain a number."),
  });
  // creating a  new instance of API
  const api = new Api();
  // setting up formik init values
  const formik = useFormik({
    initialValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      dob: currentUser?.dob,
      location: currentUser?.location,
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // validating user inpust before form submission
      try {
        values.email = values.email ? values.email : currentUser?.email;
        values.name = values.name ? values.name : currentUser?.name;
        values.dob = values.dob ? values.dob : currentUser?.dob;
        values.location = values.location
          ? values.location
          : currentUser?.location;
        values.password = values.password
          ? values.password
          : currentUser?.password;
// update user details
        await api.updateUser(user?.uid, snapId, values);
        addToast("Profile Updated.", {
          appearance: "success",
          autoDismiss: true,
        });
        // display updated user details
        await fetchUser();
        setEditModal(false);
      } catch (error) {
        addToast(error.toString(), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    },
  });
// navigate to login page using react routingggg
  let navigate = useNavigate();
  const routeChange = () => {
    let path = "/login";
    navigate(path);
  };
// handling logouts using firebase auth
  const logOut = async () => {
    await signOut(auth);
    console.log('signout successful');
    routeChange();
    addToast("logged Out Successfully", {
      appearance: "success",
  autoDismiss: true  });
  };
// rendering edit user form fields
  const renderEditModal = () => {
    return (
      <div
        className="fixed top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center 
        bg-black bg-opacity-50 overflow-y-scroll"
      >
        <form
          className="xl:ml-60 flex flex-col gap-11 px-10 lg:w-1/3 border-2 py-6 rounded-md bg-white"
          onSubmit={formik.handleSubmit}
        >
          <div className="inline-flex justify-between items-center">
            <h3 className="text-5xl">Edit {currentUser?.name}</h3>

            <h1
              className="text-4xl hover:cursor-pointer"
              onClick={() => setEditModal(false)}
            >
              &times;
            </h1>
          </div>
          <Input
            name="name"
            label="Name"
            placeholder="John Doe"
            value={formik.currentUser?.name}
            onChange={formik.handleChange}
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
          />
          <Input
            name="email"
            label="Email"
            value={formik.currentUser?.email}
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
            value={formik.currentUser?.dob}
            onChange={formik.handleChange}
            type="date"
          />
          <Input
            name="location"
            label="Location"
            placeholder="Glenwood, IL"
            value={formik.currentUser?.location}
            onChange={formik.handleChange}
          />
          <Button text="Update" />
        </form>
      </div>
    );
  };

  return (
    // rendering welcome screen with user details
    <div className="px-60">
      <h3 className="text-4xl mt-5">Welcome {currentUser?.name}</h3>

      <div className="flex flex-col gap-5 mt-10 mx-auto shadow-lg px-8 py-4 rounded-md w-fit">
        <h6 className="text-2xl font-bold ">Account Details</h6>
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-bold">Name: </span>
            {currentUser?.name}
          </p>
          <p>
            <span className="font-bold"> Date of Birth: </span>
            {currentUser?.dob}
          </p>
          <p>
            <span className="font-bold">Email: </span>
            {currentUser?.email}
          </p>
          <p>
            <span className="font-bold">Location: </span>{" "}
            {currentUser?.location}
          </p>
        </div>
        <Button
          text="Edit Account"
          onClick={() => setEditModal((prev) => !prev)}
        />
        <Button
          text="Sign Out"
          onClick={logOut}
        />
      </div>
{/* if editmodal is trueee rendereditmodal() */}
      {editModal && renderEditModal()}
    </div>
  );
}

export default Home;
