import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/input"; // Assuming CustomInput is in the right path

function AddBlackListedUrls() {
  const navigate = useNavigate();

  const handleAddUrl = (values: { buddyEmail: string }, { resetForm }: any) => {
    console.log("Buddy Email:", values.buddyEmail);

    // Here you would add the logic to store the buddy email in a list
    // chosenBuddiesList.push(values.buddyEmail);

    // Reset form after submission
    resetForm();
  };

  const validationSchema = Yup.object({
    buddyEmail: Yup.string().email("Invalid email address").required("Email is required"),
  });

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="self-start mb-4 text-primary hover:text-primary"
      >
        ← Back
      </button>
      <h2 className="font-semibold text-2xl mb-4">Add a new url 🌐</h2>
      <Formik
        initialValues={{ buddyEmail: "" }}
        validationSchema={validationSchema}
        onSubmit={handleAddUrl}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md">
            <CustomInput
              name="url"
              label="New url 🌐"
              type="text"
              placeholder="Enter new url..."
            />
            <button
              type="submit"
              className="p-2 mt-4 w-full rounded-md text-white bg-primary hover:bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Url"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddBlackListedUrls;
