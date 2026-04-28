import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const cities = [
  "Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan",
  "Nukus", "Fergana", "Karshi", "Navoi", "Jizzakh",
  "Urgench", "Termez", "Kokand", "Margilan", "Chirchiq"
];

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land Plot" },
];

const conditions = [
  { value: "new", label: "New Build" },
  { value: "euro_renovation", label: "Euro Renovation" },
  { value: "good", label: "Good Condition" },
  { value: "needs_repair", label: "Needs Repair" },
  { value: "rough", label: "Rough / Unfinished" },
];

const initialForm = {
  city: "",
  district: "",
  property_type: "",
  area_sqm: "",
  rooms: "",
  floor: "",
  total_floors: "",
  year_built: "",
  condition: "",
  has_parking: false,
  has_balcony: false,
};

export default function PropertyForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(initialForm);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      area_sqm: Number(form.area_sqm),
      rooms: Number(form.rooms),
      floor: form.floor ? Number(form.floor) : undefined,
      total_floors: form.total_floors ? Number(form.total_floors) : undefined,
      year_built: form.year_built ? Number(form.year_built) : undefined,
    });
  };

  const isValid = form.city && form.property_type && form.area_sqm && form.rooms;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-8"
    >
      {/* Location */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select value={form.city} onValueChange={(v) => update("city", v)}>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District / Neighborhood</Label>
            <Input
              id="district"
              placeholder="e.g. Mirzo Ulugbek"
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={form.property_type} onValueChange={(v) => update("property_type", v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {propertyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Total Area (m²) *</Label>
            <Input
              id="area"
              type="number"
              placeholder="e.g. 85"
              value={form.area_sqm}
              onChange={(e) => update("area_sqm", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Number of Rooms *</Label>
            <Input
              id="rooms"
              type="number"
              placeholder="e.g. 3"
              value={form.rooms}
              onChange={(e) => update("rooms", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              placeholder="e.g. 5"
              value={form.floor}
              onChange={(e) => update("floor", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_floors">Total Floors in Building</Label>
            <Input
              id="total_floors"
              type="number"
              placeholder="e.g. 9"
              value={form.total_floors}
              onChange={(e) => update("total_floors", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_built">Year Built</Label>
            <Input
              id="year_built"
              type="number"
              placeholder="e.g. 2020"
              value={form.year_built}
              onChange={(e) => update("year_built", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Condition & Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Condition & Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v) => update("condition", v)}>
              <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <Label htmlFor="parking" className="cursor-pointer">Parking Available</Label>
            <Switch id="parking" checked={form.has_parking} onCheckedChange={(v) => update("has_parking", v)} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <Label htmlFor="balcony" className="cursor-pointer">Balcony</Label>
            <Switch id="balcony" checked={form.has_balcony} onCheckedChange={(v) => update("has_balcony", v)} />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full md:w-auto px-8 py-3 text-sm font-semibold"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Calculator className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Analyzing Market..." : "Estimate Price"}
      </Button>
    </motion.form>
  );
}
