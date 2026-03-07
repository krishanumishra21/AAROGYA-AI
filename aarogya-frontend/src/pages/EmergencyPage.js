import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmergencyPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `http://localhost:5000/api/emergency/${id}`
      );
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, [id]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border-4 border-red-500">

        <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
          🚑 EMERGENCY MEDICAL CARD
        </h1>

        <div className="space-y-4 text-sm">

          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold">Name</p>
            <p className="text-lg">{user.name}</p>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold">Blood Group</p>
            <p className="text-xl font-bold text-red-600">
              {user.bloodGroup || "Not Provided"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Allergies</p>
            <p className="text-red-600 font-medium">
              {user.allergies || "None Reported"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Chronic Diseases</p>
            <p>
              {user.chronicDiseases || "None Reported"}
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="font-semibold">Emergency Contact</p>
            <a
              href={`tel:${user.emergencyContact}`}
              className="text-blue-600 font-medium"
            >
              📞 {user.emergencyContact || "Not Provided"}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}