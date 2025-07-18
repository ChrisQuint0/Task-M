// app/page.tsx

//The code is heavily commented so that I'll understand every bit of it.
// Christopher Quinto <cquinto.primary@gmail.com>

"use client"; //Tells Next.js that this page should be rendered on the client side, not the server

import { supabase } from "@/lib/supabase"; //Initialized client(like an SDK) to interact with the supabase backend.
import { useEffect, useState } from "react";

/*
   useEffect - react hook that runs after the component mounts - great for fetching data
   useState - stores values (loading, data, error) that React tracks and re-renders when they change.
*/

export default function Home() {
  //The default export the main component rendered

  const [firstRow, setFirstRow] = useState<any>(null); //Stores the first row of data from the test table

  const [loading, setLoading] = useState(true); //Shows whether it's still waiting for the data

  const [error, setError] = useState<string | null>(null); //Stores any error messages if something goes wrong

  useEffect(() => {
    //Runs once on page load (Empty dependency data [])

    async function fetchData() {
      try {
        setLoading(true); //Ensures that the loading text is shown

        const { data, error } = await supabase.from("test").select("*");

        /* .from("test") - selects the test table
           .select("*") - selects all columns
           await - waits for the response
           data - an array of rows
           error - an object if something goes wrong
        */

        if (error) {
          //If error exists it is logged and the error message is saved to state
          console.error("Supabase error: ", error);

          setError(`${error.message} (Code: ${error.code})`);
        } else {
          //If successful firstRow is set to the first item in the data array
          setFirstRow(data[0]);
        }
      } catch (err) {
        //If there's any error, it's caught and stored
        console.error("Fetch error:", err);

        setError("Failed to fetch data");
      } finally {
        //Ensures loading is false no matter what
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //Displays if loading is true
  if (loading) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">TaskM Home</h1>
        <p>Loading first row...</p>
      </main>
    );
  }

  //Displays if loading is false
  if (error) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">TaskM Home</h1>
        <div className="p-4 border rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">TaskM Home</h1>
      {firstRow ? (
        <div className="p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <p>
            <strong>ID:</strong> {firstRow.id}
          </p>
          <p>
            <strong>Timestamp:</strong> {firstRow.created_at}
          </p>
        </div>
      ) : (
        <div className="p-4 border rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">
          <p>No data found in the 'test' table</p>
        </div>
      )}
    </main>
  );
}
