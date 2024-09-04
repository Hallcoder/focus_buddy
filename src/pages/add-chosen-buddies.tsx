import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/input"; // Assuming CustomInput is in the right path
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { fetchUserByEmail } from "../utils/firebaseFunctions";

function AddChosenBuddies() {
  const navigate = useNavigate();

  const handleAddBuddy = async (
    values: { buddyEmail: string },
    { resetForm }: any
  ) => {
    const buddyEmail = values.buddyEmail.trim();
    const user = auth.currentUser;

    if (!user) {
      toast.error("No authenticated user found.");
      navigate("/login");
    }

    try {
      // Get the user's document reference
      const userDocRef = doc(db, "users", user!.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const currentBuddies = userData.moderators || [];
        const buddyData  = await fetchUserByEmail(buddyEmail);
        console.log("Buddydata", buddyData);
        if(!buddyData){
          throw new Error("User with that email does not exist!");
        }
        // Add the new buddy email if it's not already in the list
        if (!currentBuddies.includes(buddyEmail)) {
          const updatedBuddies = [...currentBuddies, buddyEmail];
          await updateDoc(userDocRef, { moderators: updatedBuddies });

          toast.success("Buddy added successfully!");
          resetForm();
        } else if(buddyEmail == userData.email){
           throw new Error("You can't be your own Buddy, that's cheating😂!")
        }
        else {
          throw new Error("This buddy is already in your list.");
        }
      } else {
        throw new Error("User document not found.");
      }
    } catch (error: any) {
      toast.error(`Error adding buddy: ${error.message}`);
    }
  };

  const validationSchema = Yup.object({
    buddyEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="self-start mb-4 text-primary hover:text-primary"
      >
        ← Back
      </button>
      <h2 className="font-semibold text-2xl mb-4">Add a Buddy ✌️</h2>
      <Formik
        initialValues={{ buddyEmail: "" }}
        validationSchema={validationSchema}
        onSubmit={handleAddBuddy}
      >
        {({ isSubmitting,handleChange }) => (
          <Form className="w-full max-w-md">
            <CustomInput
              name="buddyEmail"
              label="Buddy ✌️"
              type="email"
              onChange={handleChange}
              placeholder="Enter buddy's email"
            />
            <button
              type="submit"
              className="p-2 mt-4 w-full rounded-md text-white bg-primary hover:bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Buddy"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddChosenBuddies;
