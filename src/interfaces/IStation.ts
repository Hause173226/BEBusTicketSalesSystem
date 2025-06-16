export interface IStation {
  name: string;
  code?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  status?: "active" | "inactive";
}
