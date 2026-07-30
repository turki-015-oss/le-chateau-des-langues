const MAP_WIDTH = 808;
const MAP_HEIGHT = 1114;
const TILE_SIZE = 256;

type KingdomMapLayersProps = {
  highDetail: boolean;
};

type MapLayer = {
  id: "base" | "detail";
  directory: "base-2x" | "detail-4x";
  className: string;
};

const MAP_LAYERS: MapLayer[] = [
  {
    id: "base",
    directory: "base-2x",
    className: "kingdom-tile-layer-base"
  },
  {
    id: "detail",
    directory: "detail-4x",
    className: "kingdom-tile-layer-detail"
  }
];

const tiles = Array.from(
  {
    length:
      Math.ceil(MAP_WIDTH / TILE_SIZE) *
      Math.ceil(MAP_HEIGHT / TILE_SIZE)
  },
  (_, index) => {
    const columns = Math.ceil(MAP_WIDTH / TILE_SIZE);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const left = column * TILE_SIZE;
    const top = row * TILE_SIZE;

    return {
      id: `${row}-${column}`,
      row,
      column,
      left,
      top,
      width: Math.min(TILE_SIZE, MAP_WIDTH - left),
      height: Math.min(TILE_SIZE, MAP_HEIGHT - top)
    };
  }
);

export default function KingdomMapLayers({ highDetail }: KingdomMapLayersProps) {
  const renderLayer = (layer: MapLayer) => (
    <div
      className={`kingdom-tile-layer ${layer.className}`}
      data-map-layer={layer.id}
    >
      {tiles.map((tile) => (
        <img
          key={`${layer.id}-${tile.id}`}
          src={`/maps/kingdom-tiles/${layer.directory}/tile-${tile.row}-${tile.column}.webp`}
          alt=""
          draggable={false}
          decoding="async"
          loading={layer.id === "base" ? "eager" : "lazy"}
          className="kingdom-map-tile"
          style={{
            left: tile.left,
            top: tile.top,
            width: tile.width,
            height: tile.height
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="kingdom-artwork-layer" aria-hidden="true">
      {renderLayer(MAP_LAYERS[0])}
      {highDetail && renderLayer(MAP_LAYERS[1])}
    </div>
  );
}
