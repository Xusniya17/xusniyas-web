import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropertyForm from "@/components/estimate/PropertyForm";
import EstimateResult from "@/components/estimate/EstimateResult";
import { motion } from "framer-motion";

export default function Estimate() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();

  const estimateMutation = useMutation({
    mutationFn: async (data) => {
      const prompt = `You are a real estate pricing expert for Uzbekistan. Estimate the market price for the following property.

Property Details:
- City: ${data.city}
- District: ${data.district || "Not specified"}
- Type: ${data.property_type}
- Area: ${data.area_sqm} sq meters
- Rooms: ${data.rooms}
- Floor: ${data.floor || "Not specified"} / ${data.total_floors || "Not specified"}
- Year Built: ${data.year_built || "Not specified"}
- Condition: ${data.condition || "Not specified"}
- Parking: ${data.has_parking ? "Yes" : "No"}
- Balcony: ${data.has_balcony ? "Yes" : "No"}

Based on current 2024-2025 real estate market data in Uzbekistan, provide a price estimate. Consider:
- Average prices in ${data.city} for ${data.property_type}s
- The district premium/discount
- Property condition and age
- Amenities
- Current market trends in Uzbekistan
- The UZS to USD exchange rate is approximately 12,800 UZS per 1 USD

Provide a realistic market estimate.`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            estimated_price_usd: { type: "number", description: "Estimated price in USD" },
            estimated_price_uzs: { type: "number", description: "Estimated price in UZS" },
            price_per_sqm_usd: { type: "number", description: "Price per sq meter in USD" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            ai_notes: { type: "string", description: "Brief analysis of the pricing factors (2-3 sentences)" },
          },
        },
      });

      return { ...data, ...res };
    },
    onSuccess: (data) => {
      setResult(data);
      setFormData(data);
      setIsSaved(false);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Estimate.create(data),
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
    },
  });

  const handleEstimate = (data) => {
    setResult(null);
    estimateMutation.mutate(data);
  };

  const handleSave = () => {
    if (formData) saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    setIsSaved(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Price Estimation
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Enter property details to get an AI-powered market value estimate.
        </p>
      </motion.div>

      {!result ? (
        <PropertyForm onSubmit={handleEstimate} isLoading={estimateMutation.isPending} />
      ) : (
        <EstimateResult
          result={result}
          onSave={handleSave}
          onReset={handleReset}
          isSaving={saveMutation.isPending}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
