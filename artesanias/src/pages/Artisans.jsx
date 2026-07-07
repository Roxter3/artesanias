import ArtisanGrid from "../components/ArtisanGrid";
import Navbar      from "../components/Navbar";
import "../styles/navbar.css";

function Artisans() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px" }}>
        <ArtisanGrid />
      </div>
    </>
  );
}

export default Artisans;