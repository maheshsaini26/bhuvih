"use client";

import usePremiumModal from "@/hooks/usePremiumModal";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = ["Infinite resumes", "Design customizations"];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  const [loading] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl rounded-lg bg-white shadow-2xl p-6 border border-gray-200">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">Resume Builder AI Premium</DialogTitle>
        </DialogHeader>
        <p className="text-center text-gray-600">Get a premium subscription to unlock more features.</p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-6">
          {/* Premium Plan */}
          <div className="flex w-full md:w-1/2 flex-col items-center rounded-lg border border-gray-300 bg-gray-50 p-6 shadow-lg transition hover:scale-105 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-700">Premium</h3>
            <ul className="mt-4 space-y-2 text-gray-600">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="size-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md">
              Get Premium
            </Button>
          </div>
          {/* Premium Plus Plan */}
          <div className="flex w-full md:w-1/2 flex-col items-center rounded-lg border border-gray-300 bg-gradient-to-r from-green-500 to-green-400 p-6 shadow-lg transition hover:scale-105 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-white">Premium Plus</h3>
            <ul className="mt-4 space-y-2 text-white">
              {premiumPlusFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="size-4 text-white" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full bg-white text-green-600 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-100">
              Get Premium Plus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}