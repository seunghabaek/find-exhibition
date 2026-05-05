import { useState } from "react";
import MapPage from "./pages/MapPage";
import DetailPage from "./pages/DetailPage";
import exhibitions from "./data/exhibitions.json";

type Exhibition = (typeof exhibitions)[number];
type Page = { name: "map" } | { name: "detail"; exhibition: Exhibition };

function App() {
  const [page, setPage] = useState<Page>({ name: "map" });

  if (page.name === "detail") {
    return (
      <DetailPage
        exhibition={page.exhibition}
        onBack={() => setPage({ name: "map" })}
      />
    );
  }

  return (
    <MapPage
      onSelectExhibition={(exhibition) =>
        setPage({ name: "detail", exhibition })
      }
    />
  );
}

export default App;
