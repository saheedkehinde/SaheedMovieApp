import React from "react";
import MovieApp from "./Components/MovieApp";

// Main App component that renders the MovieApp component
// This is the entry point of the application
// It imports the MovieApp component and renders it within the App component
// The App component is then exported for use in the main entry file (main.jsx)
function App() {
  return (
    <>
      <MovieApp />
      
    </>
  );
}

export default App;