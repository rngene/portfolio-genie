import { SizeCalculator } from "@/components/size-calculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Portfolio Genie'
}


export default function Home() {
  return (
   <>
   <SizeCalculator></SizeCalculator>
   </>
  );
}
