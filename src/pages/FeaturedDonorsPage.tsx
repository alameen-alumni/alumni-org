import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

// Helper function to display last_class in full form
function getLastClassLabel(val: string) {
  if (val === "10") return "Madhyamik";
  if (val === "12") return "Higher Secondary";
  return val || "N/A";
}

interface Donor {
  id: string;
  name: string;
  badge: string;
  amount: number;
  education?: {
    last_class?: string;
  };
}

const FeaturedDonorsPage = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchAllFeaturedDonors = async () => {
      try {
        const q = query(
          collection(db, "featured_donors"),
          orderBy("amount", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedDonors: Donor[] = [];
        querySnapshot.forEach((doc) => {
          fetchedDonors.push({ id: doc.id, ...doc.data() } as Donor);
        });
        setDonors(fetchedDonors);
      } catch (error) {
        console.error("Error fetching all featured donors:", error);
      }
    };

    fetchAllFeaturedDonors();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Our Valued Donors</h1>
      <p className="text-center text-gray-600 mb-8">
        We extend our deepest gratitude to all our featured donors for their
        incredible generosity and support.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {donors.map((donor) => (
          <div
            key={donor.id}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <h3 className="text-xl font-semibold">{donor.name}</h3>
            <div className="flex justify-center">
              {donor.education?.last_class && (
                <p className="text-gray-500">
                  {getLastClassLabel(donor.education.last_class)}
                </p>
              )}
              {donor.badge && (
                <p className="text-gray-500">
                  {", "}
                  {donor.badge}
                </p>
              )}
            </div>
            <p className="text-2xl font-semibold text-green-600 mt-2">
              ₹{donor.amount}
            </p>
          </div>
        ))}
        {donors.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No featured donors to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedDonorsPage;
