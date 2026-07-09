import React from "react";
import "./embed.css";
import App from "../App";

export default function SemanticDataCatalogEmbed({ webId, language }) {
  return <App embedded webIdOverride={webId} language={language} />;
}
