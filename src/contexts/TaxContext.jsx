import { createContext, useContext, useState } from "react";

const TaxContext = createContext();

export const TaxProvider = ({ children }) => {
  const [taxes, setTaxes] = useState({
    gstRate: 18,
    platformFee: 10,
    tdsRate: 5,
  });

  return (
    <TaxContext.Provider value={{ taxes, setTaxes }}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTaxContext = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error("useTaxContext must be used within a TaxProvider");
  }
  return context;
};
