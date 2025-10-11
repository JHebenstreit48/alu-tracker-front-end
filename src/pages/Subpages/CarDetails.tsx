// src/pages/MainPages/CarInfo/CarDetails.tsx
import { useParams } from "react-router-dom";
import CarDetailsBody from "@/components/CarInformation/CarDetails/OtherComponents/CarDetailsBody";

export default function CarDetails() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <div className="loading-message">Loading car details...</div>;
  return <CarDetailsBody slug={slug} />;
}