export interface Terminal {
  id: string;
  label: string;
}

export interface Connection {
  deviceTerminalId: string;
  controllerTerminalId: string;
  note: string;
}

export interface WiringDiagramSummary {
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

export interface WiringDiagram extends WiringDiagramSummary {
  deviceLabel: string;
  deviceTerminals: Terminal[];
  controllerLabel: string;
  controllerTerminals: Terminal[];
  connections: Connection[];
  notes: string;
  commonMistakes: string[];
}
