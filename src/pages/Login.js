import { useFormik } from "formik";
import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import { useToasts } from "react-toast-notifications";
import Api from "../app/api";

function Login() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });
  const api = new Api();
  const { addToast } = useToasts();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.login(values);
        addToast("Login Successful.", {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(routes.home);
      } catch (error) {
        addToast(error.toString(), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    },
  });

  return (
    <div className="w-full h-screen md:flex md:justify-center items-center">
      <form
        className="xl:ml-60 flex flex-col gap-11 px-10 lg:w-1/3 border-2 py-6 rounded-md"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-5xl">Login</h3>

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

        <Button text="Login" />

        <div className="flex items-center gap-0">
          <p>Don't Have an Account?</p>
          <Button
            text="Signup"
            type="text"
            customClass="w-auto"
            onClick={() => navigate(routes.signup)}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
