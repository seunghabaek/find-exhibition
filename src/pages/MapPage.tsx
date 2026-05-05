import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Top, Loader, SegmentedControl, ListRow, Badge } from "@toss/tds-mobile";
import { getCoords, initMap, addMarker } from "../hooks/useKakaoMap";
import exhibitions from "../data/exhibitions.json";

type Exhibition = (typeof exhibitions)[number];
type Filter = "all" | "free" | "paid";

interface MapPageProps {
  onSelectExhibition: (exhibition: Exhibition) => void;
}

interface MarkerEntry {
  marker: ReturnType<typeof addMarker>;
  exhibition: Exhibition;
}

export default function MapPage({ onSelectExhibition }: MapPageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof initMap> | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredExhibitions = useMemo(() => {
    if (filter === "free") return exhibitions.filter((e) => e.price === "무료");
    if (filter === "paid") return exhibitions.filter((e) => e.price !== "무료");
    return exhibitions;
  }, [filter]);

  const applyFilter = useCallback((f: Filter) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    for (const { marker, exhibition } of markersRef.current) {
      const isFree = exhibition.price === "무료";
      const visible =
        f === "all" || (f === "free" && isFree) || (f === "paid" && !isFree);
      marker.setMap(visible ? map : null);
    }
  }, []);

  const handleFilterChange = (value: string) => {
    const f = value as Filter;
    setFilter(f);
    applyFilter(f);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const waitForKakao = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.kakao?.maps?.Map) {
            clearInterval(interval);
            resolve();
          } else if (window.kakao?.maps && !window.kakao.maps.Map) {
            clearInterval(interval);
            window.kakao.maps.load(() => resolve());
          } else if (attempts > 30) {
            clearInterval(interval);
            reject(new Error("카카오맵 로드 실패"));
          }
        }, 300);
      });
    };

    const loadMap = async () => {
      try {
        await waitForKakao();
        const map = initMap(mapRef.current!, 37.5665, 126.9780);
        mapInstanceRef.current = map;

        for (const exhibition of exhibitions) {
          const coords = await getCoords(exhibition.address);
          if (coords) {
            const marker = addMarker(
              map,
              parseFloat(coords.lat),
              parseFloat(coords.lng),
              exhibition.title,
              () => onSelectExhibition(exhibition)
            );
            markersRef.current.push({ marker, exhibition });
          }
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, [onSelectExhibition]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 헤더 + 필터 */}
      <div style={{ flexShrink: 0, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Top
          upperGap={16}
          lowerGap={12}
          title={
            <Top.TitleParagraph size={18}>서울 전시회</Top.TitleParagraph>
          }
        />
        <div style={{ padding: "0 16px 16px" }}>
          <SegmentedControl
            value={filter}
            onChange={handleFilterChange}
            size="small"
            alignment="fixed"
          >
            <SegmentedControl.Item value="all">전체</SegmentedControl.Item>
            <SegmentedControl.Item value="free">무료</SegmentedControl.Item>
            <SegmentedControl.Item value="paid">유료</SegmentedControl.Item>
          </SegmentedControl>
        </div>
      </div>

      {/* 지도 */}
      <div style={{ position: "relative", flex: "0 0 45vh" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.9)",
              zIndex: 10,
            }}
          >
            <Loader size="medium" type="primary" label="지도를 불러오는 중..." />
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <p style={{ color: "#666", fontSize: "15px" }}>
              카카오맵 API 키를 확인해주세요.
            </p>
          </div>
        )}
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* 하단 리스트 */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {filteredExhibitions.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
            해당하는 전시가 없어요
          </div>
        ) : (
          filteredExhibitions.map((exhibition) => {
            const isFree = exhibition.price === "무료";
            const now = new Date();
            const isUpcoming = new Date(exhibition.startDate) > now;
            const isOngoing = !isUpcoming && new Date(exhibition.endDate) >= now;
            const statusLabel = isUpcoming ? "오픈예정" : isOngoing ? "진행중" : "종료";
            const statusColor = isUpcoming ? "purple" : isOngoing ? "blue" : "elephant";
            return (
              <ListRow
                key={exhibition.id}
                withTouchEffect
                onClick={() => onSelectExhibition(exhibition)}
                left={
                  exhibition.thumbnailUrl ? (
                    <ListRow.AssetImage
                      src={exhibition.thumbnailUrl}
                      shape="squircle"
                      size="small"
                    />
                  ) : undefined
                }
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top={exhibition.title}
                    bottom={`${exhibition.venue} · ${exhibition.startDate} ~ ${exhibition.endDate}`}
                  />
                }
                right={
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                    <Badge size="xsmall" variant="weak" color={isFree ? "teal" : "elephant"}>
                      {isFree ? "무료" : `${Number(exhibition.price).toLocaleString()}원`}
                    </Badge>
                    <Badge size="xsmall" variant="weak" color={statusColor}>
                      {statusLabel}
                    </Badge>
                  </div>
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
