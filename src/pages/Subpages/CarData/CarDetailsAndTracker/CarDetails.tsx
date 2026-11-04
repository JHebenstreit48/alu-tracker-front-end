import { useParams } from "react-router-dom";
import CarDetailsBody from "@/components/CarDetails/OtherComponents/CarDetailsBody";

export default function CarDetails() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <div className="loading-message">Loading car details...</div>;
  return <CarDetailsBody slug={slug} />;
}