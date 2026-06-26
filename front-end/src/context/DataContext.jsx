import React, { createContext, useContext, useEffect, useState } from "react";

// Shared cache for the site-wide profile + social data so it's fetched once
// instead of separately in App, Header, Welcome, Footer and ContactComponent.
const DataContext = createContext({ basicInfo: {}, socialMedia: {}, loading: true });

export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [basicInfo, setBasicInfo] = useState({});
  const [socialMedia, setSocialMedia] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const res = await fetch("/api/socialMedia/get-socialMedia");
        if (res.ok) setSocialMedia(await res.json());
      } catch (error) {
        console.log(error);
      }
    };

    // Render's free tier can be cold on the first request; retry so the data
    // (and the hero skeleton) reliably resolves instead of hanging.
    const fetchBasicInfo = async (attempt = 0) => {
      try {
        const res = await fetch("/api/basicInfo/get-basicInfo");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setBasicInfo(await res.json());
        fetchSocialMedia();
        setLoading(false);
      } catch (error) {
        console.log(error);
        if (attempt < 6) setTimeout(() => fetchBasicInfo(attempt + 1), 5000);
      }
    };

    fetchBasicInfo();
  }, []);

  // Keep the tab title + favicon in sync with the profile (moved here from App).
  useEffect(() => {
    if (basicInfo.brandName) document.title = basicInfo.brandName;
    if (basicInfo.profileImage) {
      const favicon = document.getElementById("favicon");
      if (favicon) favicon.href = basicInfo.profileImage;
    }
  }, [basicInfo.brandName, basicInfo.profileImage]);

  return (
    <DataContext.Provider value={{ basicInfo, socialMedia, loading }}>
      {children}
    </DataContext.Provider>
  );
}
