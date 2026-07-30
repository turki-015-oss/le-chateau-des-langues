const MAP_WIDTH = 808;
const MAP_HEIGHT = 1114;
const TILE_SIZE = 256;

type KingdomMapLayersProps = {
  highDetail: boolean;
};

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
  const renderLevel = (level: "2x" | "4x") => (
    <div className={`kingdom-tile-level kingdom-tile-level-${level}`}>
      {tiles.map((tile) => (
        <img
          key={`${level}-${tile.id}`}
          src={`/maps/kingdom-tiles/${level}/tile-${tile.row}-${tile.column}.webp`}
          alt=""
          draggable={false}
          decoding="async"
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
      {renderLevel("2x")}
      {highDetail && renderLevel("4x")}
    </div>
  );
}
