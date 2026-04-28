import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Calculator, History, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import RecentEstimates from "@/components/dashboard/RecentEstimates";

export default function Home() {
  const { data: estimates = [], isLoading } = useQuery({
    queryKey: ["estimates"],
    queryFn: () => base44.entities.Estimate.list("-created_date", 50),
  });

  const totalEstimates = estimates.length;
  const avgPrice = totalEstimates > 0
    ? Math.round(estimates.reduce((s, e) => s + (e.estimated_price_usd || 0), 0) / totalEstimates)
    : 0;
  const avgPricePerSqm = totalEstimates > 0
    ? Math.round(estimates.reduce((s, e) => s + (e.price_per_sqm_usd || 0), 0) / totalEstimates)
    : 0;
  const topCity = totalEstimates > 0
    ? Object.entries(estimates.reduce((acc, e) => { acc[e.city] = (acc[e.city] || 0) + 1; return acc; }, {}))
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
    : "—";

  const recentEstimates = estimates.slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
          Real Estate Pricing
        </h1>
        <p className="text-muted-foreground mt-2 text-base max-w-lg">
          AI-powered property valuation for the Uzbekistan market. Get instant estimates based on location, size, and condition.
        </p>
        <Link to="/estimate">
          <Button className="mt-5 gap-2" size="lg">
            <Calculator className="w-4 h-4" />
            New Estimate
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          title="Total Estimates"
          value={totalEstimates}
          subtitle="all time"
          icon={History}
          delay={0}
        />
        <StatCard
          title="Average Price"
          value={avgPrice > 0 ? `$${avgPrice.toLocaleString()}` : "—"}
          subtitle="across all properties"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          title="Avg. Price / m²"
          value={avgPricePerSqm > 0 ? `$${avgPricePerSqm.toLocaleString()}` : "—"}
          subtitle="per square meter"
          icon={Building2}
          delay={0.2}
        />
        <StatCard
          title="Top City"
          value={topCity}
          subtitle="most estimated"
          icon={Calculator}
          delay={0.3}
        />
      </div>

      {/* Recent */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Estimates</h2>
        {totalEstimates > 5 && (
          <Link to="/history" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <RecentEstimates estimates={recentEstimates} />
      )}
    </div>
  );
}
