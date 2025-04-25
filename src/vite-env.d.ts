/// <reference types="vite/client" />

// JSON modül tanımlaması
declare module "*.json" {
  const value: Record<string, unknown>;
  export default value;
}
