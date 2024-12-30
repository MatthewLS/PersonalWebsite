// next.config.js
module.exports = {
  images: {
    domains: ["9rqfeqtwbsb4tcsg.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9rqfeqtwbsb4tcsg.public.blob.vercel-storage.com",
        pathname: "/**", // Allow all paths under this domain
      },
    ],
  },
};
