import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default class Api {
  async login(payload) {
    try {
      const email = payload.email;

      const users = localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [];
      const user = users.find((user) => user.email === email);
      const firebaseUserEmail = doc(db, "users", email);

      if (!user && !firebaseUserEmail) {
        throw new Error("User is not registerd.");
      } else {
        const res = await signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    } catch (error) {
      if (error && error.code === "auth/user-not-found")
        throw new Error("User is not registerd.");
      if (error && error.code === "auth/wrong-password")
        throw new Error("Invalid credentials.");
      throw error;
    }
  }

  async regiser(payload) {
    try {
      const email = payload.email;

      const users = localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [];

      const firebaseUserEmail = doc(db, "users", email);

      const user = users.find((user) => user.email === email);
      if (user && firebaseUserEmail) {
        throw new Error("User already exists");
      } else {
        const res = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        await addDoc(collection(db, "users"), {
          uid: res.user.uid,
          payload,
        });
        await users.push({ id: res.user.uid, ...payload });
        localStorage.setItem("users", JSON.stringify(users));
      }
    } catch (error) {
      if (error && error.code === "auth/email-already-in-use")
        throw new Error("User already exists");
      throw error;
    }
  }

  async updateUser(id,snapId, payload) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const firebaseUserRef = doc(db, "users", snapId);
      console.log("payload", payload);
      // const res = await updateDoc(firebaseUserRef, { payload, uid: id });
      const res = await updateDoc(firebaseUserRef, { payload });
      console.log("updateRes", res);

      if (user && user.uid === id) {
        user.name = payload.name;
        user.dob = payload.dob;
        user.location = payload.location;
        user.email = payload.email;
        user.password = payload.password;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      if (error && error.code === "auth/user-not-found")
        throw new Error("User not found");
      if (error && error.code === "not-found")
        throw new Error("User not found");
      throw error;
    }
  }
}
