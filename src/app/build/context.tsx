"use client";

import { Content } from "@prismicio/client";
import { createContext, useContext, useMemo, useState } from "react";

type CustomizerControlsContext = {
  selectedWheel?: Content.BoardCustomizerDocumentDataWheelsItem;
  setWheel: (wheel: Content.BoardCustomizerDocumentDataWheelsItem) => void;
  selectedDeck?: Content.BoardCustomizerDocumentDataDecksItem;
  setDeck: (deck: Content.BoardCustomizerDocumentDataDecksItem) => void;
  selectedTruck?: Content.BoardCustomizerDocumentDataMetalsItem;
  setTruck: (truck: Content.BoardCustomizerDocumentDataMetalsItem) => void;
  selectedBolt?: Content.BoardCustomizerDocumentDataMetalsItem;
  setBolt: (bolt: Content.BoardCustomizerDocumentDataMetalsItem) => void;
};

const defaultContext: CustomizerControlsContext = {
  setWheel: () => {},
  setDeck: () => {},
  setTruck: () => {},
  setBolt: () => {},
};

const CustomizerContolsContext = createContext(defaultContext);

type CustomizerControlsProviderProps = {
  defaultWheel?: Content.BoardCustomizerDocumentDataWheelsItem;
  defaultDeck?: Content.BoardCustomizerDocumentDataDecksItem;
  defaultTruck?: Content.BoardCustomizerDocumentDataMetalsItem;
  defaultBolt?: Content.BoardCustomizerDocumentDataMetalsItem;
  children?: React.ReactNode;
};

export function CustomizerControlsProvider({
  defaultWheel,
  defaultDeck,
  defaultTruck,
  defaultBolt,
  children,
}: CustomizerControlsProviderProps) {
  const [selectedWheel, setWheel] = useState(defaultWheel);
  const [selectedDeck, setDeck] = useState(defaultDeck);
  const [selectedTruck, setTruck] = useState(defaultTruck);
  const [selectedBolt, setBolt] = useState(defaultBolt);

  const value = useMemo<CustomizerControlsContext>(() => {
    return {
      selectedWheel,
      setWheel,
      selectedDeck,
      setDeck,
      selectedTruck,
      setTruck,
      selectedBolt,
      setBolt,
    };
  }, [selectedWheel, selectedDeck, selectedTruck, selectedBolt]);

  return (
    <CustomizerContolsContext.Provider value={value}>
      {children}
    </CustomizerContolsContext.Provider>
  );
}

export function useCustomizerControls() {
  return useContext(CustomizerContolsContext);
}
