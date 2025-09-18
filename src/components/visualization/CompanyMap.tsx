import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Settings, Maximize2 } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: 'company' | 'person' | 'subsidiary';
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  connections: string[];
}

const CompanyMap = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodes: Node[] = [
    {
      id: 'innovtech',
      name: 'INNOVTECH SOLUTIONS',
      type: 'company',
      x: 200,
      y: 150,
      size: 'large',
      connections: ['ceo', 'cto', 'subsidiary1']
    },
    {
      id: 'ceo',
      name: 'Marie Dubois',
      type: 'person',
      x: 150,
      y: 80,
      size: 'medium',
      connections: ['innovtech', 'board1']
    },
    {
      id: 'cto',
      name: 'Pierre Martin',
      type: 'person',
      x: 250,
      y: 80,
      size: 'medium',
      connections: ['innovtech', 'subsidiary2']
    },
    {
      id: 'board1',
      name: 'Jean Lefebvre',
      type: 'person',
      x: 100,
      y: 120,
      size: 'small',
      connections: ['ceo']
    },
    {
      id: 'subsidiary1',
      name: 'INNOVTECH CONSULTING',
      type: 'subsidiary',
      x: 150,
      y: 220,
      size: 'medium',
      connections: ['innovtech', 'subsidiary2']
    },
    {
      id: 'subsidiary2',
      name: 'TECH SERVICES SARL',
      type: 'subsidiary',
      x: 300,
      y: 180,
      size: 'medium',
      connections: ['cto', 'subsidiary1']
    }
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'company': return 'hsl(var(--primary))';
      case 'person': return 'hsl(var(--success))';
      case 'subsidiary': return 'hsl(var(--secondary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getNodeSize = (size: string) => {
    switch (size) {
      case 'large': return 24;
      case 'medium': return 18;
      case 'small': return 14;
      default: return 16;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'company': return Building;
      case 'person': return Users;
      default: return Building;
    }
  };

  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = nodes.find(n => n.id === connectionId);
        if (targetNode && node.id < connectionId) { // Avoid duplicate lines
          lines.push(
            <line
              key={`${node.id}-${connectionId}`}
              x1={node.x}
              y1={node.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }
      });
    });
    return lines;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <CardTitle className="text-base">Cartographie de l'entreprise</CardTitle>
          </div>
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* SVG Canvas */}
          <svg width="400" height="280" className="border rounded-lg bg-muted/20">
            {/* Render connections first (behind nodes) */}
            {renderConnections()}
            
            {/* Render nodes */}
            {nodes.map(node => {
              const Icon = getNodeIcon(node.type);
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={getNodeSize(node.size)}
                    fill={getNodeColor(node.type)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedNode(node)}
                  />
                  <text
                    x={node.x}
                    y={node.y - getNodeSize(node.size) - 8}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Entreprise principale</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Dirigeants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span>Filiales</span>
            </div>
          </div>

          {/* Node Details */}
          {selectedNode && (
            <div className="mt-4 p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{selectedNode.name}</h4>
                <Badge variant="secondary">{selectedNode.type}</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {selectedNode.type === 'company' && (
                  <>
                    <div>• Société mère du groupe</div>
                    <div>• Capital social: 150 000€</div>
                    <div>• Forme juridique: SAS</div>
                  </>
                )}
                {selectedNode.type === 'person' && (
                  <>
                    <div>• Fonction: {selectedNode.name.includes('Marie') ? 'PDG' : 'Directeur Technique'}</div>
                    <div>• Participation: {selectedNode.name.includes('Marie') ? '65%' : '15%'}</div>
                    <div>• Ancienneté: {selectedNode.name.includes('Marie') ? '8 ans' : '5 ans'}</div>
                  </>
                )}
                {selectedNode.type === 'subsidiary' && (
                  <>
                    <div>• Participation: {selectedNode.name.includes('CONSULTING') ? '100%' : '51%'}</div>
                    <div>• Secteur: {selectedNode.name.includes('CONSULTING') ? 'Conseil' : 'Services'}</div>
                    <div>• CA 2023: {selectedNode.name.includes('CONSULTING') ? '850K€' : '1.2M€'}</div>
                  </>
                )}
                <div>• Connexions: {selectedNode.connections.length}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyMap;