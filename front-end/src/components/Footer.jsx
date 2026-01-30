import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSettings } from "react-icons/ci";

export default function Footer() {
  const { currentUser } = useSelector((state) => state.user);
const [basicInfo, setBasicInfo] = useState({});

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/basicInfo/get-basicInfo");
        const data = await res.json();
        setBasicInfo(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <div className="bg-gray-800 mt-10 md:mt-16 flex  justify-around py-5">
      <div>
        <p className="font-sans text-white">
        <span className="">&#169;</span> 2026 {" "}
<span className="text-yellow-300" id="footerBrand">{basicInfo.brandName}</span>{" "}


        </p>
      </div>
      <div>
      <p className="font-sans">
        
        {currentUser ?(
          <Link to="/edit" className="hover:underline text-white font-semibold">
         Edit page
        </Link>
        ) : (<Link to="/sign-in" className="hover:underline text-white font-semibold">
      Edit page
      </Link>)}
     
      </p>
      </div>
     
    </div>
  );
}
