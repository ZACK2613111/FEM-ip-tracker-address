import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg.png";

import MarkerPosition from "./Components/MarkerPosition";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_kICz2RqXhIyxCmMd6wkDyhbTr6Mpq&ipAddress=5.50.5.5`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);



  const getEnteredData = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_kICz2RqXhIyxCmMd6wkDyhbTr6Mpq&${checkIpAddress.test(ipAddress)
        ? `ipAddress=${ipAddress}`
        : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredData();
    setIpAddress("");
  };

  return (
    <>
      <section>
        <div>
          <img
            src={background}
            alt=""
            className="absolute -z-10 w-full object-cover h-80"
          />
        </div>
        <article>
          <h1 className="text-white text-center text-2xl font-bold p-5 lg:text-3xl ">
            IP Address Tracker
          </h1>
          <form
            className="flex justify-center max-w-xl mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP Address or domain"
              required
              className="py-2 px-4 rounded-l-lg w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-6 px-4 rounded-r-lg hover:opacity-70"
            >
              <img src={arrow} alt="" />
            </button>
          </form>
        </article>

        {address && (
          <>
            <article
              className="bg-white rounded-lg shadow p-8 m-8 max-w-6xl xl:mx-auto grid gap-4 lg:grid-cols-4 md:grid-cols-2 text-center md:text-left lg:-mb-20 relative "
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-500">
                <h2 className="uppercase text-sm font-bold mb-4">IP Address</h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.ip}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-500">
                <h2 className="uppercase text-sm font-bold mb-4">Location</h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.location.city}, {address.location.region}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-500">
                <h2 className="uppercase text-sm font-bold mb-4">Timezone</h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.location.timezone}
                </p>
              </div>
              <div className="">
                <h2 className="uppercase text-sm font-bold mb-4">ISP</h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.isp}
                </p>
              </div>
            </article>

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={14}
              scrollWheelZoom={true}
              style={{ width: "100vw", height: "70vh" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a> '
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MarkerPosition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
