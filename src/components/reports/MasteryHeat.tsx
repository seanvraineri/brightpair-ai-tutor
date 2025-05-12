import React from 'react';
import { HeatMapGrid } from "react-grid-heatmap";

interface MasteryHeatProps {
  matrix: number[][];
  labels: string[];
}

export function MasteryHeat({ matrix, labels }: MasteryHeatProps) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h3 className="font-semibold mb-4">Mastery Heat-map</h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <HeatMapGrid
            data={matrix}
            xLabels={labels}
            yLabels={['<40%', '40-60', '60-80', '>80%']}
            cellStyle={(_x, _y, val) => ({
              background: `rgba(0,115,255,${val})`,
              borderRadius: '4px',
              margin: '1px',
              width: '100%',
              height: '30px',
              fontSize: '0.8rem',
              color: val > 0.5 ? '#fff' : '#000'
            })}
            cellHeight="30px"
            xLabelsPos="top"
            xLabelsStyle={() => ({
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textAlign: 'center',
              paddingBottom: '5px'
            })}
            yLabelsStyle={() => ({
              fontSize: '0.8rem',
              textAlign: 'right',
              paddingRight: '10px'
            })}
            square={false}
          />
        </div>
      </div>
    </div>
  );
} 