
import React from 'react';

interface HeatmapProps {
  history: Record<string, number>;
}

const Heatmap: React.FC<HeatmapProps> = ({ history }) => {
  const today = new Date();
  const weeks = 24; // Show last 24 weeks for mobile friendliness
  const daysPerWeek = 7;
  
  const getColor = (count: number) => {
    if (count === 0) return '#ebedf0';
    if (count <= 2) return '#c6e48b';
    if (count <= 5) return '#7bc96f';
    if (count <= 10) return '#239a3b';
    return '#196127';
  };

  const renderCells = () => {
    const cells = [];
    for (let w = 0; w < weeks; w++) {
      const column = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - ((weeks - 1 - w) * 7 + (6 - d)));
        const dateString = date.toISOString().split('T')[0];
        const count = history[dateString] || 0;
        
        column.push(
          <div
            key={dateString}
            className="w-3 h-3 m-[1px] rounded-sm transition-colors duration-300 group relative"
            style={{ backgroundColor: getColor(count) }}
          >
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[10px] whitespace-nowrap z-50 rounded pixel-border">
              {dateString}: {count} 草料
            </div>
          </div>
        );
      }
      cells.push(<div key={w} className="flex flex-col">{column}</div>);
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center w-full p-4 pixel-border bg-[#00000044] overflow-x-auto">
      <h3 className="pixel-font text-[10px] mb-4 text-white opacity-70">我的守护轨迹 (贡献热力图)</h3>
      <div className="flex">
        {renderCells()}
      </div>
      <div className="flex items-center mt-4 space-x-2 text-[10px] opacity-60">
        <span>Less</span>
        <div className="w-3 h-3 bg-[#ebedf0] rounded-sm"></div>
        <div className="w-3 h-3 bg-[#c6e48b] rounded-sm"></div>
        <div className="w-3 h-3 bg-[#7bc96f] rounded-sm"></div>
        <div className="w-3 h-3 bg-[#239a3b] rounded-sm"></div>
        <div className="w-3 h-3 bg-[#196127] rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
