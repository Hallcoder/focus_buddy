import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/input"; // Assuming CustomInput is in the right path
import { addBlockedUrl } from "../utils/firebaseFunctions"; // Import the function to add URL to Firebase

function AddBlackListedUrls() {
  const navigate = useNavigate();

  const handleAddUrl = async (
    values: { newUrl: string },
    { resetForm, setSubmitting, setStatus }: any
  ) => {
    console.log("Add URL function triggered with values:", values); // Log form values

    try {
      await addBlockedUrl(values.newUrl);
      console.log("New URL added successfully:", values.newUrl);

      resetForm();
      setStatus({ success: "URL added successfully!" });
    } catch (error:any) {
      console.error("Error adding URL:", error.message);
      setStatus({ error: error.message });
    } finally {
      setSubmitting(false);
      console.log("Form submission complete");
    }
  };

  const validationSchema = Yup.object({
    newUrl: Yup.string().url("Invalid URL format").required("URL is required"),
  });

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="self-start mb-4 text-primary hover:text-primary"
      >
        ← Back
      </button>
      <h2 className="font-semibold text-2xl mb-4">Add a new URL 🌐</h2>
      <Formik
        initialValues={{ newUrl: "" }}
        validationSchema={validationSchema}
        onSubmit={handleAddUrl}
      >
        {({ isSubmitting, handleChange, status }) => (
          <Form className="w-full max-w-md">
            <CustomInput
              name="newUrl"
              label="New URL 🌐"
              type="text"
              placeholder="Enter new URL..."
              onChange={handleChange}
            />
            {status?.error && (
              <div className="text-red-500 text-sm mt-2">{status.error}</div>
            )}
            {status?.success && (
              <div className="text-green-500 text-sm mt-2">
                {status.success}
              </div>
            )}
            <button
              type="submit"
              className="p-2 mt-4 w-full rounded-md text-white bg-primary hover:bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add URL"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddBlackListedUrls;
