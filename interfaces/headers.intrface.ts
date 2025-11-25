export interface HeaderRequestProps {
  trace_id: string;
  correlation_id: string;
  parent_request_id: string | null;
  origin_service: string;
  request_id: string;
  latency_ms: string; // Internal latency (controller processing time)
  latency_ms_high_res: string; // Internal latency high-res
  internal_latency_ms: string;
  internal_latency_ms_high_res: string;
}
