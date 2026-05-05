import { Top, Badge, Button } from "@toss/tds-mobile";
import { openURL } from "@apps-in-toss/web-framework";
import exhibitions from "../data/exhibitions.json";

function handleOpenURL(url: string) {
  openURL(url).catch(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

type Exhibition = (typeof exhibitions)[number];

interface DetailPageProps {
  exhibition: Exhibition;
  onBack: () => void;
}

export default function DetailPage({ exhibition, onBack }: DetailPageProps) {
  const now = new Date();
  const isUpcoming = new Date(exhibition.startDate) > now;
  const isOngoing = !isUpcoming && new Date(exhibition.endDate) >= now;
  const statusLabel = isUpcoming ? "오픈예정" : isOngoing ? "진행중" : "종료";
  const statusColor = isUpcoming ? "purple" : isOngoing ? "blue" : "elephant";

  return (
    <div style={{ minHeight: "100vh", background: "#fff", paddingBottom: "100px" }}>
      <Top
        upperGap={16}
        lowerGap={8}
        upper={
          <Button
            size="small"
            variant="weak"
            color="dark"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ←
          </Button>
        }
        title={
          <Top.TitleParagraph size={22}>{exhibition.title}</Top.TitleParagraph>
        }
        subtitleTop={
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <Badge
              size="small"
              variant="weak"
              color={statusColor}
            >
              {statusLabel}
            </Badge>
            <Badge size="small" variant="weak" color="teal">
              {exhibition.category}
            </Badge>
          </div>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {exhibition.venue}
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <InfoRow label="기간" value={`${exhibition.startDate} ~ ${exhibition.endDate}`} />
          <InfoRow label="장소" value={exhibition.address} />
          <InfoRow
            label="입장료"
            value={
              exhibition.price === "무료"
                ? "무료"
                : `${Number(exhibition.price).toLocaleString()}원`
            }
          />
          {exhibition.sourceUrl && (
            <InfoRow
              label="홈페이지"
              value={exhibition.sourceUrl}
              onPress={() => handleOpenURL(exhibition.sourceUrl)}
            />
          )}
        </div>
      </div>

      {exhibition.sourceUrl && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            background: "white",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
            zIndex: 1000,
          }}
        >
          <Button
            display="full"
            size="xlarge"
            color="primary"
            onClick={() => handleOpenURL(exhibition.sourceUrl)}
          >
            공식 사이트 바로가기
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <span style={{ width: "48px", fontSize: "14px", color: "#999", flexShrink: 0 }}>
        {label}
      </span>
      {onPress ? (
        <button
          onClick={onPress}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "14px",
            color: "#3D5AFE",
            textDecoration: "underline",
            wordBreak: "break-all",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {value}
        </button>
      ) : (
        <span style={{ fontSize: "14px", color: "#222" }}>{value}</span>
      )}
    </div>
  );
}
