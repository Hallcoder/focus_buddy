import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../components/input";
import { addBlockedUrl, updateBlockedUrl } from "../utils/firebaseFunctions";
import toast from "react-hot-toast";

function AddOrUpdateUrl() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingUrl = typeof location.state?.existingUrl === "string" ? location.state.existingUrl : "";

  console.log("Existing URL:", existingUrl);

  const handleFormSubmit = async (
    values: { newUrl: string },
    { resetForm, setSubmitting, setStatus }: any
  ) => {
    try {
      if (!values.newUrl || typeof values.newUrl !== "string") {
        throw new Error("Invalid URL format or empty URL.");
      }

      if (existingUrl) {
        // Update the existing URL
        await updateBlockedUrl(existingUrl, values.newUrl);
        toast.success("URL updated successfully!");
      } else {
        // Add a new URL
        await addBlockedUrl(values.newUrl);
        toast.success("URL added successfully!");
      }

      resetForm();
      navigate(-1);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred, please try again.";
      toast.error(errorMessage);
      setStatus({ error: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Enhanced validation schema
  const validationSchema = Yup.object().shape({
    newUrl: Yup.string()
      .url("Invalid URL format. Please ensure it includes 'http://' or 'https://'.")
      .required("URL is required"),
  });

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        onClick={() => {
          try {
            navigate(-1);
          } catch (err: any) {
            console.error("Navigation error:", err.message);
            toast.error("Failed to navigate back.");
          }
        }}
        className="self-start mb-4 text-primary hover:text-primary"
      >
        ← Back
      </button>

      <h2 className="font-semibold text-2xl mb-4">
        {existingUrl ? "Update URL 🌐" : "Add a new URL 🌐"}
      </h2>

      <Formik
        initialValues={{ newUrl: existingUrl }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <Form className="w-full max-w-md">
            <CustomInput
              name="newUrl"
              label="New URL 🌐"
              type="text"
              placeholder="Enter URL..."
              onChange={handleChange}
              value={values.newUrl}
              required
            />

            {/* Show error message below the input field if URL is invalid */}
            {errors.newUrl && touched.newUrl && (
              <div className="text-red-500 text-sm mt-2">
                {errors.newUrl}
              </div>
            )}

            <button
              type="submit"
              className={`p-2 mt-4 w-full rounded-md text-white bg-primary hover:bg-primary ${isSubmitting || errors.newUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || !!errors.newUrl} // Disable submit if errors exist
            >
              {isSubmitting
                ? existingUrl
                  ? "Updating..."
                  : "Adding..."
                : existingUrl
                ? "Update URL"
                : "Add URL"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddOrUpdateUrl;
