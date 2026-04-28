import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const conditionLabels = {
  new: "New Build",
  euro_renovation: "Euro Renovation",
  good: "Good",
  needs_repair: "Needs Repair",
  rough: "Rough",
};

const propertyTypeLabels = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  land: "Land",
};

export default function RecentEstimates({ estimates }) {
  if (!estimates || estimates.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No estimates yet. Create your first one!</p>
        <Link
          to="/estimate"
          className="inline-flex items-center gap-2 mt-4 text-primary font-medium text-sm hover:underline"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="divide-y divide-border">
        {estimates.map((est, i) => (
          <motion.div
            key={est.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="font-semibold text-sm truncate">
                    {est.city}{est.district ? `, ${est.district}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{propertyTypeLabels[est.property_type] || est.property_type}</span>
                  <span>·</span>
                  <span>{est.area_sqm} m²</span>
                  <span>·</span>
                  <span>{est.rooms} rooms</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-bold text-sm">
                  ${est.estimated_price_usd?.toLocaleString()}
                </p>
                <Badge
                  variant="secondary"
                  className={`text-[10px] mt-1 ${
                    est.confidence === "high"
                      ? "bg-primary/10 text-primary"
                      : est.confidence === "medium"
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {est.confidence} confidence
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
