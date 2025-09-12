// Standard API response structure for paginated data
export interface ApiResponse<T> {
  items: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
