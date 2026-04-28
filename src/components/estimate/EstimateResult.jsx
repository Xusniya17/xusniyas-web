import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, MapPin, Ruler, Save, RotateCcw, CheckCircle2 } from "lucide-react";

const confidenceStyles = {
  high: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function EstimateResult({ result, onSave, onReset, isSaving, isSaved }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-primary/5 border-b border-border px-6 md:px-8 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Estimated Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold font-display text-foreground">
                ${result.estimated_price_usd?.toLocaleString()}
              </span>
              <Badge variant="outline" className={confidenceStyles[result.confidence]}>
                {result.confidence} confidence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {result.estimated_price_uzs?.toLocaleString()} UZS
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border-b border-border">
        <div className="p-5 text-center">
          <DollarSign className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">${result.price_per_sqm_usd?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">per m²</p>
        </div>
        <div className="p-5 text-center">
          <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">{result.city}</p>
          <p className="text-xs text-muted-foreground">{result.district || "—"}</p>
        </div>
        <div className="p-5 text-center">
          <Ruler className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">{result.area_sqm} m²</p>
          <p className="text-xs text-muted-foreground">{result.rooms} rooms</p>
        </div>
        <div className="p-5 text-center">
          <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold capitalize">{result.condition?.replace("_", " ") || "—"}</p>
          <p className="text-xs text-muted-foreground">condition</p>
        </div>
      </div>

      {/* AI Notes */}
      {result.ai_notes && (
        <div className="px-6 md:px-8 py-5 border-b border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">AI Analysis</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{result.ai_notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 md:px-8 py-5 flex flex-wrap gap-3">
        <Button
          onClick={onSave}
          disabled={isSaving || isSaved}
          className="gap-2"
        >
          {isSaved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaved ? "Saved" : isSaving ? "Saving..." : "Save Estimate"}
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Estimate
        </Button>
      </div>
    </motion.div>
  );
}
