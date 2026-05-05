/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

const CACHE_PREFIX = "kakao_coords_";

function getCachedCoords(address: string): { lat: string; lng: string } | null {
  const cached = localStorage.getItem(CACHE_PREFIX + address);
  return cached ? JSON.parse(cached) : null;
}

function setCachedCoords(address: string, coords: { lat: string; lng: string }) {
  localStorage.setItem(CACHE_PREFIX + address, JSON.stringify(coords));
}

export function getCoords(address: string): Promise<{ lat: string; lng: string } | null> {
  const cached = getCachedCoords(address);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    if (!window.kakao?.maps?.services) {
      resolve(null);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = { lat: result[0].y, lng: result[0].x };
        setCachedCoords(address, coords);
        resolve(coords);
      } else {
        resolve(null);
      }
    });
  });
}

export function initMap(container: HTMLElement, lat: number, lng: number): any {
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 7,
  };
  return new window.kakao.maps.Map(container, options);
}

export function addMarker(
  map: any,
  lat: number,
  lng: number,
  title: string,
  onClick: () => void
): any {
  const marker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(lat, lng),
    map,
    title,
  });

  window.kakao.maps.event.addListener(marker, "click", onClick);
  return marker;
}
