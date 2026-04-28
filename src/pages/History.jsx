import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Trash2, MapPin, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const propertyTypeLabels = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  land: "Land",
};

const confidenceStyles = {
  high: "bg-primary/10 text-primary",
  medium: "bg-accent/10 text-accent",
  low: "bg-destructive/10 text-destructive",
};

export default function History() {
  const queryClient = useQueryClient();

  const { data: estimates = [], isLoading } = useQuery({
    queryKey: ["estimates"],
    queryFn: () => base44.entities.Estimate.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Estimate.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["estimates"] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Estimation History
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {estimates.length} estimate{estimates.length !== 1 ? "s" : ""} saved
        </p>
      </motion.div>

      {estimates.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No saved estimates yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {estimates.map((est, i) => (
            <motion.div
              key={est.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-2xl border border-border p-5 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-semibold">
                      {est.city}{est.district ? `, ${est.district}` : ""}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {propertyTypeLabels[est.property_type] || est.property_type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{est.area_sqm} m² · {est.rooms} rooms</span>
                    {est.floor && <span>Floor {est.floor}/{est.total_floors}</span>}
                    {est.created_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(est.created_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  {est.ai_notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{est.ai_notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-xl font-bold font-display">
                        {est.estimated_price_usd?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ${est.price_per_sqm_usd?.toLocaleString()}/m²
                      </span>
                      <Badge variant="secondary" className={`text-[10px] ${confidenceStyles[est.confidence]}`}>
                        {est.confidence}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(est.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
