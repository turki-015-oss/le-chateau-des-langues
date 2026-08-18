/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/unity-map/Build/:asset*.unityweb",
        headers: [{ key: "Content-Encoding", value: "br" }],
      },
    ];
  },
};

export default nextConfig;
