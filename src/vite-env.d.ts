/// <reference types="vite/client" />

// JSON modül tanımlaması
declare module "*.json" {
  const value: any;
  export default value;
}
