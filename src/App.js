import React from "react";
import TaxForm from "./components/TaxForm";
import { Items } from "./services/ItemsApi";



const App = () => {
  return (
  <>
      <TaxForm items={Items} />
  </>
 
  );
};

export default App;
