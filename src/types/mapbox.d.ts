
declare namespace mapboxgl {
  export class Map {
    constructor(options: any);
    addControl(control: any, position?: string): this;
    on(event: string, listener: (e?: any) => void): this;
    flyTo(options: any): this;
    getCenter(): { lng: number; lat: number };
  }
  
  export class Marker {
    constructor(element?: HTMLElement);
    setLngLat(lnglat: [number, number]): this;
    addTo(map: Map): this;
    getElement(): HTMLElement;
  }
  
  export class NavigationControl {
    constructor(options?: any);
  }
  
  export class Popup {
    constructor(options?: any);
    setLngLat(lnglat: [number, number]): this;
    setHTML(html: string): this;
    addTo(map: Map): this;
    remove(): this;
  }
}
