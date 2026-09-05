export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const latitudeHeader = request.headers.get("x-vercel-ip-latitude");
  const longitudeHeader = request.headers.get("x-vercel-ip-longitude");
  const latitude = latitudeHeader === null ? Number.NaN : Number(latitudeHeader);
  const longitude = longitudeHeader === null ? Number.NaN : Number(longitudeHeader);

  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    return Response.json(
      { available: false },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return Response.json(
    { available: true, latitude, longitude },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
