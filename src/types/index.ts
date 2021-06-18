export interface Plant {
  id: number;
  name: string;
  waterIntervalInDays: number;
  daysSinceWatered: number;
  description?: string;
  imageUrl: string;
  hZone: HZone;
}

type HZone = "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "H7" | "H8";
